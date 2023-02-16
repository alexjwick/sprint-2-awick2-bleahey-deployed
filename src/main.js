import { parse } from "./mock-backend/CSVParser.js";
import { search } from "./mock-backend/CSVSearcher.js";
// The window.onload callback is invoked when the window is first loaded by the browser
window.onload = function () {
    prepareTextInput();
    prepareButtonPress();
    prepareREPLHistory();
    prepareViewerDiv();
    // If you're adding an event for a button click, do something similar.
    // The event name in that case is "click", not "keypress", and the type of the element
    // should be HTMLButtonElement. The handler function for a "click" takes no arguments.
};
var replInputBox;
var replHistory;
var viewerDiv;
var isVerbose = false;
var currentData;
var helpMessage = "Program: CSVParser\n<br>\n<br>\nDescription:\nProvides functionality for a user that desires to explore a CSV file\ncorresponding to a filepath in the current project. Further command description\ncan be found below.\n<br>\n<br>\nCommands:\n<br>\n* mode - toggles viewer mode between verbose or brief (default is brief)\n<br>\n* load_file &lt;filepath&gt; - loads a file from the given filepath\n<br>\n* view - views the currently loaded file\n<br>\n* search &lt;column&gt; &lt;value&gt; - searches the currently loaded file for rows with the the given value in the given column\n<br>\n* help - displays this help message";
/**
 * Prepares the components of the command box for receiving text input.
 */
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
/**
 * Prepares the submit button for handling clicks from the user.
 */
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
/**
 * Prepares the history div for displaying the previous commands and output
 * from the user.
 */
function prepareREPLHistory() {
    var maybeDivs = document.getElementsByClassName("repl-history");
    var maybeDiv = maybeDivs.item(0);
    if (maybeDiv == null) {
        console.log("Couldn't find div element");
    }
    else if (!(maybeDiv instanceof HTMLDivElement)) {
        console.log("Found element ".concat(maybeDiv, ", but it wasn't a div"));
    }
    else {
        replHistory = maybeDiv;
    }
}
/**
 * Prepare the Viewer div for displaying view or search outputs.
 */
function prepareViewerDiv() {
    var maybeDivs = document.getElementsByClassName("viewer");
    var maybeDiv = maybeDivs.item(0);
    if (maybeDiv == null) {
        console.log("Couldn't find div element");
    }
    else if (!(maybeDiv instanceof HTMLDivElement)) {
        console.log("Found element ".concat(maybeDiv, ", but it wasn't a div"));
    }
    else {
        viewerDiv = maybeDiv;
    }
}
/**
 * Accepts a MouseEvent when the button is clicked and passes the current
 * value typed into the input box to the command interpeter function.
 *
 * @param MouseEvent - an event such as a button click
 */
function handleButtonPress(event) {
    var command = replInputBox.value;
    replInputBox.value = "";
    interpretCommand(command);
}
function getMode() {
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
function interpretCommand(command) {
    if (command === "mode") {
        isVerbose = !isVerbose;
        addToREPLHistory("mode", "Mode changed to " + getMode());
    }
    else if (command.startsWith("load_file")) {
        var filepath = command.substring(command.indexOf(" ") + 1);
        addToREPLHistory(command, runLoadFile(filepath));
    }
    else if (command === "view") {
        addToREPLHistory(command, runView());
    }
    else if (command.startsWith("search")) {
        var fields = command.substring(command.indexOf(" ") + 1).split(" ");
        if (fields.length != 2) {
            console.log("Error searching: invalid number of arguments");
            addToREPLHistory(command, "Error searching: invalid number of arguments");
        }
        else {
            addToREPLHistory(command, runSearch(fields[0], fields[1]));
        }
    }
    else if (command.startsWith("help")) {
        addToREPLHistory(command, helpMessage);
    }
    else {
        addToREPLHistory(command, "Error: unrecognized command.<br>\n      <br>\n      See help message below:<br>\n      " + helpMessage);
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
function runLoadFile(filepath) {
    var output;
    currentData = parse(filepath);
    if (currentData == null) {
        output = "Error loading file";
    }
    else {
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
function runView() {
    var output;
    if (currentData == null) {
        output = "Error loading table: table is null";
    }
    else {
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
function runSearch(column, value) {
    var output;
    if (currentData == null) {
        output = "Error searching: no data has been loaded";
    }
    else {
        var matchingRows = search(currentData, column, value);
        if (matchingRows.length == 0) {
            output = "No results found";
        }
        else {
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
function addToREPLHistory(command, output) {
    if (command == null || command == "") {
        console.log("addToREPLHistory failed: command is empty");
        return;
    }
    var hasOutput;
    if (output == null || output == "") {
        hasOutput = false;
    }
    else {
        hasOutput = true;
    }
    if (!hasOutput && !isVerbose)
        return;
    var elementToAdd = document.createElement("p");
    var commandText;
    var outputText;
    var innerHTMLToAdd = "";
    if (isVerbose) {
        commandText = "Command: ".concat(command);
        innerHTMLToAdd += commandText;
        if (hasOutput) {
            innerHTMLToAdd += "<br>";
            outputText = "Output: ".concat(output);
            innerHTMLToAdd += outputText;
        }
    }
    else {
        outputText = output;
        innerHTMLToAdd += outputText;
    }
    elementToAdd.innerHTML = innerHTMLToAdd;
    replHistory.appendChild(elementToAdd);
    replHistory.scrollTop = replHistory.scrollHeight;
}
function createTable(data) {
    var table = document.createElement("table");
    var tableBody = document.createElement("tbody");
    if (currentData == null) {
        console.log("Current table is null");
    }
    else {
        for (var row = 0; row < data.length; row++) {
            var tableRow = document.createElement("tr");
            for (var col = 0; col < data[row].length; col++) {
                var cell = document.createElement("td");
                var cellContent = document.createTextNode(data[row][col]);
                cell.appendChild(cellContent);
                tableRow.appendChild(cell);
            }
            tableBody.appendChild(tableRow);
        }
        table.appendChild(tableBody);
        viewerDiv.appendChild(table);
    }
}
function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
export { prepareButtonPress, prepareREPLHistory, prepareTextInput, prepareViewerDiv, handleButtonPress, interpretCommand, };
