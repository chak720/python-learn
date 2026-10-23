/* Python Learn curriculum, following CS50's Introduction to Programming with Python (CS50P).
   Unit: {n,week,title,sections:[{h,p}],takeaways,quick:[...],problems:[...]}
   Quick question: {q,code?,a:"typed answer"} or {q,code?,opts:[...],a:index}, plus why.
   Problem: {id,title,brief,starter,tests,hints,solution,argv?,files?}
   Test: {stdin?,argv?,files?,out?,match?:"exact"|"contains"|"regex",ci?,exit?:"nonzero"|n,errIncludes?,check?,skipRun?,label?} */
"use strict";
const py=String.raw;
const CS50P_URL="https://cs50.harvard.edu/python/";
const WEEKS=["Functions, Variables","Conditionals","Loops","Exceptions","Libraries","Unit Tests","File I/O","Regular Expressions","Object-Oriented Programming","Et Cetera"];
const UNITS=[
{n:1,week:0,title:"Your first lines of Python",
 sections:[
  {h:"What a program is",p:"A program is a list of instructions that the computer follows in order, top to bottom. Python is a language for writing those instructions, and it reads a lot like English. The computer does exactly what you wrote, not what you meant. Most of programming is closing the gap between those two."},
  {h:"print shows things",p:"print(\"hello, world\") puts the words hello, world on the screen. print is a function: a named action that does something. The parentheses hold what you hand to it, called arguments."},
  {h:"Text goes in quotes",p:"Text in quotes is called a string. \"hello\" is text. hello without quotes means a variable called hello, and Python will complain it doesn't know that name. Single and double quotes both work, as long as they match."},
  {h:"Errors are clues, not failure",p:"Everyone hits errors all the time. A SyntaxError means Python couldn't read a line, usually because of a missing quote or bracket. A NameError means it met a word it doesn't know, often a typo or missing quotes. Read the last line of the error first. It says what went wrong, and the line number says where."},
  {h:"More than one thing at once",p:"print(\"a\", \"b\") prints a b: arguments are joined with a space. You can change that with sep=\"-\", which prints a-b. Each print normally finishes with a new line. end=\"\" stops that, so the next print carries on from the same line."},
  {h:"Comments",p:"Anything after a # on a line is a comment. Python ignores it. Comments are notes for humans, including future you."},
  {h:"How this site works",p:"Write code in the editor. Run tries your program and shows what it prints. Check runs it against tests. Output has to match exactly: capital letters, spaces and punctuation all count. Lecture 0 of CS50P covers this unit and the next two."}],
 takeaways:["Code runs top to bottom, one line at a time.","print(...) shows output on the screen.","Text needs quotes. Quotes must match.","Read errors from the bottom line up.","Checks compare your output exactly."],
 quick:[
  {q:"What does this print?",code:py`print("hi")`,a:"hi",why:"print shows the text without the quotes."},
  {q:"Which line prints Hello?",opts:[`print(Hello)`,`print("Hello")`,`Print("Hello")`,`print "Hello"`],a:1,why:"Text needs quotes, print is all lowercase, and Python 3 needs the brackets."},
  {q:"What does this print?",code:py`print("a", "b", "c")`,a:"a b c",why:"Separate arguments are joined with one space."},
  {q:"What does this print?",code:py`print("a", "b", sep="-")`,a:"a-b",why:"sep replaces the space between arguments."},
  {q:"What does this print?",code:py`print("Hi", end="!")
print("Bye")`,a:"Hi!Bye",why:"end=\"!\" replaces the usual new line, so Bye carries on straight after."},
  {q:"Which error does this line cause?",code:py`print("Hello)`,opts:["SyntaxError","NameError","No error","It prints Hello)"],a:0,why:"The string never closes, so Python can't read the line at all."},
  {q:"What does this print?",code:py`# print("one")
print("two")`,a:"two",why:"The first line is a comment, so Python skips it."},
  {q:"You see NameError: name 'helo' is not defined. What's the most likely cause?",opts:["A typo, or text that's missing its quotes","Your computer needs restarting","Python isn't installed","You need more brackets"],a:0,why:"NameError means Python met a word it doesn't recognise."}],
 problems:[
  {id:"hello",title:"Hello, world",brief:"Every programmer starts here. Print exactly `hello, world`, all lowercase, with the comma.",starter:"# Write your code below this line\n",
   tests:[{out:"hello, world"}],hints:["Use print with your text inside quotes inside the brackets.","Check for capital letters: the expected output is all lowercase."],solution:py`print("hello, world")`},
  {id:"shopping",title:"Shopping list",brief:"Print a shopping list with each item on its own line: `eggs`, then `milk`, then `bread`.",starter:"",
   tests:[{out:"eggs\nmilk\nbread"}],hints:["Each print starts a new line when it finishes.","Three print lines, one per item."],solution:py`print("eggs")
print("milk")
print("bread")`},
  {id:"datesep",title:"Date with one print",brief:"Using a single print, print `2026-10-23`. Pass the year, month and day as three separate strings and use sep to join them with dashes.",starter:"print()\n",
   tests:[{out:"2026-10-23",check:py`assert code.count("print(") == 1, "Use exactly one print."
assert "sep" in code, "Use sep= to put the dashes in."`}],hints:["Three arguments: print(\"2026\", \"10\", \"23\") prints them with spaces between.","Add sep=\"-\" as a fourth argument to swap the spaces for dashes."],solution:py`print("2026", "10", "23", sep="-")`},
  {id:"fixbugs",title:"Fix the bugs",brief:"This program has three bugs, one per line. Fix them so it prints:\n\n```\nPython is fun\nI can fix errors\nErrors are clues\n```\n\nPress Run first and read the error message. It tells you which line to look at.",
   starter:py`print("Python is fun)
Print("I can fix errors")
print(Errors are clues)
`,tests:[{out:"Python is fun\nI can fix errors\nErrors are clues"}],hints:["Line 1 is missing a closing quote. Line 2 has a capital letter where Python wants lowercase.","Line 3's text has no quotes at all."],solution:py`print("Python is fun")
print("I can fix errors")
print("Errors are clues")`}]},

{n:2,week:0,title:"Variables, input and strings",
 sections:[
  {h:"Variables",p:"name = \"Ada\" stores the value \"Ada\" under the name name. Read the = as \"store\", not \"equals\". You can store something new later and the old value is replaced. Use names that say what they hold: price, not p."},
  {h:"Asking the user with input",p:"name = input(\"What's your name? \") shows the prompt, waits for the user to type, then stores what they typed. input always gives back a string, even if they type 42. On this site, the Input box below the editor plays the user: each line is one answer to one input()."},
  {h:"Putting strings together",p:"\"hello, \" + name glues two strings. print(\"hello,\", name) prints them with a space. The best option is an f-string: f\"hello, {name}\". The f before the quote lets you drop any variable inside curly braces. You'll use f-strings constantly."},
  {h:"String methods",p:"Strings come with built-in actions called methods. name.strip() removes spaces from both ends. .title() Capitalises Each Word. .lower() and .upper() change case. .replace(\"a\", \"b\") swaps text. They give you a new string and leave the original alone, so save the result: name = name.strip(). You can chain them: input().strip().title()."},
  {h:"Order matters",p:"Python runs top to bottom, so a variable has to be created before any line uses it. If you use a name too early you get a NameError."}],
 takeaways:["= stores a value under a name.","input() always returns a string.","f\"...{variable}...\" builds text.",".strip() .title() .lower() .upper() .replace() return new strings: save them."],
 quick:[
  {q:"What does this print?",code:py`x = 5
x = 7
print(x)`,a:"7",why:"The second line replaces the 5 with 7."},
  {q:"What does this print?",code:py`name = "Sam"
print(f"Hi, {name}!")`,a:"Hi, Sam!",why:"The f-string swaps {name} for the variable's value."},
  {q:"What does this print?",code:py`name = "Sam"
print("Hi, " + name)`,a:"Hi, Sam",why:"+ joins the two strings with nothing in between, so the space has to be inside the quotes."},
  {q:"What does this print?",code:py`print("  spaced  ".strip())`,a:"spaced",why:"strip removes whitespace from both ends."},
  {q:"What does this print?",code:py`print("hello world".title())`,a:"Hello World",why:"title capitalises the first letter of each word."},
  {q:"What does this print?",code:py`s = "banana"
print(s.replace("a", "o"))`,a:"bonono",why:"Every a is replaced."},
  {q:"The user types 42 at input(). What type of value do you get back?",opts:["A string: \"42\"","A number: 42","It depends on what they type","True"],a:0,why:"input always returns a string. Convert it with int() when you need a number (next unit)."},
  {q:"What does this print?",code:py`word = "Hey"
word.upper()
print(word)`,a:"Hey",why:"upper() made a new string, but nothing saved it. word = word.upper() would."},
  {q:"What happens here?",code:py`print(f"Hi {name}")
name = "Ana"`,opts:["NameError","Prints Hi Ana","Prints Hi {name}","Prints Hi"],a:0,why:"Line 1 runs before name exists."}],
 problems:[
  {id:"greet",title:"Greeting",brief:"Ask the user for their name with input, then print `Hello, NAME!`.\n\nYour prompt text (the words inside input(...)) is up to you. Checks ignore it.",starter:"",
   tests:[{stdin:["Ada"],out:"Hello, Ada!"},{stdin:["Grace Hopper"],out:"Hello, Grace Hopper!"}],hints:["name = input(\"Name: \") stores what the user types.","print(f\"Hello, {name}!\")"],solution:py`name = input("What's your name? ")
print(f"Hello, {name}!")`},
  {id:"tidyname",title:"Tidy a name",brief:"People type names messily: extra spaces, random capitals. Ask for a name and print it tidied up: no spaces at the ends, and each word starting with a capital.\n\n`  aDa lOVELACE ` becomes `Ada Lovelace`.",starter:"",
   tests:[{stdin:["  aDa lOVELACE "],out:"Ada Lovelace"},{stdin:["grace"],out:"Grace"},{stdin:["ALAN TURING   "],out:"Alan Turing"}],hints:["Two methods: one removes outer spaces, one fixes the capitals.","input().strip().title() does both in one go."],solution:py`name = input("Name: ").strip().title()
print(name)`},
  {id:"snake",title:"snake_case",brief:"Python variable names use snake_case: lowercase words joined by underscores. Ask for a phrase and print it in snake_case. Strip spaces from the ends first.\n\n`My Variable Name` becomes `my_variable_name`.",starter:"",
   tests:[{stdin:["My Variable Name"],out:"my_variable_name"},{stdin:["  Total Price "],out:"total_price"},{stdin:["x"],out:"x"}],hints:["You need three methods: strip, lower and replace.","replace(\" \", \"_\") swaps each space for an underscore."],solution:py`phrase = input("Phrase: ")
print(phrase.strip().lower().replace(" ", "_"))`},
  {id:"madlib",title:"Mad lib",brief:"Ask for three words in this order: an adjective, a noun, then a verb. Print `The ADJECTIVE NOUN likes to VERB.`\n\nWith sleepy, cat and code it prints `The sleepy cat likes to code.`",starter:"",
   tests:[{stdin:["sleepy","cat","code"],out:"The sleepy cat likes to code."},{stdin:["shiny","robot","dance"],out:"The shiny robot likes to dance."}],hints:["Three input calls, each saved in its own variable.","One f-string with three {} slots."],solution:py`adjective = input("Adjective: ")
noun = input("Noun: ")
verb = input("Verb: ")
print(f"The {adjective} {noun} likes to {verb}.")`},
  {id:"shout",title:"Shout and whisper",brief:"Ask for a message. Print it in capitals on the first line and in lowercase on the second.",starter:"",
   tests:[{stdin:["Hello There"],out:"HELLO THERE\nhello there"},{stdin:["python"],out:"PYTHON\npython"}],hints:["Store the message once, then use it twice.","print(message.upper()) then print(message.lower())."],solution:py`message = input("Message: ")
print(message.upper())
print(message.lower())`}]},

{n:3,week:0,title:"Numbers and your own functions",
 sections:[
  {h:"Two kinds of number",p:"3 is an int (a whole number). 3.5 is a float (a number with a decimal point). You get + - * as you'd expect. / always gives a float: 7 / 2 is 3.5 and 10 / 5 is 2.0. // divides and drops the remainder: 7 // 2 is 3. % gives just the remainder: 7 % 2 is 1. ** is power: 2 ** 3 is 8."},
  {h:"Turning input into numbers",p:"input gives you a string, and \"2\" + \"3\" is \"23\", glued together. Convert first: int(input(\"x: \")) for whole numbers, float(input(\"x: \")) when decimals are allowed."},
  {h:"Rounding and formatting",p:"round(3.14159, 2) gives 3.14. To always show exactly two decimals, format inside an f-string: f\"{price:.2f}\" shows 2.50, not 2.5. f\"{n:,}\" adds thousands commas: 1,000,000."},
  {h:"Making your own functions",p:"def greet(name): starts a function definition. The indented lines underneath are its body, run each time you call greet(\"Ada\"). name is a parameter: a variable that holds whatever was passed in. Indent with four spaces. Python uses indentation to know what belongs inside."},
  {h:"return vs print",p:"print shows something on screen. return hands a value back to the code that called the function, so it can be stored or used: def square(n): return n * n lets you write area = square(4). A function with no return gives back None."},
  {h:"The main pattern",p:"CS50P writes programs as def main(): ... with helper functions underneath, and a single main() call at the very bottom. Python reads every def first, then main() runs and can use helpers defined below it."}],
 takeaways:["/ gives a float, // drops the remainder, % gives the remainder.","Convert input with int() or float() before doing maths.","f\"{x:.2f}\" shows two decimals.","return gives a value back; print only shows it."],
 quick:[
  {q:"What does this print?",code:py`print(7 / 2)`,a:"3.5",why:"/ always does true division."},
  {q:"What does this print?",code:py`print(7 // 2)`,a:"3",why:"// drops the remainder."},
  {q:"What does this print?",code:py`print(7 % 2)`,a:"1",why:"7 = 3 × 2 + 1, so the remainder is 1."},
  {q:"What does this print?",code:py`print(2 ** 3)`,a:"8",why:"2 × 2 × 2."},
  {q:"What does this print?",code:py`print("2" + "3")`,a:"23",why:"They're strings, so + glues them."},
  {q:"What does this print?",code:py`print(int("2") + int("3"))`,a:"5",why:"Converted to ints first, so + adds."},
  {q:"What does this print?",code:py`print(10 / 5)`,a:"2.0",why:"/ always gives a float, even when it divides exactly."},
  {q:"What does this print?",code:py`x = 2.5
print(f"{x:.2f}")`,a:"2.50",why:":.2f always shows two decimal places."},
  {q:"What does this print?",code:py`def double(n):
    return n * 2

print(double(4))`,a:"8",why:"double(4) returns 8, and print shows it."},
  {q:"What does this print? (two lines)",code:py`def f():
    print("hi")

x = f()
print(x)`,a:"hi\nNone",why:"f prints hi, but it has no return, so x is None."}],
 problems:[
  {id:"adder",title:"Adder",brief:"Ask for two whole numbers, one after the other, and print their sum.",starter:"",
   tests:[{stdin:["2","3"],out:"5"},{stdin:["-4","10"],out:"6"},{stdin:["100","250"],out:"350"}],hints:["input gives strings. Wrap each one in int(...).","x = int(input(\"x: \"))"],solution:py`x = int(input("x: "))
y = int(input("y: "))
print(x + y)`},
  {id:"minutes",title:"Minutes to hours",brief:"Ask for a number of minutes (a whole number) and print it as hours and minutes in the form `2h 15m`.\n\n135 gives `2h 15m`. 60 gives `1h 0m`.",starter:"",
   tests:[{stdin:["135"],out:"2h 15m"},{stdin:["60"],out:"1h 0m"},{stdin:["59"],out:"0h 59m"},{stdin:["600"],out:"10h 0m"}],hints:["// 60 gives whole hours. % 60 gives the minutes left over.","print(f\"{hours}h {mins}m\")"],solution:py`total = int(input("Minutes: "))
hours = total // 60
mins = total % 60
print(f"{hours}h {mins}m")`},
  {id:"temp",title:"Celsius to Fahrenheit",brief:"Ask for a temperature in Celsius (it may have decimals). Print it in Fahrenheit with exactly one decimal place followed by F, like `98.6F`.\n\nThe formula is F = C × 9 / 5 + 32.",starter:"",
   tests:[{stdin:["37"],out:"98.6F"},{stdin:["0"],out:"32.0F"},{stdin:["-40"],out:"-40.0F"},{stdin:["21.5"],out:"70.7F"}],hints:["Use float(...) because the input can have decimals.","f\"{f:.1f}F\" shows one decimal place."],solution:py`c = float(input("Celsius: "))
f = c * 9 / 5 + 32
print(f"{f:.1f}F")`},
  {id:"square",title:"Your first function",brief:"Write a function called `square` that takes a number and returns it squared. Then write `main`, which asks for a whole number and prints `N squared is M`, and call main at the bottom.\n\n7 gives `7 squared is 49`.",starter:py`def main():
    ...


def square(n):
    ...


main()
`,
   tests:[{stdin:["7"],out:"7 squared is 49"},{stdin:["12"],out:"12 squared is 144",check:py`square = get(ns, "square")
assert square(5) == 25, "square(5) should return 25. Make sure you return the value, not print it."
assert square(-3) == 9, "square(-3) should return 9."`}],hints:["Inside square: return n * n. Replace the ... lines with real code.","In main: n = int(input(\"n: \")) then print(f\"{n} squared is {square(n)}\")."],solution:py`def main():
    n = int(input("Number: "))
    print(f"{n} squared is {square(n)}")


def square(n):
    return n * n


main()`},
  {id:"bill",title:"Split the bill",brief:"Ask for three things in order: the bill total in pounds (may have pence), the number of people (whole number), and the tip percentage (whole number, like 15). Add the tip, split it evenly and print `Each person pays £X.XX`.\n\n£60, 3 people, 10% tip: `Each person pays £22.00`.",starter:"",
   tests:[{stdin:["60","3","10"],out:"Each person pays £22.00"},{stdin:["100","4","15"],out:"Each person pays £28.75"},{stdin:["45.50","2","0"],out:"Each person pays £22.75"}],hints:["The total with tip is bill × (1 + tip / 100).","Divide by people and show it with :.2f."],solution:py`bill = float(input("Bill: "))
people = int(input("People: "))
tip = int(input("Tip %: "))
share = bill * (1 + tip / 100) / people
print(f"Each person pays £{share:.2f}")`}]},

{n:4,week:1,title:"Making decisions with if",
 sections:[
  {h:"True and False",p:"Comparisons give back True or False (called booleans): == equal, != not equal, < > <= >=. Careful: = stores a value, == compares two values."},
  {h:"if, elif, else",p:"if x > 0: runs the indented lines below only when the condition is True. elif (else if) is checked only if everything above it was False. else catches whatever is left. Python stops at the first branch that's True, so put the most specific checks first."},
  {h:"Indentation is the structure",p:"The lines that belong to an if are indented four spaces. When the indentation ends, so does the if. Wrong indentation gives an IndentationError or, worse, code that runs at the wrong time."},
  {h:"and, or, not",p:"x > 0 and x < 10 is True only if both sides are. or needs just one side. not flips True and False. Python also lets you write 0 < x < 10."},
  {h:"Even or odd",p:"n % 2 gives the remainder after dividing by 2. It's 0 for even numbers. So n % 2 == 0 is the classic even test."},
  {h:"Functions that answer yes or no",p:"def is_even(n): return n % 2 == 0 returns a boolean you can use straight in an if: if is_even(x):. No need for if ... return True else return False."},
  {h:"match",p:"match compares one value against several cases: match day: then case \"sat\" | \"sun\": for either, and case _: as the catch-all. It reads more cleanly than a long elif chain when you're checking one variable for exact values."}],
 takeaways:["== compares; = stores.","Only the first True branch of an if/elif/else runs.","Indentation decides what's inside the if.","n % 2 == 0 tests for even.","match/case is good for checking one value against exact options."],
 quick:[
  {q:"What does this print?",code:py`print(3 > 2)`,a:"True",why:"Comparisons give True or False."},
  {q:"What does this print?",code:py`print(5 == 5.0)`,a:"True",why:"An int and a float with the same value are equal."},
  {q:"What does this print?",code:py`x = 10
if x > 5:
    print("big")
else:
    print("small")`,a:"big",why:"10 > 5 is True, so the first branch runs."},
  {q:"What does this print?",code:py`x = 5
if x > 3:
    print("A")
elif x > 1:
    print("B")
else:
    print("C")`,a:"A",why:"Only the first True branch runs, even though x > 1 is also True."},
  {q:"What does this print?",code:py`print(True and False)`,a:"False",why:"and needs both sides to be True."},
  {q:"What does this print?",code:py`print(not (3 < 2))`,a:"True",why:"3 < 2 is False, and not flips it."},
  {q:"What does this print?",code:py`n = 7
print(n % 2 == 0)`,a:"False",why:"7 % 2 is 1, so 7 is odd."},
  {q:"Why does if x = 5: fail?",opts:["= stores a value. Comparing needs ==","x has to be a string","if needs brackets","5 must be in quotes"],a:0,why:"It's a SyntaxError: use == to compare."},
  {q:"What does this print?",code:py`day = "sat"
match day:
    case "sat" | "sun":
        print("weekend")
    case _:
        print("weekday")`,a:"weekend",why:"| means \"or\" inside a case."},
  {q:"What does this print?",code:py`x = 0
if x:
    print("yes")
else:
    print("no")`,a:"no",why:"0, empty strings and empty lists all count as False in an if."}],
 problems:[
  {id:"evenodd",title:"Even or odd",brief:"Ask for a whole number and print `even` or `odd`.",starter:"",
   tests:[{stdin:["4"],out:"even"},{stdin:["7"],out:"odd"},{stdin:["0"],out:"even"},{stdin:["-3"],out:"odd"}],hints:["n % 2 is 0 for even numbers.","if n % 2 == 0: print(\"even\") else: print(\"odd\")"],solution:py`n = int(input("n: "))
if n % 2 == 0:
    print("even")
else:
    print("odd")`},
  {id:"grade",title:"Letter grade",brief:"Ask for a score from 0 to 100 and print the grade: 90 and above is `A`, 80+ is `B`, 70+ is `C`, 60+ is `D`, anything lower is `F`.",starter:"",
   tests:[{stdin:["95"],out:"A"},{stdin:["90"],out:"A"},{stdin:["89"],out:"B"},{stdin:["72"],out:"C"},{stdin:["60"],out:"D"},{stdin:["12"],out:"F"}],hints:["Check from the top down: if score >= 90, then elif score >= 80, and so on.","Because only the first True branch runs, elif score >= 80 already knows the score is below 90."],solution:py`score = int(input("Score: "))
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
elif score >= 70:
    print("C")
elif score >= 60:
    print("D")
else:
    print("F")`},
  {id:"leap",title:"Leap year",brief:"Write a function `is_leap(year)` that returns True or False. A year is a leap year if it divides by 4, except years that divide by 100, which are only leap years if they also divide by 400.\n\nThen in main, ask for a year and print `Leap year` or `Not a leap year`.",starter:py`def main():
    ...


def is_leap(year):
    ...


main()
`,
   tests:[{stdin:["2024"],out:"Leap year"},{stdin:["2023"],out:"Not a leap year"},{stdin:["1900"],out:"Not a leap year"},{stdin:["2000"],out:"Leap year",check:py`f = get(ns, "is_leap")
for y, want in [(2024, True), (2023, False), (1900, False), (2000, True), (2100, False)]:
    assert f(y) == want, f"is_leap({y}) should return {want}"`}],hints:["\"Divides by 4\" is year % 4 == 0.","One line works: return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)."],solution:py`def main():
    year = int(input("Year: "))
    if is_leap(year):
        print("Leap year")
    else:
        print("Not a leap year")


def is_leap(year):
    return year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)


main()`},
  {id:"weekend",title:"Weekend or weekday",brief:"Ask for a day of the week. Ignore capitals and spaces at the ends. Print `weekend` for Saturday or Sunday, `weekday` for Monday to Friday, and `not a day` for anything else. Try using match.",starter:"",
   tests:[{stdin:[" Saturday "],out:"weekend"},{stdin:["monday"],out:"weekday"},{stdin:["FRIDAY"],out:"weekday"},{stdin:["sunday"],out:"weekend"},{stdin:["funday"],out:"not a day"}],hints:["Tidy first: day = input().strip().lower()","case \"saturday\" | \"sunday\": then case \"monday\" | \"tuesday\" | ... and case _: for the rest."],solution:py`day = input("Day: ").strip().lower()
match day:
    case "saturday" | "sunday":
        print("weekend")
    case "monday" | "tuesday" | "wednesday" | "thursday" | "friday":
        print("weekday")
    case _:
        print("not a day")`},
  {id:"tickets",title:"Ticket price",brief:"Ask for an age and print the ticket price: under 5 is `Free`, 5 to 17 is `£6`, 18 to 64 is `£12`, and 65 or over is `£8`.",starter:"",
   tests:[{stdin:["3"],out:"Free"},{stdin:["5"],out:"£6"},{stdin:["17"],out:"£6"},{stdin:["18"],out:"£12"},{stdin:["64"],out:"£12"},{stdin:["65"],out:"£8"}],hints:["Watch the boundaries: 5 is £6, 17 is £6, 18 is £12.","if age < 5 ... elif age < 18 ... elif age < 65 ... else ..."],solution:py`age = int(input("Age: "))
if age < 5:
    print("Free")
elif age < 18:
    print("£6")
elif age < 65:
    print("£12")
else:
    print("£8")`}]},

{n:5,week:2,title:"Loops, lists and dictionaries",
 sections:[
  {h:"while loops",p:"while condition: repeats its indented lines as long as the condition is True. Something inside must eventually make it False, usually a counter like i += 1 (short for i = i + 1). Otherwise it loops forever. Here the runner stops it after a few seconds; in a real terminal press Ctrl-C."},
  {h:"for and range",p:"for i in range(3): runs three times with i as 0, 1, then 2. range(start, stop) counts from start up to, but not including, stop. range(10, 0, -1) counts down from 10 to 1. Use _ as the variable name when you don't need it."},
  {h:"Lists",p:"names = [\"Ann\", \"Bo\", \"Cy\"] holds several values in order. names[0] is the first item and names[-1] the last. len(names) is how many there are. for name in names: visits each item. names.append(\"Di\") adds one to the end. \"a b c\".split() turns a string into a list of words."},
  {h:"Dictionaries",p:"prices = {\"tea\": 2.5, \"cake\": 3} maps keys to values. prices[\"tea\"] looks one up. if \"tea\" in prices: checks a key exists first. for item in prices: loops over the keys."},
  {h:"Handy tricks",p:"\"#\" * 3 is \"###\". total += n adds to a running total. break leaves a loop early. continue skips to the next round."},
  {h:"Keep asking until it's right",p:"A common pattern: while True: ask, then break once the answer is acceptable. It loops forever until it gets what it needs. You'll use this a lot in CS50P's problem sets."}],
 takeaways:["range(a, b) stops before b.","Lists start at index 0; [-1] is the last item.","dict[key] looks up a value; key in dict checks it's there.","while True: ... break is how you keep asking until the input is valid."],
 quick:[
  {q:"What does this print?",code:py`for i in range(3):
    print(i)`,a:"0\n1\n2",why:"range(3) gives 0, 1, 2: three numbers, starting at 0."},
  {q:"What does this print?",code:py`print(list(range(2, 10, 3)))`,a:"[2, 5, 8]",why:"Start at 2, step by 3, stop before 10."},
  {q:"What does this print?",code:py`print("ab" * 3)`,a:"ababab",why:"Multiplying a string repeats it."},
  {q:"What does this print?",code:py`i = 0
while i < 3:
    i += 1
print(i)`,a:"3",why:"The loop stops once i reaches 3."},
  {q:"What does this print?",code:py`names = ["Ann", "Bo", "Cy"]
print(names[1])`,a:"Bo",why:"Counting starts at 0, so [1] is the second item."},
  {q:"names = [\"Ann\", \"Bo\", \"Cy\"]. What is names[-1]?",opts:["\"Cy\"","\"Ann\"","An error","None"],a:0,why:"Negative indexes count from the end."},
  {q:"What does this print?",code:py`prices = {"tea": 2, "cake": 3}
print(prices["cake"])`,a:"3",why:"Look up the key \"cake\"."},
  {q:"What does this print?",code:py`total = 0
for n in [1, 2, 3, 4]:
    total += n
print(total)`,a:"10",why:"A running total: 1 + 2 + 3 + 4."},
  {q:"What does this print?",code:py`for c in "hey":
    print(c.upper(), end="")`,a:"HEY",why:"Looping over a string gives one character at a time."},
  {q:"What does this print?",code:py`for i in range(5):
    if i == 3:
        break
    print(i)`,a:"0\n1\n2",why:"break leaves the loop before 3 is printed."},
  {q:"What does this print?",code:py`print("to be or not".split())`,a:"['to', 'be', 'or', 'not']",why:"split breaks a string on spaces into a list."}],
 problems:[
  {id:"countdown",title:"Countdown",brief:"Ask for a whole number n. Count down from n to 1, one number per line, then print `Liftoff!`.",starter:"",
   tests:[{stdin:["3"],out:"3\n2\n1\nLiftoff!"},{stdin:["1"],out:"1\nLiftoff!"},{stdin:["5"],out:"5\n4\n3\n2\n1\nLiftoff!"}],hints:["A while loop that prints n then does n -= 1, running while n > 0.","Or for i in range(n, 0, -1): counts down and stops before 0."],solution:py`n = int(input("n: "))
for i in range(n, 0, -1):
    print(i)
print("Liftoff!")`},
  {id:"times",title:"Times table",brief:"Ask for a whole number n and print its times table from 1 to 10 in the form `n x i = result`.\n\nFor 7 the first line is `7 x 1 = 7` and the last is `7 x 10 = 70`.",starter:"",
   tests:[{stdin:["7"],out:Array.from({length:10},(_,i)=>`7 x ${i+1} = ${7*(i+1)}`).join("\n")},{stdin:["12"],out:Array.from({length:10},(_,i)=>`12 x ${i+1} = ${12*(i+1)}`).join("\n")}],hints:["range(1, 11) gives 1 to 10.","print(f\"{n} x {i} = {n * i}\") inside the loop."],solution:py`n = int(input("n: "))
for i in range(1, 11):
    print(f"{n} x {i} = {n * i}")`},
  {id:"vowels",title:"Count the vowels",brief:"Ask for some text and print how many vowels it has (a, e, i, o, u, upper or lower case).",starter:"",
   tests:[{stdin:["Hello World"],out:"3"},{stdin:["PYTHON"],out:"1"},{stdin:["rhythm"],out:"0"},{stdin:["AeIoU"],out:"5"}],hints:["Loop over each character with for c in text.lower():","if c in \"aeiou\": count += 1"],solution:py`text = input("Text: ")
count = 0
for c in text.lower():
    if c in "aeiou":
        count += 1
print(count)`},
  {id:"stairs",title:"Staircase",brief:"Ask for a height and print a staircase of # that leans right. Height 3 looks like this:\n\n```\n  #\n ##\n###\n```\n\nRow i has height − i spaces, then i hashes.",starter:"",
   tests:[{stdin:["3"],out:"  #\n ##\n###"},{stdin:["1"],out:"#"},{stdin:["5"],out:"    #\n   ##\n  ###\n ####\n#####"}],hints:["for i in range(1, height + 1): gives row numbers 1 to height.","\" \" * (height - i) + \"#\" * i builds one row."],solution:py`height = int(input("Height: "))
for i in range(1, height + 1):
    print(" " * (height - i) + "#" * i)`},
  {id:"cafe",title:"Café order",brief:"The menu is already in the starter code. Keep asking for items until the user types `done`. Ignore capitals, and skip items that aren't on the menu. Then print the total like `Total: £6.25`.",starter:py`MENU = {"tea": 2.50, "coffee": 3.00, "cake": 3.75, "toast": 1.80}

`,
   tests:[{stdin:["tea","Cake","done"],out:"Total: £6.25"},{stdin:["pizza","coffee","coffee","done"],out:"Total: £6.00"},{stdin:["done"],out:"Total: £0.00"}],hints:["total = 0, then while True: read an item, break if it's \"done\".","if item in MENU: total += MENU[item]. Print with :.2f at the end."],solution:py`MENU = {"tea": 2.50, "coffee": 3.00, "cake": 3.75, "toast": 1.80}

total = 0
while True:
    item = input("Item: ").strip().lower()
    if item == "done":
        break
    if item in MENU:
        total += MENU[item]
print(f"Total: £{total:.2f}")`},
  {id:"positive",title:"Positive numbers only",brief:"Keep asking for a whole number until the user gives one above zero. Then print `Thanks: N`.\n\nIf they type -5, then 0, then 8, it prints `Thanks: 8`.",starter:"",
   tests:[{stdin:["-5","0","8"],out:"Thanks: 8"},{stdin:["3"],out:"Thanks: 3"}],hints:["while True: n = int(input(...)), then if n > 0: break","After the loop, n holds the good answer."],solution:py`while True:
    n = int(input("Positive number: "))
    if n > 0:
        break
print(f"Thanks: {n}")`}]},

{n:6,week:3,title:"Exceptions: handling things going wrong",
 sections:[
  {h:"Runtime errors",p:"Some code is fine until it meets bad data. int(\"cat\") raises a ValueError and the program stops with a traceback. Those errors are called exceptions."},
  {h:"try and except",p:"Put risky code under try:. If it raises, Python jumps to the matching except ValueError: block instead of crashing. Name the specific exception you expect. A bare except: hides real bugs."},
  {h:"else and pass",p:"else: after the except blocks runs only if nothing went wrong. pass is a line that does nothing, for when you need to write something but want to stay quiet."},
  {h:"Re-prompting",p:"Combine it with a loop: while True: try: n = int(input(\"n: \")) then except ValueError: print(\"Not a number\") then else: break. It keeps asking until it gets a valid number. It's one of the most useful patterns in CS50P."},
  {h:"Exceptions you'll meet",p:"ValueError: right type, bad value, like int(\"cat\"). ZeroDivisionError: dividing by 0. KeyError: a missing dictionary key. IndexError: a list position that doesn't exist. EOFError: no more input. In a terminal you send that with Ctrl-D; here it happens when the Input box runs out of lines. KeyboardInterrupt: Ctrl-C."},
  {h:"Raising your own",p:"raise ValueError(\"Invalid age\") lets your own functions complain about bad input, so the code calling them can catch it."}],
 takeaways:["try: risky code; except SomeError: what to do instead.","Catch specific exceptions, not everything.","else runs only when try succeeded.","while True + try/except/else is the re-prompt pattern.","Ctrl-D sends EOF (EOFError)."],
 quick:[
  {q:"int(\"cat\") raises which exception?",opts:["ValueError","TypeError","NameError","SyntaxError"],a:0,why:"The type (string) is fine, but its value can't become an int."},
  {q:"What does this print?",code:py`try:
    print(int("7"))
except ValueError:
    print("bad")`,a:"7",why:"Nothing went wrong, so except is skipped."},
  {q:"What does this print?",code:py`try:
    print(int("seven"))
except ValueError:
    print("bad")`,a:"bad",why:"int(\"seven\") raises ValueError before anything prints."},
  {q:"What does this print?",code:py`try:
    x = 1 / 0
except ZeroDivisionError:
    print("nope")
else:
    print("fine")`,a:"nope",why:"Division by zero raises, so else doesn't run."},
  {q:"What does this print?",code:py`d = {"a": 1}
try:
    print(d["b"])
except KeyError:
    print("missing")`,a:"missing",why:"\"b\" isn't a key."},
  {q:"What does this print?",code:py`items = [1, 2]
try:
    print(items[5])
except IndexError:
    print("too far")`,a:"too far",why:"There is no position 5."},
  {q:"When does the else block of a try run?",opts:["Only when the try block raised nothing","Always","Only after an exception","Never"],a:0,why:"else is the \"it worked\" path."},
  {q:"In a Mac or Linux terminal, which keys tell input() there's no more input?",opts:["Ctrl-D","Ctrl-C","Ctrl-Z","Enter twice"],a:0,why:"Ctrl-D sends end-of-file, which raises EOFError. Ctrl-C raises KeyboardInterrupt."}],
 problems:[
  {id:"safenum",title:"Safe number",brief:"Ask for a whole number. If the input isn't a whole number, print `That's not a whole number` and ask again. Once it is, print `Double: N` where N is twice the number.",starter:"",
   tests:[{stdin:["cat","3.5","21"],out:"That's not a whole number\nThat's not a whole number\nDouble: 42"},{stdin:["8"],out:"Double: 16"}],hints:["while True: then try: n = int(input(...)), except ValueError: print the message, else: break","After the loop, print(f\"Double: {n * 2}\")."],solution:py`while True:
    try:
        n = int(input("Whole number: "))
    except ValueError:
        print("That's not a whole number")
    else:
        break
print(f"Double: {n * 2}")`},
  {id:"safediv",title:"Safe divide",brief:"Ask for two whole numbers a and b. Print a ÷ b with exactly two decimal places. If b is 0, print `Can't divide by zero` instead of crashing.",starter:"",
   tests:[{stdin:["7","2"],out:"3.50"},{stdin:["5","0"],out:"Can't divide by zero"},{stdin:["-9","4"],out:"-2.25"}],hints:["Put a / b inside try: and catch ZeroDivisionError.","Print with f\"{result:.2f}\" in the else block."],solution:py`a = int(input("a: "))
b = int(input("b: "))
try:
    result = a / b
except ZeroDivisionError:
    print("Can't divide by zero")
else:
    print(f"{result:.2f}")`},
  {id:"sumeof",title:"Add up until there's no more input",brief:"Read numbers (they may have decimals) until input runs out. Skip any line that isn't a number. Then print `Total: X.XX`.\n\nIn a terminal the user would press Ctrl-D to finish. Here, input runs out after the last line of the Input box. Either way input() raises EOFError.",starter:"",
   tests:[{stdin:["1","2.5","oops","3"],out:"Total: 6.50"},{stdin:[],out:"Total: 0.00"},{stdin:["10","-4"],out:"Total: 6.00"}],hints:["while True: try: line = input() / except EOFError: break","Inside the loop, a second try around float(line) catches ValueError so you can skip bad lines."],solution:py`total = 0
while True:
    try:
        line = input()
    except EOFError:
        break
    try:
        total += float(line)
    except ValueError:
        pass
print(f"Total: {total:.2f}")`},
  {id:"capitals",title:"Capital cities",brief:"The dictionary is in the starter. Ask for a country, tidy it to title case, and print its capital. If the country isn't in the dictionary, print `Unknown country`. Use try/except KeyError.",starter:py`CAPITALS = {"France": "Paris", "Japan": "Tokyo", "Kenya": "Nairobi", "Peru": "Lima", "India": "New Delhi"}

`,
   tests:[{stdin:["france"],out:"Paris"},{stdin:["  INDIA "],out:"New Delhi"},{stdin:["Atlantis"],out:"Unknown country"}],hints:["country = input().strip().title()","try: print(CAPITALS[country]) except KeyError: print(\"Unknown country\")"],solution:py`CAPITALS = {"France": "Paris", "Japan": "Tokyo", "Kenya": "Nairobi", "Peru": "Lima", "India": "New Delhi"}

country = input("Country: ").strip().title()
try:
    print(CAPITALS[country])
except KeyError:
    print("Unknown country")`}]},

{n:7,week:4,title:"Libraries and command-line arguments",
 sections:[
  {h:"Modules",p:"A module is a file of code someone already wrote. import random makes it available; then random.randint(1, 6) gives a whole number from 1 to 6, both ends included. random.choice(list) picks one item and random.shuffle(list) mixes a list in place. from random import choice lets you write choice(...) without the random. prefix."},
  {h:"Useful built-in modules",p:"math has sqrt, pi, ceil (round up) and floor (round down). statistics has mean and median. These come with Python, so nothing needs installing."},
  {h:"Command-line arguments",p:"Running python hello.py Ada hands \"Ada\" to your program. import sys and sys.argv is the list [\"hello.py\", \"Ada\"]: item 0 is the program's own name, and the arguments start at 1. Check len(sys.argv) before using them. On this site, type arguments in the Arguments box, separated by spaces."},
  {h:"Exiting early",p:"sys.exit(\"Too few arguments\") prints the message and stops the program straight away. Use it when the program can't carry on."},
  {h:"Packages and pip",p:"Packages are libraries other people publish, like cowsay or requests. On your own machine or the CS50 codespace you install them with pip install cowsay. This site can only use what comes with Python."},
  {h:"Your own modules and __name__",p:"Any .py file can be imported by another. The catch is that importing runs the file, including your main() call. The fix is to replace the bare main() at the bottom with if __name__ == \"__main__\": followed by an indented main(). Now main runs when you run the file, but not when it's imported. From this unit on, the checker imports your file to test your functions, so use this pattern."}],
 takeaways:["import module, then module.thing(...)","randint(a, b) includes both a and b.","sys.argv[0] is the program name; real arguments start at 1.","sys.exit(\"message\") stops the program.","End programs with if __name__ == \"__main__\": main()"],
 quick:[
  {q:"random.randint(1, 3) can return…",opts:["1, 2 or 3","1 or 2","0, 1, 2 or 3","Any decimal from 1 to 3"],a:0,why:"randint includes both ends."},
  {q:"What does this print?",code:py`import math
print(math.sqrt(16))`,a:"4.0",why:"sqrt returns a float."},
  {q:"What does this print?",code:py`import math
print(math.ceil(2.1))`,a:"3",why:"ceil rounds up."},
  {q:"What does this print?",code:py`import statistics
print(statistics.mean([2, 4, 9]))`,a:"5",why:"(2 + 4 + 9) / 3 = 5."},
  {q:"You run python hi.py Ada. What is sys.argv?",opts:["['hi.py', 'Ada']","['Ada']","'Ada'","['python', 'hi.py', 'Ada']"],a:0,why:"Item 0 is the script name; your arguments come after it."},
  {q:"After from random import choice, how do you call it?",opts:["choice([1, 2, 3])","random.choice([1, 2, 3])","random.choice.choice([1, 2, 3])","import choice"],a:0,why:"from ... import puts the name straight into your program."},
  {q:"What does if __name__ == \"__main__\": main() do?",opts:["Runs main only when the file is run directly, not when it's imported","Runs main twice","Makes main private","Nothing: it's a comment"],a:0,why:"Imported files have a different __name__, so main doesn't run."},
  {q:"What does sys.exit(\"Missing name\") do?",opts:["Prints Missing name and stops the program","Raises a NameError","Restarts the program","Only works inside main"],a:0,why:"It's the clean way to stop with a message."}],
 problems:[
  {id:"hypot",title:"Hypotenuse",brief:"Ask for the two shorter sides of a right-angled triangle (they may have decimals). Print the longest side to two decimal places. Use math.sqrt: c = √(a² + b²).",starter:"import math\n\n",
   tests:[{stdin:["3","4"],out:"5.00"},{stdin:["5","12"],out:"13.00"},{stdin:["1","1"],out:"1.41"}],hints:["a ** 2 squares a.","print(f\"{math.sqrt(a ** 2 + b ** 2):.2f}\")"],solution:py`import math

a = float(input("a: "))
b = float(input("b: "))
print(f"{math.sqrt(a ** 2 + b ** 2):.2f}")`},
  {id:"dice",title:"Roll a die",brief:"Print a random whole number from 1 to 6 using the random module. Run it a few times to watch it change.",starter:"",
   tests:[{out:"^[1-6]$",match:"regex",label:"Roll 1"},{out:"^[1-6]$",match:"regex",label:"Roll 2"},{out:"^[1-6]$",match:"regex",label:"Roll 3",check:py`assert "random" in code, "Use the random module."
import io, contextlib
seen = set()
for _ in range(40):
    m = {"__name__": "__main__"}
    buf = io.StringIO()
    with contextlib.redirect_stdout(buf):
        exec(code, m)
    seen.add(buf.getvalue().strip())
assert len(seen) >= 4, "Over 40 runs your program only printed " + ", ".join(sorted(seen)) + ". Every number from 1 to 6 should be possible."
assert seen <= {"1", "2", "3", "4", "5", "6"}, "Only print numbers from 1 to 6."`}],hints:["import random at the top.","print(random.randint(1, 6))"],solution:py`import random

print(random.randint(1, 6))`},
  {id:"argvhello",title:"Hello from the command line",argv:true,brief:"Greet a name given as a command-line argument, as in `python hello.py Ada`. With exactly one argument, print `hello, NAME`. With none, exit using sys.exit(\"Too few arguments\"). With more than one, exit using sys.exit(\"Too many arguments\").\n\nType arguments in the Arguments box to try it.",starter:"import sys\n\n",
   tests:[{argv:["Ada"],out:"hello, Ada"},{argv:[],exit:"nonzero",errIncludes:"Too few arguments"},{argv:["Ada","Grace"],exit:"nonzero",errIncludes:"Too many arguments"}],hints:["len(sys.argv) is 2 when there's exactly one argument, because the program name counts too.","if len(sys.argv) < 2: sys.exit(\"Too few arguments\")"],solution:py`import sys

if len(sys.argv) < 2:
    sys.exit("Too few arguments")
elif len(sys.argv) > 2:
    sys.exit("Too many arguments")
print(f"hello, {sys.argv[1]}")`},
  {id:"stats",title:"Mean and median",argv:true,brief:"Take numbers as command-line arguments, as in `python stats.py 2 4 9`. Print two lines, `mean: X.XX` and `median: X.XX`, using the statistics module. With no numbers, exit using sys.exit(\"Usage: python stats.py NUMBERS\").",starter:"import statistics\nimport sys\n\n",
   tests:[{argv:["2","4","9"],out:"mean: 5.00\nmedian: 4.00"},{argv:["1","2","3","4"],out:"mean: 2.50\nmedian: 2.50"},{argv:["7.5"],out:"mean: 7.50\nmedian: 7.50"},{argv:[],exit:"nonzero",errIncludes:"Usage"}],hints:["sys.argv[1:] is a list of just the arguments, without the program name.","Convert each one: nums = [] then for a in sys.argv[1:]: nums.append(float(a))."],solution:py`import statistics
import sys

if len(sys.argv) < 2:
    sys.exit("Usage: python stats.py NUMBERS")
nums = []
for a in sys.argv[1:]:
    nums.append(float(a))
print(f"mean: {statistics.mean(nums):.2f}")
print(f"median: {statistics.median(nums):.2f}")`},
  {id:"initials",title:"Initials, importably",brief:"Write a function `initials(name)` that returns the first letter of each word, in capitals. `ada lovelace` gives `AL`. In main, ask for a name and print its initials.\n\nUse the `if __name__ == \"__main__\":` guard. The checker imports your file and calls initials directly.",starter:py`def main():
    ...


def initials(name):
    ...


if __name__ == "__main__":
    main()
`,
   tests:[{stdin:["grace brewster hopper"],out:"GBH"},{stdin:["Ada Lovelace"],out:"AL"},{skipRun:true,label:"Imports your file and calls initials",check:py`m = fresh()
f = get(m, "initials")
for given, want in [("ada lovelace", "AL"), ("alan", "A"), ("  tim  berners lee ", "TBL")]:
    got = f(given)
    assert got == want, f"initials({given!r}) returned {got!r}, expected {want!r}"`}],hints:["name.split() gives a list of words and ignores extra spaces.","Build a string: result = \"\" then result += word[0].upper() for each word, and return result."],solution:py`def main():
    print(initials(input("Name: ")))


def initials(name):
    result = ""
    for word in name.split():
        result += word[0].upper()
    return result


if __name__ == "__main__":
    main()`}]},

{n:8,week:5,title:"Testing your code",
 sections:[
  {h:"Why write tests",p:"Re-typing inputs by hand every time you change something is slow, and you'll forget cases. A test is code that checks your code, and you can run all of them in a second."},
  {h:"assert",p:"assert square(3) == 9 does nothing if it's True and raises an AssertionError if it's False. It's the building block of every test."},
  {h:"Test functions and pytest",p:"Put asserts inside functions whose names start with test_, in a file whose name starts with test_, like test_calculator.py. Running pytest test_calculator.py finds and runs every test_ function and reports which failed. pytest isn't on this site, but the checker runs your test_ functions in the same way."},
  {h:"Testing the edges",p:"Bugs hide at the edges: 0, negative numbers, empty strings, the largest or smallest value, odd capitals and extra spaces. Write one small test function per idea, for example test_negative and test_zero, so a failure tells you exactly what broke."},
  {h:"Testing for errors",p:"To check a function raises an error: import pytest, then with pytest.raises(ValueError): followed by an indented convert(\"cat\"). The test passes only if that error is raised."},
  {h:"Code and tests in separate files",p:"The code lives in calculator.py and the tests in test_calculator.py, which starts with from calculator import square. That's why the __name__ guard from the last unit matters: importing must not run main."}],
 takeaways:["assert condition: silent when True, AssertionError when False.","Name test functions and test files with a test_ prefix.","One test function per idea: zero, negatives, empty, capitals.","pytest.raises(Error) checks that an error happens."],
 quick:[
  {q:"What happens when Python runs assert 2 + 2 == 4?",opts:["Nothing: the program carries on","It prints True","It prints 4","AssertionError"],a:0,why:"assert is silent when the condition holds."},
  {q:"What happens when Python runs assert 2 + 2 == 5?",opts:["AssertionError","It prints False","Nothing","SyntaxError"],a:0,why:"A false assert raises AssertionError."},
  {q:"Which function will pytest run automatically?",opts:["test_add","add_test","check_add","testAdd"],a:0,why:"pytest looks for names starting with test_."},
  {q:"Which of these sets of inputs best tests is_even(n)?",opts:["2, 3, 0, -4, -7","2, 4, 6","1, 3, 5","100"],a:0,why:"It covers even, odd, zero and negatives of both."},
  {q:"A test file says from calculator import square. Which file must exist?",opts:["calculator.py","square.py","test_square.py","calculator.txt"],a:0,why:"import calculator looks for calculator.py."},
  {q:"What does this print?",code:py`def test():
    assert 1 == 1
    print("ok")

test()`,a:"ok",why:"The assert passes, so the print runs."}],
 problems:[
  {id:"clamp",title:"Make the tests pass",brief:"The tests are already written. Your job is to write `clamp(n, low, high)` so they pass. clamp returns n if it's between low and high, low if n is below that, and high if n is above it.\n\nRun calls the test functions at the bottom, so you'll see the first failure.",starter:py`def clamp(n, low, high):
    ...


def test_inside():
    assert clamp(5, 0, 10) == 5


def test_below():
    assert clamp(-3, 0, 10) == 0


def test_above():
    assert clamp(42, 0, 10) == 10


def test_edges():
    assert clamp(0, 0, 10) == 0
    assert clamp(10, 0, 10) == 10


if __name__ == "__main__":
    test_inside()
    test_below()
    test_above()
    test_edges()
    print("All tests passed")
`,
   tests:[{out:"All tests passed",label:"Runs the tests"},{skipRun:true,label:"Hidden checks",check:py`m = fresh()
f = get(m, "clamp")
for args, want in [((5, 0, 10), 5), ((-3, 0, 10), 0), ((42, 0, 10), 10), ((7, 7, 7), 7), ((-50, -10, -5), -10), ((2.5, 0, 1), 1)]:
    got = f(*args)
    assert got == want, f"clamp{args} returned {got!r}, expected {want!r}"`}],hints:["if n < low: return low. Then deal with n > high. Otherwise return n.","Or in one line: return max(low, min(n, high))."],solution:py`def clamp(n, low, high):
    if n < low:
        return low
    if n > high:
        return high
    return n


def test_inside():
    assert clamp(5, 0, 10) == 5


def test_below():
    assert clamp(-3, 0, 10) == 0


def test_above():
    assert clamp(42, 0, 10) == 10


def test_edges():
    assert clamp(0, 0, 10) == 0
    assert clamp(10, 0, 10) == 10


if __name__ == "__main__":
    test_inside()
    test_below()
    test_above()
    test_edges()
    print("All tests passed")`},
  {id:"testgreet",title:"Write tests for greet",brief:"There's a file called greeting.py with a function `greet(name)`. It should:\n\n- strip spaces from the ends and use title case: `greet(\"  ada \")` returns `Hello, Ada!`\n- return `Hello, stranger!` when the name is empty or only spaces\n\nYou write test_ functions that check this. The checker runs your tests against the correct greet, where they must all pass, and against three broken versions, where at least one test must fail for each.",
   files:{"greeting.py":py`def greet(name):
    name = name.strip().title()
    if not name:
        return "Hello, stranger!"
    return f"Hello, {name}!"
`},starter:py`from greeting import greet


def test_basic():
    assert greet("Ada") == "Hello, Ada!"


# Add more test_ functions below
`,
   tests:[{skipRun:true,label:"Your tests vs the correct greet and three broken ones",check:py`GOOD = '''def greet(name):
    name = name.strip().title()
    if not name:
        return "Hello, stranger!"
    return f"Hello, {name}!"
'''
BUGS = {
    "forgets to strip spaces": '''def greet(name):
    name = name.title()
    if not name.strip():
        return "Hello, stranger!"
    return f"Hello, {name}!"
''',
    "forgets title case": '''def greet(name):
    name = name.strip()
    if not name:
        return "Hello, stranger!"
    return f"Hello, {name}!"
''',
    "doesn't handle an empty name": '''def greet(name):
    name = name.strip().title()
    return f"Hello, {name}!"
''',
}
use_module("greeting", GOOD)
names, failed = run_tests(fresh())
assert len(names) >= 2, "Write at least two test functions whose names start with test_."
assert not failed, "These fail against the correct greet: " + ", ".join(failed) + ". A test should only fail when greet is wrong."
for bug, src in BUGS.items():
    use_module("greeting", src)
    names, failed = run_tests(fresh())
    assert failed, f"Your tests didn't catch a greet that {bug}. Add a test for that case."`}],hints:["One idea per test: test_strips, test_title_case, test_empty.","greet(\"   \") should return \"Hello, stranger!\" and greet(\"ada lovelace\") should return \"Hello, Ada Lovelace!\""],solution:py`from greeting import greet


def test_basic():
    assert greet("Ada") == "Hello, Ada!"


def test_strips():
    assert greet("  Ada  ") == "Hello, Ada!"


def test_title_case():
    assert greet("ada lovelace") == "Hello, Ada Lovelace!"


def test_empty():
    assert greet("") == "Hello, stranger!"
    assert greet("   ") == "Hello, stranger!"`},
  {id:"testeven",title:"Catch the edge cases",brief:"parity.py has `is_even(n)`, which returns True for even numbers, including 0 and negative even numbers. Write test_ functions for it. The checker runs them against the correct version and against versions that get odd numbers, zero and negative numbers wrong.",
   files:{"parity.py":"def is_even(n):\n    return n % 2 == 0\n"},starter:py`from parity import is_even


def test_even():
    assert is_even(4)
`,
   tests:[{skipRun:true,label:"Your tests vs the correct is_even and three broken ones",check:py`use_module("parity", "def is_even(n):\n    return n % 2 == 0\n")
names, failed = run_tests(fresh())
assert names, "Write some test functions whose names start with test_."
assert not failed, "These fail against the correct is_even: " + ", ".join(failed) + "."
BUGS = {
    "says every number is even": "def is_even(n):\n    return True\n",
    "says 0 is odd": "def is_even(n):\n    return n % 2 == 0 and n != 0\n",
    "gets negative numbers wrong": "def is_even(n):\n    return n > 0 and n % 2 == 0 or n == 0\n",
}
for bug, src in BUGS.items():
    use_module("parity", src)
    names, failed = run_tests(fresh())
    assert failed, f"Your tests didn't catch an is_even that {bug}."`}],hints:["Check odd numbers too: assert not is_even(3)","Zero and negatives: is_even(0) and is_even(-2) are True; is_even(-3) is False."],solution:py`from parity import is_even


def test_even():
    assert is_even(4)


def test_odd():
    assert not is_even(3)


def test_zero():
    assert is_even(0)


def test_negative():
    assert is_even(-2)
    assert not is_even(-3)`}]},

{n:9,week:6,title:"Reading and writing files",
 sections:[
  {h:"Why files",p:"Variables disappear when the program ends. Files stay. Saving to a file is how programs remember things between runs."},
  {h:"open and with",p:"with open(\"names.txt\") as file: opens a file and closes it again automatically when the indented block ends. The second argument is the mode: \"r\" reads (the default), \"w\" writes and wipes what was there, and \"a\" appends to the end."},
  {h:"Reading lines",p:"for line in file: gives one line at a time, and each line ends with a \\n newline. line.rstrip() removes it. file.readlines() gives a list of all the lines, and file.read() gives the whole thing as one string."},
  {h:"Writing",p:"file.write(\"Ada\\n\") writes text. write doesn't add a new line for you, so include \\n yourself."},
  {h:"Sorting",p:"sorted(names) returns a new sorted list. sorted(nums, reverse=True) sorts biggest first. sorted(students, key=lambda s: s[\"score\"]) sorts by part of each item."},
  {h:"CSV files",p:"CSV is a table stored as text, with commas between columns. line.split(\",\") works until a value contains a comma. The csv module handles that properly. csv.DictReader(file) gives each row as a dictionary keyed by the header row, so row[\"name\"]. csv.writer and csv.DictWriter write rows."},
  {h:"Files on this site",p:"Each problem comes with its own pretend folder. The files it starts with are listed above the editor, and anything your program writes is checked after it runs."}],
 takeaways:["with open(name, mode) as file: closes the file for you.","\"w\" overwrites, \"a\" appends, \"r\" reads.","Lines keep their \\n: use .rstrip().","csv.DictReader gives rows as dictionaries."],
 quick:[
  {q:"What does open(\"log.txt\", \"w\") do to a file that already has text in it?",opts:["Wipes it and starts empty","Adds to the end","Opens it read-only","Raises an error"],a:0,why:"\"w\" overwrites. Use \"a\" to append."},
  {q:"Which mode adds to the end of a file?",opts:["\"a\"","\"w\"","\"r\"","\"+\""],a:0,why:"a is for append."},
  {q:"What does this print?",code:py`line = "Ada\n"
print(line.rstrip() + "!")`,a:"Ada!",why:"rstrip removes the newline at the end."},
  {q:"What does this print?",code:py`print(sorted(["pear", "apple", "fig"]))`,a:"['apple', 'fig', 'pear']",why:"Strings sort alphabetically."},
  {q:"What does this print?",code:py`print(sorted([3, 1, 2], reverse=True))`,a:"[3, 2, 1]",why:"reverse=True sorts biggest first."},
  {q:"What does this print?",code:py`row = "Ada,1815".split(",")
print(row[1])`,a:"1815",why:"split makes [\"Ada\", \"1815\"]."},
  {q:"Why write with open(...) as f: instead of plain f = open(...)?",opts:["The file is closed automatically, even after an error","It's faster","It's the only way to read","It makes a backup"],a:0,why:"with handles the closing for you."},
  {q:"csv.DictReader gives you each row as…",opts:["A dictionary keyed by the header row","A string","A list of characters","A number"],a:0,why:"So you can write row[\"name\"] instead of remembering column positions."}],
 problems:[
  {id:"wc",title:"Word count",argv:true,brief:"Take a filename as a command-line argument and print two lines: `lines: N` and `words: N`. If the file doesn't exist, exit using sys.exit(\"File not found\").\n\nTry it with the argument `poem.txt`.",
   files:{"poem.txt":"The rain falls soft\non quiet streets\nand Python counts\nthe words it meets\n"},starter:"import sys\n\n",
   tests:[{argv:["poem.txt"],out:"lines: 4\nwords: 14"},{argv:["notes.txt"],files:{"notes.txt":"one two three\n"},out:"lines: 1\nwords: 3"},{argv:["missing.txt"],exit:"nonzero",errIncludes:"File not found"}],hints:["try: with open(sys.argv[1]) as f: lines = f.readlines(). Catch FileNotFoundError.","words: add up len(line.split()) over every line."],solution:py`import sys

try:
    with open(sys.argv[1]) as f:
        lines = f.readlines()
except FileNotFoundError:
    sys.exit("File not found")
words = 0
for line in lines:
    words += len(line.split())
print(f"lines: {len(lines)}")
print(f"words: {words}")`},
  {id:"sortnames",title:"Sorted names",brief:"names.txt has one name per line. Print `hello, NAME` for each name in alphabetical order.",files:{"names.txt":"Ron\nHermione\nHarry\nGinny\n"},starter:"",
   tests:[{out:"hello, Ginny\nhello, Harry\nhello, Hermione\nhello, Ron"},{files:{"names.txt":"Zed\nAmy\n"},out:"hello, Amy\nhello, Zed"}],hints:["Read every line into a list, using .rstrip() on each.","for name in sorted(names): print(f\"hello, {name}\")"],solution:py`names = []
with open("names.txt") as f:
    for line in f:
        names.append(line.rstrip())
for name in sorted(names):
    print(f"hello, {name}")`},
  {id:"scores",title:"Class results",brief:"scores.csv has the header `name,score`. Print the top scorer as `Top: NAME (SCORE)` and then the average as `Average: X.X` with one decimal place. Use csv.DictReader.",files:{"scores.csv":"name,score\nAmara,78\nBen,91\nChen,85\nDee,62\n"},starter:"import csv\n\n",
   tests:[{out:"Top: Ben (91)\nAverage: 79.0"},{files:{"scores.csv":"name,score\nZoe,50\nYan,100\n"},out:"Top: Yan (100)\nAverage: 75.0"}],hints:["Inside for row in csv.DictReader(f): convert with int(row[\"score\"]).","Track the best row as you go, or collect rows and use max(rows, key=lambda r: r[\"score\"])."],solution:py`import csv

rows = []
with open("scores.csv") as f:
    for row in csv.DictReader(f):
        rows.append({"name": row["name"], "score": int(row["score"])})
top = max(rows, key=lambda r: r["score"])
average = sum(r["score"] for r in rows) / len(rows)
print(f"Top: {top['name']} ({top['score']})")
print(f"Average: {average:.1f}")`},
  {id:"guestbook",title:"Guest book",brief:"guests.txt already has some names. Ask for a new guest's name and append it to the file. Then print every guest in the file, numbered: `1. Ann`, `2. Bo` and so on.",files:{"guests.txt":"Ann\nBo\n"},starter:"",
   tests:[{stdin:["Cy"],out:"1. Ann\n2. Bo\n3. Cy",check:py`assert read("guests.txt") == "Ann\nBo\nCy\n", "guests.txt should end up as Ann, Bo, Cy, one per line. Did you open it with \"a\" and add a newline?"`},{stdin:["Di"],files:{"guests.txt":""},out:"1. Di"}],hints:["with open(\"guests.txt\", \"a\") as f: f.write(name + \"\\n\")","Then open it again to read. enumerate(lines, 1) counts from 1."],solution:py`name = input("Name: ")
with open("guests.txt", "a") as f:
    f.write(name + "\n")
with open("guests.txt") as f:
    for i, line in enumerate(f, 1):
        print(f"{i}. {line.rstrip()}")`}]},

{n:10,week:7,title:"Regular expressions",
 sections:[
  {h:"Patterns for text",p:"A regular expression (regex) describes the shape of some text, like \"one or more digits, then an @\". import re, then re.search(pattern, text) returns a match if the pattern appears anywhere in the text, or None if it doesn't."},
  {h:"Raw strings",p:"Write patterns as r\"...\". The r stops Python from treating backslashes specially, so \\d reaches the regex engine untouched."},
  {h:"The building blocks",p:". is any character. * is zero or more of the thing before it, + is one or more, ? is zero or one, and {2,4} is between 2 and 4. [abc] is one of a, b or c, [a-z] a range, and [^abc] anything except those. \\d is a digit, \\w a letter, digit or underscore, and \\s whitespace. a|b means either."},
  {h:"Anchors for validation",p:"^ means the start of the text and $ the end. Without them, re.search(r\"\\d+\", \"abc123\") matches because the digits appear somewhere. To check the whole thing has a shape, use ^...$ or re.fullmatch."},
  {h:"Capturing parts",p:"Brackets capture: m = re.search(r\"(\\w+)@(\\w+)\", text), then m.group(1) is the part before the @. The walrus operator lets you match and test in one line: if m := re.search(...):. Use (?:...) when you need brackets but don't want to capture."},
  {h:"Finding and replacing",p:"re.findall(pattern, text) returns every match as a list. re.sub(pattern, replacement, text) replaces matches. re.IGNORECASE as an extra argument ignores capitals."}],
 takeaways:["re.search finds a pattern anywhere; re.fullmatch needs the whole string to match.","Always use r\"raw strings\" for patterns.","\\d digit, \\w word character, \\s space, + one or more, * zero or more, ? optional.","Brackets capture: m.group(1)."],
 quick:[
  {q:"What does this print?",code:py`import re
print(bool(re.search(r"cat", "concatenate")))`,a:"True",why:"search looks anywhere in the text: con-cat-enate."},
  {q:"What does this print?",code:py`import re
print(bool(re.fullmatch(r"\d+", "123a")))`,a:"False",why:"fullmatch needs the whole string to be digits."},
  {q:"Which string matches ^\\w+@\\w+\\.com$?",opts:["ada@mail.com","ada@mail.co.uk","@mail.com","ada mail.com"],a:0,why:"One or more word characters, an @, more word characters, then .com at the very end."},
  {q:"What does this print?",code:py`import re
print(re.findall(r"\d+", "a1b22c333"))`,a:"['1', '22', '333']",why:"findall returns every match as a list of strings."},
  {q:"What does this print?",code:py`import re
m = re.search(r"(\w+)@", "hi bob@x.com")
print(m.group(1))`,a:"bob",why:"The brackets capture the word before the @."},
  {q:"What does this print?",code:py`import re
print(re.sub(r"\s+", " ", "a   b    c"))`,a:"a b c",why:"Each run of whitespace becomes a single space."},
  {q:"What does ? mean after a character in a pattern?",opts:["Zero or one of it","Any character","One or more of it","The end of the text"],a:0,why:"So colou?r matches color and colour."},
  {q:"What does this print?",code:py`import re
print(bool(re.search(r"^hello", "Hello there", re.IGNORECASE)))`,a:"True",why:"IGNORECASE ignores capitals, and ^ anchors to the start."}],
 problems:[
  {id:"hexcolour",title:"Hex colour",brief:"Write `is_hex(s)`. It returns True if s is a # followed by exactly six hex digits (0-9, a-f or A-F), and False otherwise. In main, ask for a colour and print `Valid` or `Invalid`. Use the __name__ guard.",starter:py`import re


def main():
    ...


def is_hex(s):
    ...


if __name__ == "__main__":
    main()
`,
   tests:[{stdin:["#1a2B3c"],out:"Valid"},{stdin:["#12345"],out:"Invalid"},{skipRun:true,label:"Imports your file and calls is_hex",check:py`f = get(fresh(), "is_hex")
cases = {"#ffffff": True, "#A1B2C3": True, "#000000": True, "ffffff": False, "#fffffff": False, "#ggg000": False, "# 12345": False, "x#123456": False, "#123456 ": False}
for s, want in cases.items():
    got = bool(f(s))
    assert got == want, f"is_hex({s!r}) gave {got}, expected {want}"`}],hints:["Character class: [0-9a-fA-F]. Exactly six of them: {6}.","return bool(re.fullmatch(r\"#[0-9a-fA-F]{6}\", s))"],solution:py`import re


def main():
    if is_hex(input("Colour: ")):
        print("Valid")
    else:
        print("Invalid")


def is_hex(s):
    return bool(re.fullmatch(r"#[0-9a-fA-F]{6}", s))


if __name__ == "__main__":
    main()`},
  {id:"ghuser",title:"Username from a URL",brief:"Ask for a GitHub profile URL and print just the username. Accept `http` or `https`, an optional `www.`, and an optional slash at the end. If it isn't a GitHub profile URL, print `Not a GitHub URL`. Usernames are letters, digits and hyphens.\n\n`https://github.com/octocat` prints `octocat`.",starter:"import re\n\n",
   tests:[{stdin:["https://github.com/octocat"],out:"octocat"},{stdin:["http://www.github.com/ada-l/"],out:"ada-l"},{stdin:["  github.com/chak720 "],out:"Not a GitHub URL"},{stdin:["https://gitlab.com/octocat"],out:"Not a GitHub URL"},{stdin:["https://github.com/octocat/repo"],out:"Not a GitHub URL"}],hints:["Optional pieces: s? for the s in https, (?:www\\.)? for www.","re.fullmatch(r\"https?://(?:www\\.)?github\\.com/([A-Za-z0-9-]+)/?\", url.strip()), then m.group(1)."],solution:py`import re

url = input("URL: ").strip()
if m := re.fullmatch(r"https?://(?:www\.)?github\.com/([A-Za-z0-9-]+)/?", url):
    print(m.group(1))
else:
    print("Not a GitHub URL")`},
  {id:"hashtags",title:"Hashtags",brief:"Ask for a post and print each hashtag in it, in order, lowercase and without the #, one per line. A hashtag is # followed by word characters. If there are none, print `No hashtags`.",starter:"import re\n\n",
   tests:[{stdin:["Learning #Python with #CS50 today"],out:"python\ncs50"},{stdin:["no tags here"],out:"No hashtags"},{stdin:["#a#b and #c_d!"],out:"a\nb\nc_d"}],hints:["re.findall(r\"#(\\w+)\", text) returns just the captured part.","Check if the list is empty before looping."],solution:py`import re

tags = re.findall(r"#(\w+)", input("Post: "))
if not tags:
    print("No hashtags")
for tag in tags:
    print(tag.lower())`},
  {id:"phone",title:"Tidy a UK mobile number",brief:"Ask for a UK mobile number. Accept spaces or dashes anywhere, and either `07` or `+447` at the start, followed by nine more digits. Print it in the form `07700 900123`: 0, then 4 digits, a space, then 6 digits. Print `Invalid` if it doesn't fit.",starter:"import re\n\n",
   tests:[{stdin:["07700 900123"],out:"07700 900123"},{stdin:["+44 7700 900123"],out:"07700 900123"},{stdin:["07700-900-123"],out:"07700 900123"},{stdin:["0770090012"],out:"Invalid"},{stdin:["01632 960001"],out:"Invalid"},{stdin:["+44 7700 9001234"],out:"Invalid"}],hints:["First remove spaces and dashes: re.sub(r\"[\\s-]\", \"\", number)","Then fullmatch r\"(?:\\+44|0)(7\\d{3})(\\d{6})\" and rebuild with the two groups."],solution:py`import re

number = re.sub(r"[\s-]", "", input("Number: "))
if m := re.fullmatch(r"(?:\+44|0)(7\d{3})(\d{6})", number):
    print(f"0{m.group(1)} {m.group(2)}")
else:
    print("Invalid")`}]},

{n:11,week:8,title:"Classes and objects",
 sections:[
  {h:"Why classes",p:"So far you've kept data in variables, lists and dictionaries. A class lets you design your own type that bundles data with the functions that work on it. Python's str and list are classes too, which is why \"hi\".upper() works."},
  {h:"class and __init__",p:"class Student: starts the design. def __init__(self, name, house): runs when you create one with Student(\"Harry\", \"Gryffindor\"). Inside, self.name = name stores the value on that particular object. Each object is called an instance."},
  {h:"self",p:"self is the object the method is working on. Python passes it in for you: s.greet() runs greet with self set to s. Every method takes self first."},
  {h:"Methods and __str__",p:"Methods are functions inside a class, like def area(self): return self.width * self.height. __str__ is a special method that controls what print(obj) shows. Without it you get something like <__main__.Student object at 0x...>."},
  {h:"Checking values",p:"Raise ValueError in __init__ if the values make no sense, like a negative width. Bad objects then can't be created."},
  {h:"Properties",p:"@property makes a method look like an attribute: c.fahrenheit instead of c.fahrenheit(). Add @fahrenheit.setter to run code, such as validation, when someone assigns to it."},
  {h:"Class methods, inheritance and operators",p:"@classmethod belongs to the class rather than one object, and is often used as an alternative constructor. class Cat(Animal): inherits Animal's methods and can override them. Special methods like __add__ let your objects work with +."}],
 takeaways:["class Name: with def __init__(self, ...) sets up each object.","self.x stores data on this object.","__str__ controls what print shows.","Raise ValueError for invalid values.","@property for computed or validated attributes."],
 quick:[
  {q:"What does this print?",code:py`class Dog:
    def __init__(self, name):
        self.name = name

    def bark(self):
        return f"{self.name} says woof"


d = Dog("Rex")
print(d.bark())`,a:"Rex says woof",why:"bark reads the name stored on d."},
  {q:"Inside a method, what is self?",opts:["The object the method was called on","The class itself","The first argument you type","A keyword that does nothing"],a:0,why:"d.bark() passes d in as self."},
  {q:"What does this print?",code:py`class Point:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __str__(self):
        return f"({self.x}, {self.y})"


print(Point(2, 3))`,a:"(2, 3)",why:"print uses __str__."},
  {q:"A class has no __str__. What does print(obj) show?",opts:["Something like <__main__.Point object at 0x7f...>","Nothing","An error","Every attribute"],a:0,why:"The default shows the type and a memory address."},
  {q:"What does this print?",code:py`class Animal:
    def speak(self):
        return "..."


class Cat(Animal):
    def speak(self):
        return "meow"


print(Cat().speak())`,a:"meow",why:"Cat overrides speak from Animal."},
  {q:"What does this print?",code:py`class V:
    def __init__(self, x, y):
        self.x, self.y = x, y

    def __add__(self, other):
        return V(self.x + other.x, self.y + other.y)


v = V(1, 2) + V(3, 4)
print(v.x, v.y)`,a:"4 6",why:"+ calls __add__."},
  {q:"What does this print?",code:py`class Counter:
    count = 0

    def __init__(self):
        Counter.count += 1


Counter()
Counter()
print(Counter.count)`,a:"2",why:"count belongs to the class and is shared by every instance."}],
 problems:[
  {id:"rect",title:"Rectangle",brief:"Write a class `Rectangle` created as `Rectangle(width, height)`. Give it:\n\n- `area()` and `perimeter()` methods\n- `__str__` returning `Rectangle(3 x 4)`\n- a ValueError if either side isn't above 0\n\nYou don't need a main. The checker creates rectangles and tests them.",starter:py`class Rectangle:
    def __init__(self, width, height):
        ...
`,
   tests:[{skipRun:true,label:"Creates rectangles and checks them",check:py`R = get(fresh(), "Rectangle")
r = R(3, 4)
assert r.area() == 12, f"Rectangle(3, 4).area() gave {r.area()}, expected 12"
assert r.perimeter() == 14, f"Rectangle(3, 4).perimeter() gave {r.perimeter()}, expected 14"
assert str(r) == "Rectangle(3 x 4)", f"str(Rectangle(3, 4)) gave {str(r)!r}, expected 'Rectangle(3 x 4)'"
assert R(2.5, 2).area() == 5, "Rectangle(2.5, 2).area() should be 5"
for w, h in [(0, 4), (3, -1)]:
    try:
        R(w, h)
    except ValueError:
        pass
    else:
        raise AssertionError(f"Rectangle({w}, {h}) should raise ValueError")`}],hints:["In __init__: if width <= 0 or height <= 0: raise ValueError(\"Sides must be positive\"), then store self.width and self.height.","def __str__(self): return f\"Rectangle({self.width} x {self.height})\""],solution:py`class Rectangle:
    def __init__(self, width, height):
        if width <= 0 or height <= 0:
            raise ValueError("Sides must be positive")
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

    def __str__(self):
        return f"Rectangle({self.width} x {self.height})"`},
  {id:"account",title:"Bank account",brief:"Write a class `Account`. `Account()` starts with a balance of 0, and `Account(50)` starts with 50. Give it:\n\n- a `balance` attribute\n- `deposit(amount)` and `withdraw(amount)`, which both raise ValueError if the amount isn't above 0\n- a ValueError from `withdraw` if the amount is more than the balance\n- `__str__` returning `Balance: £12.50`, always with two decimals",starter:py`class Account:
    ...
`,
   tests:[{skipRun:true,label:"Opens accounts and moves money",check:py`A = get(fresh(), "Account")
a = A()
assert a.balance == 0, "Account() should start with balance 0"
a.deposit(20)
a.withdraw(7.5)
assert a.balance == 12.5, f"After depositing 20 and withdrawing 7.5, balance is {a.balance}, expected 12.5"
assert str(a) == "Balance: £12.50", f"str gave {str(a)!r}, expected 'Balance: £12.50'"
assert A(50).balance == 50, "Account(50) should start with balance 50"
def raises(f, *args):
    try:
        f(*args)
    except ValueError:
        return True
    return False
b = A(10)
assert raises(b.withdraw, 11), "Withdrawing more than the balance should raise ValueError"
assert b.balance == 10, "A failed withdrawal shouldn't change the balance"
assert raises(b.deposit, 0), "deposit(0) should raise ValueError"
assert raises(b.deposit, -5), "deposit(-5) should raise ValueError"
assert raises(b.withdraw, -1), "withdraw(-1) should raise ValueError"`}],hints:["def __init__(self, balance=0): self.balance = balance. The =0 makes it optional.","In withdraw, check both problems before changing self.balance."],solution:py`class Account:
    def __init__(self, balance=0):
        self.balance = balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        self.balance += amount

    def withdraw(self, amount):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount

    def __str__(self):
        return f"Balance: £{self.balance:.2f}"`},
  {id:"tempprop",title:"Temperature with properties",brief:"Write a class `Temperature` created as `Temperature(celsius)`. Give it:\n\n- a `celsius` property that raises ValueError if set below -273.15, including in __init__\n- a `fahrenheit` property you can read and set, where setting it updates celsius\n\nF = C × 9 / 5 + 32.",starter:py`class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius
`,
   tests:[{skipRun:true,label:"Creates temperatures and checks the properties",check:py`T = get(fresh(), "Temperature")
t = T(100)
assert abs(t.fahrenheit - 212) < 1e-9, f"Temperature(100).fahrenheit gave {t.fahrenheit}, expected 212"
t.fahrenheit = 32
assert abs(t.celsius) < 1e-9, f"After setting fahrenheit = 32, celsius is {t.celsius}, expected 0"
t.celsius = -40
assert abs(t.fahrenheit + 40) < 1e-9, "-40°C should be -40°F"
for bad in [-300, -273.16]:
    try:
        T(bad)
    except ValueError:
        pass
    else:
        raise AssertionError(f"Temperature({bad}) should raise ValueError")
t = T(20)
try:
    t.celsius = -500
except ValueError:
    pass
else:
    raise AssertionError("Setting celsius to -500 should raise ValueError")`}],hints:["Store the real value in self._celsius. The @property called celsius returns it, and @celsius.setter validates before storing.","Because __init__ does self.celsius = celsius, it goes through the setter and gets validated too."],solution:py`class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @property
    def celsius(self):
        return self._celsius

    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Below absolute zero")
        self._celsius = value

    @property
    def fahrenheit(self):
        return self.celsius * 9 / 5 + 32

    @fahrenheit.setter
    def fahrenheit(self, value):
        self.celsius = (value - 32) * 5 / 9`}]},

{n:12,week:9,title:"Et cetera: the extra tools",
 sections:[
  {h:"Sets",p:"set([1, 1, 2]) is {1, 2}: a set keeps only unique values. Checking x in a_set is very fast. .add(x) puts something in."},
  {h:"Constants and globals",p:"Name values that never change in CAPITALS, like MAX_TRIES = 3, by convention. Functions can read variables defined outside them, but to change one they need global. Passing values in and returning results is usually cleaner."},
  {h:"Type hints and docstrings",p:"def total(prices: list[float]) -> float: documents the types going in and out. Python doesn't enforce them, but the mypy tool can check them. A \"\"\"docstring\"\"\" on the first line of a function explains what it does."},
  {h:"Unpacking, *args and **kwargs",p:"first, last = \"Ada Lovelace\".split() unpacks a list into variables. def total(*nums): accepts any number of arguments as a tuple, and **kwargs collects named ones into a dictionary. f(*my_list) spreads a list into separate arguments."},
  {h:"Comprehensions",p:"[n * n for n in nums if n % 2 == 0] builds a list in one line: the squares of the even numbers. {w: len(w) for w in words} builds a dictionary the same way. They replace the make-an-empty-list-then-append pattern."},
  {h:"map, filter, lambda, enumerate",p:"lambda x: x * 2 is a tiny unnamed function. map(f, items) applies f to each item, and filter(f, items) keeps the items where f returns True. enumerate(items) gives (index, item) pairs, handy for numbered lists."},
  {h:"Generators",p:"A function with yield instead of return produces values one at a time, only when asked. It's useful for long or endless sequences that wouldn't fit in a list."},
  {h:"After CS50P",p:"The course ends with a final project of your own. Pick something you'd actually use. You now know enough to build it."}],
 takeaways:["set() removes duplicates.","[expr for x in items if condition] builds a list.","*args takes any number of arguments.","enumerate gives index and item together.","yield makes a generator."],
 quick:[
  {q:"What does this print?",code:py`print(len(set([1, 1, 2, 3, 3])))`,a:"3",why:"The set is {1, 2, 3}."},
  {q:"What does this print?",code:py`print([n * n for n in range(4)])`,a:"[0, 1, 4, 9]",why:"Each n from 0 to 3, squared."},
  {q:"What does this print?",code:py`print([n for n in range(10) if n % 3 == 0])`,a:"[0, 3, 6, 9]",why:"Only multiples of 3 are kept."},
  {q:"What does this print?",code:py`for i, c in enumerate("ab"):
    print(i, c)`,a:"0 a\n1 b",why:"enumerate pairs each item with its index."},
  {q:"What does this print?",code:py`def total(*nums):
    return sum(nums)

print(total(1, 2, 3))`,a:"6",why:"*nums collects all the arguments into a tuple."},
  {q:"What does this print?",code:py`first, *rest = [1, 2, 3]
print(rest)`,a:"[2, 3]",why:"*rest takes everything that's left over."},
  {q:"What does this print?",code:py`print(list(map(str.upper, ["a", "b"])))`,a:"['A', 'B']",why:"map applies str.upper to each item."},
  {q:"What does this print?",code:py`print({w: len(w) for w in ["hi", "hey"]})`,a:"{'hi': 2, 'hey': 3}",why:"A dictionary comprehension."},
  {q:"What does this print?",code:py`def doubles(n):
    for i in range(n):
        yield i * 2

print(list(doubles(3)))`,a:"[0, 2, 4]",why:"list() pulls every value from the generator."}],
 problems:[
  {id:"unique",title:"Unique words",brief:"Ask for a sentence and print how many different words it has. Ignore capitals, and strip the punctuation `.,!?` from the ends of each word.\n\n`The cat and the hat.` has 4: the, cat, and, hat.",starter:"",
   tests:[{stdin:["The cat and the hat."],out:"4"},{stdin:["Go, go, GO!"],out:"1"},{stdin:["one"],out:"1"},{stdin:["a b c d e"],out:"5"}],hints:["For each word in text.lower().split(), use word.strip(\".,!?\").","Put them in a set and print its len."],solution:py`text = input("Sentence: ")
words = {w.strip(".,!?") for w in text.lower().split()}
print(len(words))`},
  {id:"evensq",title:"One-line comprehension",brief:"Write `evens_squared(nums)` that returns a list of the squares of only the even numbers, in their original order. Write it as a list comprehension.\n\n`evens_squared([1, 2, 3, 4])` returns `[4, 16]`.",starter:py`def evens_squared(nums):
    ...
`,
   tests:[{skipRun:true,label:"Calls evens_squared",check:py`f = get(fresh(), "evens_squared")
for given, want in [([1, 2, 3, 4], [4, 16]), ([], []), ([1, 3, 5], []), ([-2, 0, 6], [4, 0, 36])]:
    got = f(given)
    assert got == want, f"evens_squared({given}) returned {got!r}, expected {want!r}"
assert " for " in code and "[" in code, "Use a list comprehension: [... for n in nums if ...]"`}],hints:["The shape is [EXPRESSION for n in nums if CONDITION].","return [n * n for n in nums if n % 2 == 0]"],solution:py`def evens_squared(nums):
    return [n * n for n in nums if n % 2 == 0]`},
  {id:"average",title:"Average of anything",brief:"Write `average(*nums)` that takes any number of numbers and returns their mean. With no numbers it returns 0. Add type hints and a docstring.\n\n`average(2, 4, 9)` returns `5.0`.",starter:py`def average(*nums):
    ...
`,
   tests:[{skipRun:true,label:"Calls average",check:py`f = get(fresh(), "average")
assert f(2, 4, 9) == 5, f"average(2, 4, 9) gave {f(2, 4, 9)}, expected 5.0"
assert f() == 0, "average() with no numbers should return 0"
assert f(7) == 7, "average(7) should be 7"
assert abs(f(1, 2) - 1.5) < 1e-9, "average(1, 2) should be 1.5"
assert f.__doc__, "Add a docstring: a \"\"\"string\"\"\" as the first line inside the function"`}],hints:["nums is a tuple, so sum(nums) and len(nums) work.","Check if not nums: return 0 first, so you never divide by zero."],solution:py`def average(*nums: float) -> float:
    """Return the mean of the numbers given, or 0 if there are none."""
    if not nums:
        return 0
    return sum(nums) / len(nums)`},
  {id:"numbered",title:"Numbered to-do list",brief:"Read tasks until input runs out (EOFError). Skip blank lines and duplicates, ignoring capitals so `Milk` and `milk` count as the same task. Print them numbered in the order first seen, in the form `1. Buy milk`. Use enumerate and a set.",starter:"",
   tests:[{stdin:["Buy milk","Call mum","","buy milk","Walk"],out:"1. Buy milk\n2. Call mum\n3. Walk"},{stdin:[],out:""}],hints:["Keep a list for order and a set of lowercased tasks for spotting duplicates.","for i, task in enumerate(tasks, 1): print(f\"{i}. {task}\")"],solution:py`tasks = []
seen = set()
while True:
    try:
        task = input().strip()
    except EOFError:
        break
    if task and task.lower() not in seen:
        seen.add(task.lower())
        tasks.append(task)
for i, task in enumerate(tasks, 1):
    print(f"{i}. {task}")`}]}
];
