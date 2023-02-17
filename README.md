# Echo

#### https://github.com/cs0320-s2023/sprint-2-awick2-bleahey

## By Alex Wick (awick2) and Brendan Leahey (bleahey)

Githubs:

- [alexjwick](https://github.com/alexjwick)

- [bpleahey](https://github.com/bpleahey)

Both members worked collaboratively on a LiveShare on all portions of the
project.

Alex had more front-end experience, so he was responsible for a bit
more of the css styling (although Brendan had significant contributions in
conceptualizing what the program would look like).

Estimated time: 12 hrs

## How To:

Upon launch, the user will be greeted with a blank text input box, REPL history,
and viewer.

For detailed descriptions of command line functions, the user may enter help
at any time during the program. An incorrect command will also provide this
information.

The recommended first step is to load a file using the load_file command,
passing the filepath as the second argument. For now, the supported mocked
filepaths are:

- band.csv
- ten-star.csv

Next, the user may choose to view the full table using the view command
or search the table for specific values using the search command. For now, the
only csv supporting full searching for all columns and values is band.csv.

The user may also toggle the descriptiveness of the REPL output at any time
using the command view.

## Design Choices:

The general hierarchy of our program is that main contains the majority of the
functionality for carrying out the front-end application.

Back-end functionality (parse/search) is imported (at the moment, from the mock
backend files CSVParser and CSVSearcher, which contain preset values based on
text inputs).

Within main, some key choices we made were:

- Storing the help message as a constant instance variable. This will allow us
  to change it easily and include it in multiple places if necessary.
- General handling of cases goes as follows:

  - A prepare method gets the HTML elements ready for user interactinos
  - The user text is passed to a interpret_command function, which separates the
    command text into case
  - Depending on the case of the command, a helper function is called that
    performs final javascript and html interactions to produce the desired output
    and display the command in the REPL history

- HTML elements such as replInputBox and replHistory that are accessed during
  the program are stored as global fields so that they can be modified within
  several functions that run during the program.
- We chose to store CSV data as a 2d array of strings, since all detailed
  backend functionality will be carried out by the CSVParser and we only need
  to worry about being able to view or search the data.

## Errors/Bugs:

There are no known errors or bugs in the program.

## Tests:

The testing is split into two files: main.test.ts and main.dom.test.ts.

The dom testing performs tests on the user-end functionality within the main
method. This includes ...

The main test file tests some helper or supporting functions of main, without
fully loading the user end application. This includes ...
