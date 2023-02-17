var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/dom";
import * as main from "./main";
/**
 * Resets the DOM before every test
 */
/** The box that the user types text input into. */
var replInputBox;
/** The submit button that causes the inputted command to be interpreted */
var submitButton;
/** A div element that displays the table or rows currently being viewed */
var viewerDiv;
/**
 * The HTML that will be tested in this DOM test suite
 */
var START_HTML = "<div class=\"program\">\n<div class=\"repl\">\n  <div class=\"repl-history\"></div>\n  <div class=\"repl-input\">\n    <input\n      type=\"text\"\n      class=\"repl-command-box\"\n      placeholder=\"Enter command here\"\n    />\n    <button class=\"submit-button\">Submit</button>\n  </div>\n</div>\n<div class=\"viewer\"></div>\n</div>\n<script type=\"module\" src=\"../src/main.js\"></script>";
// Runs before each test
beforeEach(function () {
    document.body.innerHTML = START_HTML;
    findREPLInputBox();
    findSubmitButton();
    findViewer();
    main.reset();
});
/**
 * Finds the REPL input box on the document and assigns it to the corresponding
 * global variable if successful, printing to the console otherwise.
 */
function findREPLInputBox() {
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
 * Finds the submit button on the document and assigns it to the corresponding
 * global variable if successful, printing to the console otherwise.
 */
function findSubmitButton() {
    var maybeButtons = document.getElementsByClassName("submit-button");
    var maybeButton = maybeButtons.item(0);
    if (maybeButton == null) {
        console.log("Couldn't find submit-button element");
    }
    else if (!(maybeButton instanceof HTMLButtonElement)) {
        console.log("Found element ".concat(maybeButton, ", but it wasn't a button"));
    }
    else {
        submitButton = maybeButton;
    }
}
/**
 * Finds the viewer div on the document and assigns it to the corresponding
 * global variable if successful, printing to the console otherwise.
 */
function findViewer() {
    var maybeViewers = document.getElementsByClassName("viewer");
    var maybeViewer = maybeViewers.item(0);
    if (maybeViewer == null) {
        console.log("Couldn't find viewer element");
    }
    else if (!(maybeViewer instanceof HTMLDivElement)) {
        console.log("Found element ".concat(maybeViewer, ", but it wasn't a button"));
    }
    else {
        viewerDiv = maybeViewer;
    }
}
/**
 * A helper function that mimicks a user running a command through the web page.
 *
 * @param command - the command to run
 */
function runCommandAsUser(command) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userEvent.type(replInputBox, command)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, userEvent.click(submitButton)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Tests that the repl input section exists.
 */
test("repl input section exists", function () {
    var replInput = document.getElementsByClassName("repl-input");
    expect(replInput.length).toBe(1);
});
/**
 * Tests that the repl command box exists.
 */
test("repl command box exists", function () {
    var replCommandBox = document.getElementsByClassName("repl-command-box");
    expect(replCommandBox.length).toBe(1);
});
/**
 * Tests that the submit button exists.
 */
test("submit button exists", function () {
    var submitButton = document.getElementsByClassName("submit-button");
    expect(submitButton.length).toBe(1);
});
/**
 * Tests that the repl history exists.
 */
test("repl history exists", function () {
    var replHistory = document.getElementsByClassName("repl-history");
    expect(replHistory.length).toBe(1);
});
/**
 * Tests that the viewer exists.
 */
test("viewer exists", function () {
    var viewer = document.getElementsByClassName("viewer");
    expect(viewer.length).toBe(1);
});
/**
 * Tests changing modes from brief to verbose and back to brief.
 */
test("user input: mode", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect(main.getMode()).toBe("brief");
                return [4 /*yield*/, runCommandAsUser("mode")];
            case 1:
                _a.sent();
                expect(main.getMode()).toBe("verbose");
                return [4 /*yield*/, runCommandAsUser("mode")];
            case 2:
                _a.sent();
                expect(main.getMode()).toBe("brief");
                return [2 /*return*/];
        }
    });
}); });
/**
 * Tests that the load_file command with a valid csv loads the file correctly.
 */
test("user input: load_file w/ valid csv", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect(main.getCurrentData()).toBeNull;
                return [4 /*yield*/, runCommandAsUser("load_file band.csv")];
            case 1:
                _a.sent();
                expect(main.getCurrentData()).toStrictEqual([
                    ["firstname", "lastname", "instrument"],
                    ["Giustina", "Burkle", "electric guitar"],
                    ["Corry", "Marisa", "drums"],
                    ["Benita", "Sikorski", "keyboard"],
                    ["Merrie", "Gunn", "bass guitar"],
                    ["Abbie", "Capello", "electric guitar"],
                ]);
                expect(screen.getAllByText("Loaded file: 'band.csv'").length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Tests the load_file command with an invalid csv.
 */
test("user input: load_file w/ invalid csv", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect(main.getCurrentData()).toBeNull;
                return [4 /*yield*/, runCommandAsUser("load_file invalidfile")];
            case 1:
                _a.sent();
                expect(main.getCurrentData()).toBeNull();
                expect(screen.getAllByText("Error loading file 'invalidfile'").length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Tests the view function in unloaded csv and loaded csv cases.
 */
test("user input: view", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runCommandAsUser("view")];
            case 1:
                _a.sent();
                expect(screen.getAllByText("Error loading table: current data is null").length).toBe(1);
                expect(viewerDiv.childElementCount).toBe(0);
                return [4 /*yield*/, runCommandAsUser("load_file band.csv")];
            case 2:
                _a.sent();
                return [4 /*yield*/, runCommandAsUser("view")];
            case 3:
                _a.sent();
                expect(screen.getAllByText("Displayed current table").length).toBe(1);
                expect(viewerDiv.childElementCount).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Tests search with correct column and value
 */
test("user input: search w/ valid column and value", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runCommandAsUser("load_file band.csv")];
            case 1:
                _a.sent();
                return [4 /*yield*/, runCommandAsUser("search instrument drums")];
            case 2:
                _a.sent();
                expect(screen.getAllByText("Displayed results").length).toBe(1);
                expect(viewerDiv.childElementCount).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Tests search when the column is correct but the value is incorrect.
 * Happy (belated) annoy squidward day.
 */
test("user input: search w/ valid column and invalid value", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runCommandAsUser("load_file band.csv")];
            case 1:
                _a.sent();
                return [4 /*yield*/, runCommandAsUser("search instrument mayonaise")];
            case 2:
                _a.sent();
                expect(screen.getAllByText("No results found").length).toBe(1);
                expect(viewerDiv.childElementCount).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Tests search when the column is incorrect but the value is correct.
 */
test("user input: search w/ invalid column and valid value", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runCommandAsUser("load_file band.csv")];
            case 1:
                _a.sent();
                return [4 /*yield*/, runCommandAsUser("search condiment drums")];
            case 2:
                _a.sent();
                expect(screen.getAllByText("No results found").length).toBe(1);
                expect(viewerDiv.childElementCount).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Tests search when the value and column are incorrect
 */
test("user input: search w/ invalid column and value", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runCommandAsUser("load_file band.csv")];
            case 1:
                _a.sent();
                return [4 /*yield*/, runCommandAsUser("search condiment mayo")];
            case 2:
                _a.sent();
                expect(screen.getAllByText("No results found").length).toBe(1);
                expect(viewerDiv.childElementCount).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Tests search when no CSV data has been loaded yet.
 */
test("user input: search w/ no data loaded yet", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runCommandAsUser("search instrument drums")];
            case 1:
                _a.sent();
                expect(screen.getAllByText("Error searching: no data has been loaded").length).toBe(1);
                expect(viewerDiv.childElementCount).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Test search when no further arguments are passed.
 */
test("user input: search w/ no args", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runCommandAsUser("search")];
            case 1:
                _a.sent();
                expect(screen.getAllByText("Error searching: invalid number of arguments").length).toBe(1);
                expect(viewerDiv.childElementCount).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Tests the search case where only one argument is passed.
 */
test("user input: search w/ too few args", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runCommandAsUser("search yadayada")];
            case 1:
                _a.sent();
                expect(screen.getAllByText("Error searching: invalid number of arguments").length).toBe(1);
                expect(viewerDiv.childElementCount).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Tests the search case where too many arguments are passed as an input.
 */
test("user input: search w/ too many args", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runCommandAsUser("search radda radda radda")];
            case 1:
                _a.sent();
                expect(screen.getAllByText("Error searching: invalid number of arguments").length).toBe(1);
                expect(viewerDiv.childElementCount).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
/**
 * Tests the help message displays a description of all functions.
 */
test("user input: help", function () { return __awaiter(void 0, void 0, void 0, function () {
    var helpMessageString;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runCommandAsUser("help")];
            case 1:
                _a.sent();
                helpMessageString = document
                    .getElementsByTagName("p")[0]
                    .innerHTML.toString();
                expect(helpMessageString.includes("mode")).toBeTruthy();
                expect(helpMessageString.includes("load_file")).toBeTruthy();
                expect(helpMessageString.includes("view")).toBeTruthy();
                expect(helpMessageString.includes("search")).toBeTruthy();
                expect(helpMessageString.includes("help")).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
