import { parse } from "./mock-backend/CSVParser.js";
import { search } from "./mock-backend/CSVSearcher.js";

// The window.onload callback is invoked when the window is first loaded by the browser
window.onload = () => {
  prepareTextInput();
  prepareButtonPress();
  prepareREPLHistory();
  prepareViewerDiv();

  // If you're adding an event for a button click, do something similar.
  // The event name in that case is "click", not "keypress", and the type of the element
  // should be HTMLButtonElement. The handler function for a "click" takes no arguments.
};

let replInputBox: HTMLInputElement;
let replHistory: HTMLDivElement;
let viewerDiv: HTMLDivElement;
let isVerbose: boolean = false;
let currentData: string[][] | null;

const helpMessage = `Program: CSVParser
<br>
<br>
Description:
Provides functionality for a user that desires to explore a CSV file
corresponding to a filepath in the current project. Further command description
can be found below.
<br>
<br>
Commands:
<br>
* mode - toggles viewer mode between verbose or brief (default is brief)
<br>
* load_file &lt;filepath&gt; - loads a file from the given filepath
<br>
* view - views the currently loaded file
<br>
* search &lt;column&gt; &lt;value&gt; - searches the currently loaded file for rows with the the given value in the given column
<br>
* help - displays this help message`;

/**
 * Prepares the components of the command box for receiving text input.
 */
function prepareTextInput() {
  const maybeInputs: HTMLCollectionOf<Element> =
    document.getElementsByClassName("repl-command-box");
  const maybeInput: Element | null = maybeInputs.item(0);
  if (maybeInput == null) {
    console.log("Couldn't find input element");
  } else if (!(maybeInput instanceof HTMLInputElement)) {
    console.log(`Found element ${maybeInput}, but it wasn't an input`);
  } else if (maybeInput.type != "text") {
    console.log(
      `Found input element ${maybeInput}, but it wasn't a text input`
    );
  } else {
    replInputBox = maybeInput;
  }
}

/**
 * Prepares the submit button for handling clicks from the user.
 */
function prepareButtonPress() {
  const maybeButtons: HTMLCollectionOf<Element> =
    document.getElementsByClassName("submit-button");
  const maybeButton: Element | null = maybeButtons.item(0);
  if (maybeButton == null) {
    console.log("Couldn't find button element");
  } else if (!(maybeButton instanceof HTMLButtonElement)) {
    console.log(`Found element ${maybeButton}, but it wasn't a button`);
  } else {
    maybeButton.addEventListener("click", handleButtonPress);
  }
}

/**
 * Prepares the history div for displaying the previous commands and output
 * from the user.
 */
function prepareREPLHistory() {
  const maybeDivs: HTMLCollectionOf<Element> =
    document.getElementsByClassName("repl-history");
  const maybeDiv: Element | null = maybeDivs.item(0);
  if (maybeDiv == null) {
    console.log("Couldn't find div element");
  } else if (!(maybeDiv instanceof HTMLDivElement)) {
    console.log(`Found element ${maybeDiv}, but it wasn't a div`);
  } else {
    replHistory = maybeDiv;
  }
}

/**
 * Prepare the Viewer div for displaying view or search outputs.
 */
function prepareViewerDiv() {
  const maybeDivs: HTMLCollectionOf<Element> =
    document.getElementsByClassName("viewer");
  const maybeDiv: Element | null = maybeDivs.item(0);
  if (maybeDiv == null) {
    console.log("Couldn't find div element");
  } else if (!(maybeDiv instanceof HTMLDivElement)) {
    console.log(`Found element ${maybeDiv}, but it wasn't a div`);
  } else {
    viewerDiv = maybeDiv;
  }
}

/**
 * Accepts a MouseEvent when the button is clicked and passes the current
 * value typed into the input box to the command interpeter function.
 *
 * @param MouseEvent - an event such as a button click
 */
function handleButtonPress(event: MouseEvent) {
  const command: string = replInputBox.value;
  replInputBox.value = "";
  interpretCommand(command);
}

/**
 * Interprets the user's text input from a variety of commmands.
 *
 * Inputs include "view", "mode", "read_file <file>", "search <column> <value>",
 * and "help" (which displays further details on the program and function of
 * each command).
 *
 * @param command - the type of command to be performed
 */
function interpretCommand(command: string) {
  if (command === "mode") {
    isVerbose = !isVerbose;
    addToREPLHistory("mode", "");
  } else if (command.startsWith("load_file")) {
    const filepath = command.substring(command.indexOf(" ") + 1);
    addToREPLHistory(command, runLoadFile(filepath));
  } else if (command === "view") {
    addToREPLHistory(command, runView());
  } else if (command.startsWith("search")) {
    const fields = command.substring(command.indexOf(" ") + 1).split(" ");
    if (fields.length != 2) {
      console.log("Error searching: invalid number of arguments");
      addToREPLHistory(command, "Error searching: invalid number of arguments");
    } else {
      addToREPLHistory(command, runSearch(fields[0], fields[1]));
    }
  } else if (command.startsWith("help")) {
    addToREPLHistory(command, helpMessage);
  } else {
    addToREPLHistory(
      command,
      `Error: unrecognized command.<br>
      <br>
      See help message below:<br>
      ` + helpMessage
    );
    console.log("Unrecognized command, help message displayed");
  }
}

/**
 * Calls an external function to parse the filepath into a 2d array of strings,
 * stored locally for use searching.
 *
 * @param filepath - the path corresponding to the file to loaded
 * @return the output to be displayed in the REPL History
 */
function runLoadFile(filepath: string): string {
  let output: string;
  currentData = parse(filepath);
  if (currentData == null) {
    output = "Error loading file";
  } else {
    output = "Loaded file: " + filepath;
  }
  console.log(output);
  return output;
}

/**
 * Displays the current CSV file that is loaded locally.
 *
 * @return the output to be displayed in the REPL history
 */
function runView(): string {
  let output: string;
  if (currentData == null) {
    output = "Error loading table: table is null";
  } else {
    output = "Displayed current table";
    removeAllChildren(viewerDiv);
    createTable(currentData);
  }
  console.log(output);
  return output;
}

/**
 * Searches the loaded CSV for a value inputted from the user. Displays the
 * matching rows.
 *
 * @param column - the column the value is contained in
 * @param value - the value that the user is searching for
 * @return the output to be displayed in the REPL history
 */
function runSearch(column: string, value: string): string {
  let output: string;
  if (currentData == null) {
    output = "Error searching: no data has been loaded";
  } else {
    const matchingRows = search(currentData, column, value);
    if (matchingRows.length == 0) {
      output = "No results found";
    } else {
      output = "Displayed results";
      removeAllChildren(viewerDiv);
      createTable(matchingRows);
    }
  }
  console.log(output);
  return output;
}

/**
 *
 * @param command
 * @param output
 * @returns
 */
function addToREPLHistory(command: string, output: string) {
  if (command == null || command == "") {
    console.log("addToREPLHistory failed: command is empty");
    return;
  }

  let hasOutput: boolean;

  if (output == null || output == "") {
    hasOutput = false;
  } else {
    hasOutput = true;
  }

  if (!hasOutput && !isVerbose) return;

  const elementToAdd = document.createElement("p");

  let commandText: string;
  let outputText: string;
  let innerHTMLToAdd: string = "";

  if (isVerbose) {
    commandText = `Command: ${command}`;
    innerHTMLToAdd += commandText;
    if (hasOutput) {
      innerHTMLToAdd += "<br>";
      outputText = `Output: ${output}`;
      innerHTMLToAdd += outputText;
    }
  } else {
    outputText = output;
    innerHTMLToAdd += outputText;
  }
  elementToAdd.innerHTML = innerHTMLToAdd;
  replHistory.appendChild(elementToAdd);

  replHistory.scrollTop = replHistory.scrollHeight;
}

function createTable(data: string[][]) {
  const table = document.createElement("table");
  const tableBody = document.createElement("tbody");

  if (currentData == null) {
    console.log("Current table is null");
  } else {
    for (let row = 0; row < data.length; row++) {
      const tableRow = document.createElement("tr");
      for (let col = 0; col < data[row].length; col++) {
        const cell = document.createElement("td");
        const cellContent = document.createTextNode(data[row][col]);
        cell.appendChild(cellContent);
        tableRow.appendChild(cell);
      }
      tableBody.appendChild(tableRow);
    }
    table.appendChild(tableBody);
    viewerDiv.appendChild(table);
  }
}

function removeAllChildren(parent: HTMLElement) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

export {
  prepareButtonPress,
  prepareREPLHistory,
  prepareTextInput,
  prepareViewerDiv,
  handleButtonPress,
  interpretCommand,
};
