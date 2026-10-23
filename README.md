# Python Learn

Free daily Python practice from absolute zero, built to go alongside CS50's Introduction to Programming with Python (CS50P) on edX.

**Live site:** https://chak720.github.io/python-learn/ (once GitHub Pages is switched on)

- **Daily**: today's lesson, a three-question warm-up, then three coding problems: two new ones from where you are in the course and one you've seen before to solve from memory.
- **Learn**: 12 units that follow CS50P's lectures in order, from `print("hello, world")` to classes. Each unit has a plain-English lesson, quick questions and checked coding problems.
- **Practice**: drill quick questions by unit, or re-solve any problem from a blank page.
- **Profile**: problems solved, accuracy per unit, a 5-week heatmap and your review queue.

The problems practise the same skills as each CS50P problem set without copying them, so do the official problem sets yourself afterwards.

Your code runs as real Python 3.12 in the browser (via [Pyodide](https://pyodide.org)), so nothing is installed and nothing is sent anywhere. The first load downloads Python, which takes 10 to 20 seconds; after that it's cached.

Progress is saved in your browser only. Use **Profile → Copy progress** to move it to another device.

## How it's built

Plain HTML, CSS and JavaScript with no build step, so any static host works.

- `assets/curriculum.js`: units, lessons, quick questions, problems and their tests
- `assets/app.js`: views, daily set, progress and the test checker
- `assets/py-worker.js`: runs Python in a Web Worker so a runaway loop can be stopped
- `assets/harness.py`: runs a program against one test (input lines, arguments, files, extra Python checks)
- `daily.json` (optional): a daily message and up to two extra problems, picked up automatically when present
