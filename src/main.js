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
var helpMessage = "<p>Program: CSVParser<br>\n\nDescription:\nProvides functionality for a user that desires to explore a CSV file\ncorresponding to a filepath in the current project. Further command description\ncan be found below.<br>\n<br>\nCommands: <br>\n* mode - toggles viewer mode between verbose or brief (default is brief)<br>\n* load_file <filepath> - loads a file from the given filepath<br>\n* view - views the currently loaded file<br>\n* search <column> <value> - searches the currently loaded file for rows with<br>\n  the the given value in the given column<br>\n* help - displays this help message<p>";
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
function handleButtonPress(event) {
    var command = replInputBox.value;
    interpretCommand(command);
}
function interpretCommand(command) {
    if (command === "mode") {
        isVerbose = !isVerbose;
        addToREPLHistory("mode", "");
    }
    else if (command.startsWith("load_file")) {
        //load file command
        var filepath = command.substring(command.indexOf(" ") + 1);
        //this will call externally to a parser -- for now, just have parse fn
        currentData = parse(filepath);
        if (currentData == null) {
            console.log("Error loading file");
            addToREPLHistory(command, "Error loading file");
        }
        else {
            addToREPLHistory(command, "Loaded file: " + filepath);
        }
        //return True or False to determine whether we want to do this
    }
    else if (command === "view") {
        console.log("viewed csv");
        if (currentData == null) {
            console.log("Error loading table: table is null");
            addToREPLHistory(command, "Error loading table: table is null");
        }
        else {
            removeAllChildren(viewerDiv);
            createTable(currentData);
            addToREPLHistory(command, "Displayed current table");
        }
        //create element in viewer
        //displays from parsed json/array
    }
    else if (command.startsWith("search")) {
        var fields = command.substring(command.indexOf(" ") + 1).split(" ");
        console.log(fields);
        if (fields.length != 2) {
            console.log("Error searching: invalid number of arguments");
            addToREPLHistory(command, "Error searching: invalid number of arguments");
        }
        if (currentData == null) {
            console.log("Error searching: no data has been loaded");
            addToREPLHistory(command, "Error searching: no data has been loaded");
        }
        else {
            //handle the case of no matching rows
            var matchingRows = search(currentData, fields[0], fields[1]);
            if (matchingRows.length == 0) {
                console.log("No results found");
                addToREPLHistory(command, "No results found");
            }
            else {
                removeAllChildren(viewerDiv);
                createTable(matchingRows);
            }
        }
        //remember to run this in a successful case of searching
        //removeAllChildren(viewerDiv);
        //display a table of just the corresponding columns (from json/array)
    }
    else if (command.startsWith("help")) {
        addToREPLHistory(command, helpMessage);
    }
    else {
        addToREPLHistory(command, "Error: unrecognized command.<br>\n      <br>\n      See help message below:<br>\n      " + helpMessage);
        console.log("Unrecognized command, help message displayed");
    }
}
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
    //TODO: get this to properly scroll down
    //viewerDiv.scrollIntoView(false);
    var scrollHeight = Math.max(viewerDiv.scrollHeight, viewerDiv.clientHeight);
    viewerDiv.scrollTop = scrollHeight - viewerDiv.clientHeight;
}
function removeAllChildren(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
export { prepareButtonPress, prepareREPLHistory, prepareTextInput, prepareViewerDiv, handleButtonPress, interpretCommand, };
