//TODO: replace console.log with creating new element in our history box

// The window.onload callback is invoked when the window is first loaded by the browser
window.onload = () => {
  prepareTextInput();
  prepareButtonPress();
  prepareREPLHistory();

  // If you're adding an event for a button click, do something similar.
  // The event name in that case is "click", not "keypress", and the type of the element
  // should be HTMLButtonElement. The handler function for a "click" takes no arguments.
};

let replInputBox: HTMLInputElement;
let replHistory: HTMLDivElement;
let isVerbose: boolean = false;

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
    console.log("Couldn't find button element");
  } else if (!(maybeDiv instanceof HTMLDivElement)) {
    console.log(`Found element ${maybeDiv}, but it wasn't a button`);
  } else {
    replHistory = maybeDiv;
  }
}

function handleButtonPress(event: MouseEvent) {
  //TODO: change this to create/append a text element with this value
  const command: string = replInputBox.value;
  interpretCommand(command);
}

function interpretCommand(command: string) {
  if (command === "mode") {
    isVerbose = !isVerbose;
    addToREPLHistory("mode", "");
  } else if (command.startsWith("loadfile")) {
    addToREPLHistory("loadfile", "file loaded");
    //load file command
    //this will call externally to a parser
  } else if (command === "view") {
    console.log("viewed csv");
    //create element in viewer
    //displays from parsed json/array
  } else if (command.startsWith("search")) {
    console.log("searching for x and y ...");
    //display a table of just the corresponding columns (from json/array)
  } else {
    //help case, print list of possible commands
    console.log("help:");
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

  const newElement = document.createElement("p");

  let commandText: string;
  let outputText: string;
  let commandTextNode;
  let outputTextNode;

  if (isVerbose) {
    commandText = `Command: ${command}`;
    commandTextNode = document.createTextNode(commandText);
    newElement.appendChild(commandTextNode);
    if (hasOutput) {
      newElement.appendChild(document.createElement("br"));
      outputText = `Output: ${output}`;
      outputTextNode = document.createTextNode(outputText);
      newElement.appendChild(outputTextNode);
    }
  } else {
    outputText = output;
    outputTextNode = document.createTextNode(outputText);
    newElement.appendChild(outputTextNode);
  }

  replHistory.appendChild(newElement);
}

export {
  prepareButtonPress,
  prepareREPLHistory,
  prepareTextInput,
  handleButtonPress,
};

/**
 * Commands:
 * mode m
 * load_file
 * view
 * search
 * (help) - function is automatically thrown if there is an unknown command
 */
