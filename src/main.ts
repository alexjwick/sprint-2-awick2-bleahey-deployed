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

const helpMessage = `<p>Program: CSVParser<br>

Description:
Provides functionality for a user that desires to explore a CSV file
corresponding to a filepath in the current project. Further command description
can be found below.<br>
<br>
Commands: <br>
* mode - toggles viewer mode between verbose or brief (default is brief)<br>
* load_file <filepath> - loads a file from the given filepath<br>
* view - views the currently loaded file<br>
* search <column> <value> - searches the currently loaded file for rows with<br>
  the the given value in the given column<br>
* help - displays this help message<p>`;

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

function handleButtonPress(event: MouseEvent) {
  const command: string = replInputBox.value;
  interpretCommand(command);
}

function interpretCommand(command: string) {
  if (command === "mode") {
    isVerbose = !isVerbose;
    addToREPLHistory("mode", "");
  } else if (command.startsWith("load_file")) {
    //load file command
    const filepath = command.substring(command.indexOf(" ") + 1);
    //this will call externally to a parser -- for now, just have parse fn
    currentData = parse(filepath);
    if (currentData == null) {
      console.log("Error loading file");
      addToREPLHistory(command, "Error loading file");
    } else {
      addToREPLHistory(command, "Loaded file: " + filepath);
    }
    //return True or False to determine whether we want to do this
  } else if (command === "view") {
    console.log("viewed csv");
    if (currentData == null) {
      console.log("Error loading table: table is null");
      addToREPLHistory(command, "Error loading table: table is null");
    } else {
      removeAllChildren(viewerDiv);
      createTable(currentData);
      addToREPLHistory(command, "Displayed current table");
    }
    //create element in viewer
    //displays from parsed json/array
  } else if (command.startsWith("search")) {
    const fields = command.substring(command.indexOf(" ") + 1).split(" ");
    console.log(fields);
    if (fields.length != 2) {
      console.log("Error searching: invalid number of arguments");
      addToREPLHistory(command, "Error searching: invalid number of arguments");
    }
    if (currentData == null) {
      console.log("Error searching: no data has been loaded");
      addToREPLHistory(command, "Error searching: no data has been loaded");
    } else {
      //handle the case of no matching rows
      const matchingRows = search(currentData, fields[0], fields[1]);
      if (matchingRows.length == 0) {
        console.log("No results found");
        addToREPLHistory(command, "No results found");
      } else {
        removeAllChildren(viewerDiv);
        createTable(matchingRows);
      }
    }
    //remember to run this in a successful case of searching
    //removeAllChildren(viewerDiv);
    //display a table of just the corresponding columns (from json/array)
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

  //TODO: get this to properly scroll down
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
