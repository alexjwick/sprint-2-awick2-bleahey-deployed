//TODO: replace console.log with creating new element in our history box
// The window.onload callback is invoked when the window is first loaded by the browser
window.onload = function () {
    prepareTextInput();
    prepareButtonPress();
    // If you're adding an event for a button click, do something similar.
    // The event name in that case is "click", not "keypress", and the type of the element
    // should be HTMLButtonElement. The handler function for a "click" takes no arguments.
};
var replInputBox;
function prepareTextInput() {
    var maybeInputs = document.getElementsByClassName("repl-command-box");
    var maybeInput = maybeInputs.item(0);
    if (maybeInput == null) {
        console.log("Couldn't find input element");
    }
    else if (!(maybeInput instanceof HTMLInputElement)) {
        console.log("Found element ".concat(maybeInput, ", but it wasn't an input"));
    }
    else if (maybeInput.type != "text") {
        console.log("Found input element ".concat(maybeInput, ", but it wasn't a text input"));
    }
    else {
        replInputBox = maybeInput;
    }
}
function prepareButtonPress() {
    var maybeButtons = document.getElementsByClassName("submit-button");
    var maybeButton = maybeButtons.item(0);
    if (maybeButton == null) {
        console.log("Couldn't find button element");
    }
    else if (!(maybeButton instanceof HTMLButtonElement)) {
        console.log("Found element ".concat(maybeButton, ", but it wasn't a button"));
    }
    else {
        maybeButton.addEventListener("click", handleButtonPress);
    }
}
function handleButtonPress(event) {
    console.log(replInputBox.value);
}
export {};
