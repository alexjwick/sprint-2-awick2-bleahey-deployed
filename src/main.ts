import { parse } from "./mock-backend/CSVParser.js";
import { search } from "./mock-backend/CSVSearcher.js";

// The window.onload callback is invoked when the window is first loaded by the browser
window.onload = () => {
  reset();
};

/** The box that the user types text input into. */
let replInputBox: HTMLInputElement;
/** A div element that displays the previous results of commands being run. */
let replHistory: HTMLDivElement;
/** A div element that displays the table or rows currently being viewed */
let viewerDiv: HTMLDivElement;
/** A boolean for whether the history mode is verbose or brief. */
let isVerbose: boolean = false;
/** A 2d array of the currently loaded data from the CSV. */
let currentData: string[][] | null;

/** The help message to be displayed with the proper command */
const HELP_MESSAGE = `Program: CSVParser
<br>
<br>
Description:
<br>
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
function prepareTextInput(): void {
  const maybeInputs: HTMLCollectionOf<Element> =
    document.getElementsByClassName("repl-command-box");
  const maybeInput: Element | null = maybeInputs.item(0);
  if (maybeInput == null) {
    console.log("Couldn't find repl-command-box element");
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
function prepareButtonPress(): void {
  const maybeButtons: HTMLCollectionOf<Element> =
    document.getElementsByClassName("submit-button");
  const maybeButton: Element | null = maybeButtons.item(0);
  if (maybeButton == null) {
    console.log("Couldn't find submit-button element");
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
function prepareREPLHistory(): void {
  const maybeDivs: HTMLCollectionOf<Element> =
    document.getElementsByClassName("repl-history");
  const maybeDiv: Element | null = maybeDivs.item(0);
  if (maybeDiv == null) {
    console.log("Couldn't find reply-history element");
  } else if (!(maybeDiv instanceof HTMLDivElement)) {
    console.log(`Found element ${maybeDiv}, but it wasn't a div`);
  } else {
    replHistory = maybeDiv;
  }
}

/**
 * Prepare the Viewer div for displaying view or search outputs.
 */
function prepareViewerDiv(): void {
  const maybeDivs: HTMLCollectionOf<Element> =
    document.getElementsByClassName("viewer");
  const maybeDiv: Element | null = maybeDivs.item(0);
  if (maybeDiv == null) {
    console.log("Couldn't find viewer element");
  } else if (!(maybeDiv instanceof HTMLDivElement)) {
    console.log(`Found element ${maybeDiv}, but it wasn't a div`);
  } else {
    viewerDiv = maybeDiv;
  }
}

/**
 * When the button is clicked, passes the current value typed into the input
 * box to the command interpeter function.
 */
function handleButtonPress(): void {
  const command: string = replInputBox.value;
  replInputBox.value = "";
  if (command != "") {
    interpretCommand(command);
  }
}

/**
 * Returns the current mode as a string.
 *
 * @return the current mode the program is in
 */
function getMode(): string {
  if (isVerbose) {
    return "verbose";
  }
  return "brief";
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
function interpretCommand(command: string): void {
  if (command === "mode") {
    isVerbose = !isVerbose;
    addToREPLHistory("mode", `Mode changed to ${getMode()}`);
  } else if (command.startsWith("load_file")) {
    const filepath: string = command.substring(command.indexOf(" ") + 1);
    addToREPLHistory(command, runLoadFile(filepath));
  } else if (command === "view") {
    addToREPLHistory(command, runView());
  } else if (command.startsWith("search")) {
    const fields: string[] = command
      .substring(command.indexOf(" ") + 1)
      .split(" ");
    if (fields.length != 2) {
      console.log("Error searching: invalid number of arguments");
      addToREPLHistory(command, "Error searching: invalid number of arguments");
    } else {
      addToREPLHistory(command, runSearch(fields[0], fields[1]));
    }
  } else if (command.startsWith("help")) {
    addToREPLHistory(command, HELP_MESSAGE);
  } else {
    addToREPLHistory(
      command,
      `Unrecognized command: ${command}
      <br>
      Enter "help" for more information`
    );
    console.log(`Unrecognized command: ${command}`);
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
    output = `Error loading file '${filepath}'`;
  } else {
    output = `Loaded file: '${filepath}'`;
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
    output = "Error loading table: current data is null";
  } else {
    output = "Displayed current table";
    removeAllChildren(viewerDiv);
    const table = createTable(currentData);
    viewerDiv.appendChild(table);
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
      const table = createTable(matchingRows);
      viewerDiv.appendChild(table);
    }
  }
  console.log(output);
  return output;
}

/**
 * Adds the given command and output to the REPL history. Formats the output to
 * the REPL history based on the mode, which can be brief or verbose and is
 * stored in the global boolean variable isVerbose.
 *
 * @param command - the command to be added to the REPL history
 * @param output - the output of the command to be added to the REPL history
 */
function addToREPLHistory(command: string, output: string): void {
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

  const elementToAdd: HTMLParagraphElement = document.createElement("p");

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

/**
 * Creates an html table from a 2d array of strings.$
 *
 * @param data - A 2d array of strings that the table should represent
 * @return the table created
 */
function createTable(data: string[][]): HTMLTableElement {
  const table: HTMLTableElement = document.createElement("table");
  const tableBody: HTMLTableSectionElement = document.createElement("tbody");

  for (let row = 0; row < data.length; row++) {
    const tableRow: HTMLTableRowElement = document.createElement("tr");
    for (let col = 0; col < data[row].length; col++) {
      const cell: HTMLTableCellElement = document.createElement("td");
      const cellContent: Text = document.createTextNode(data[row][col]);
      cell.appendChild(cellContent);
      tableRow.appendChild(cell);
    }
    tableBody.appendChild(tableRow);
  }
  table.appendChild(tableBody);
  return table;
}

/**
 * Removes all child nodes from the given element.
 *
 * @param parent - the html element whose children should be removed
 */
function removeAllChildren(parent: HTMLElement): void {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function getCurrentData(): string[][] | null {
  if (currentData == null) {
    return null;
  }
  let currentDataCopy: string[][] = currentData;
  return currentDataCopy;
}

/**
 * Resets current data and mode
 */
function reset(): void {
  currentData = null;
  isVerbose = false;
  prepareTextInput();
  prepareButtonPress();
  prepareREPLHistory();
  prepareViewerDiv();
}

/**
 * Export the functions required by the window to run the program.
 */
export {
  prepareButtonPress,
  prepareREPLHistory,
  prepareTextInput,
  prepareViewerDiv,
  handleButtonPress,
  interpretCommand,
  getMode,
  reset,
  runView,
  runSearch,
  getCurrentData,
  runLoadFile,
  createTable,
};
