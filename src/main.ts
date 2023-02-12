//TODO: replace console.log with creating new element in our history box

// The window.onload callback is invoked when the window is first loaded by the browser
window.onload = () => {
  prepareTextInput();
  prepareButtonPress();

  // If you're adding an event for a button click, do something similar.
  // The event name in that case is "click", not "keypress", and the type of the element
  // should be HTMLButtonElement. The handler function for a "click" takes no arguments.
};

let replInputBox: HTMLInputElement;

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

function handleButtonPress(event: MouseEvent) {
  //TODO: change this to create/append a text element with this value
  console.log(replInputBox.value);

  //TODO: handle the command based on this text accordingly
}

export {};
