# Python Learn harness: runs a learner's program against one test inside Pyodide.
# The worker calls __pl_run(code, test_json) and gets JSON back. Also runs under plain CPython for local checks.
import builtins, contextlib, io, json, linecache, os, shutil, sys, traceback, types

WORK = "/tmp/pl_work"
FILE = "program.py"


class _NeedsInput(Exception):
    pass


class _Tee(io.TextIOBase):
    def __init__(self, *targets):
        self.targets = targets

    def write(self, s):
        for t in self.targets:
            t.write(s)
        return len(s)


# Minimal pytest stand-in so test files can `import pytest` and use pytest.raises
_pytest = types.ModuleType("pytest")


class _Raises:
    def __init__(self, exc):
        self.exc = exc

    def __enter__(self):
        return self

    def __exit__(self, et, ev, tb):
        if et is None:
            raise AssertionError(f"DID NOT RAISE {self.exc.__name__}")
        return issubclass(et, self.exc)


_pytest.raises = _Raises


def _reset_dir(files):
    for name in list(sys.modules):
        mod = sys.modules[name]
        if getattr(mod, "__file__", None) and str(mod.__file__).startswith(WORK):
            del sys.modules[name]
    os.chdir("/")
    if os.path.isdir(WORK):
        shutil.rmtree(WORK)
    os.makedirs(WORK)
    os.chdir(WORK)
    if WORK not in sys.path:
        sys.path.insert(0, WORK)
    for name, content in (files or {}).items():
        path = os.path.join(WORK, name)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)


def _user_tb(e):
    tb = e.__traceback__
    while tb and tb.tb_frame.f_code.co_filename != FILE:
        tb = tb.tb_next
    if isinstance(e, SyntaxError) or tb is None:
        return "".join(traceback.format_exception_only(type(e), e))
    return "".join(traceback.format_exception(type(e), e, tb))


def _exec(code, name, stdin, argv, out, err, transcript, strict_input=False):
    """Run code once. Returns (namespace, exit_code, error_text)."""
    lines = list(stdin or [])

    def fake_input(prompt=""):
        prompt = str(prompt)
        transcript.write(prompt)
        if strict_input:
            raise _NeedsInput()
        if not lines:
            transcript.write("\n")
            raise EOFError("EOF when reading a line")
        value = lines.pop(0)
        transcript.write(value + "\n")
        return value

    linecache.cache[FILE] = (len(code), None, code.splitlines(True), FILE)
    ns = {"__name__": name, "__builtins__": builtins, "__file__": FILE}
    saved = (sys.stdout, sys.stderr, builtins.input, sys.argv)
    sys.stdout = _Tee(out, transcript)
    sys.stderr = _Tee(err, transcript)
    builtins.input = fake_input
    sys.argv = [FILE] + list(argv or [])
    sys.modules.setdefault("pytest", _pytest)
    exit_code, error = 0, None
    try:
        exec(compile(code, FILE, "exec"), ns)
    except _NeedsInput:
        raise
    except SystemExit as e:
        if e.code is None:
            exit_code = 0
        elif isinstance(e.code, int):
            exit_code = e.code
        else:
            sys.stderr.write(str(e.code) + "\n")
            exit_code = 1
    except BaseException as e:
        exit_code = 1
        error = _user_tb(e)
        if isinstance(e, EOFError):
            error += "\nYour program asked for more input than it was given.\n"
        transcript.write(error)
    finally:
        sys.stdout, sys.stderr, builtins.input, sys.argv = saved
    return ns, exit_code, error


def __pl_run(code, test_json):
    t = json.loads(test_json)
    _reset_dir(t.get("files"))
    out, err, transcript = io.StringIO(), io.StringIO(), io.StringIO()
    res = {"stdout": "", "stderr": "", "transcript": "", "error": None, "exit": 0, "check": None}
    ns = {}
    if not t.get("skipRun"):
        ns, res["exit"], res["error"] = _exec(code, t.get("name", "__main__"), t.get("stdin"), t.get("argv"), out, err, transcript)
    res["stdout"], res["stderr"], res["transcript"] = out.getvalue(), err.getvalue(), transcript.getvalue()

    if t.get("check"):

        def fresh(name="program"):
            o, e, tr = io.StringIO(), io.StringIO(), io.StringIO()
            try:
                m, code_, error = _exec(code, name, [], [], o, e, tr, strict_input=True)
            except _NeedsInput:
                raise AssertionError(
                    "Your code asked for input when it was imported. Call main() inside "
                    "if __name__ == \"__main__\": so importing your file doesn't run it."
                )
            if error:
                raise AssertionError("Your code crashed when it was imported:\n" + error)
            return m

        def use_module(name, src):
            with open(os.path.join(WORK, name + ".py"), "w", encoding="utf-8") as f:
                f.write(src)
            sys.modules.pop(name, None)

        def run_tests(m):
            names = [k for k, v in m.items() if k.startswith("test_") and callable(v)]
            failed = []
            for k in names:
                try:
                    with contextlib.redirect_stdout(io.StringIO()):
                        m[k]()
                except Exception:
                    failed.append(k)
            return names, failed

        def read(path):
            with open(os.path.join(WORK, path), encoding="utf-8") as f:
                return f.read()

        def get(m, name):
            assert name in m, f"Couldn't find {name} in your code. Check the spelling and that it isn't indented inside something else."
            return m[name]

        env = {"ns": ns, "out": res["stdout"], "code": code, "fresh": fresh, "use_module": use_module,
               "run_tests": run_tests, "read": read, "get": get, "__builtins__": builtins}
        saved_in = builtins.input

        def no_input(prompt=""):
            raise EOFError("EOF when reading a line")

        builtins.input = no_input
        try:
            with contextlib.redirect_stdout(io.StringIO()):
                exec(t["check"], env)
            res["check"] = {"ok": True}
        except AssertionError as e:
            res["check"] = {"ok": False, "msg": str(e) or "A check on your code failed."}
        except Exception as e:
            res["check"] = {"ok": False, "msg": f"{type(e).__name__}: {e}"}
        finally:
            builtins.input = saved_in
            os.chdir(WORK)
    return json.dumps(res)
