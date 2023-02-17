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
var replInputBox;
var submitButton;
var viewerDiv;
var START_HTML = "<div class=\"program\">\n<div class=\"repl\">\n  <div class=\"repl-history\"></div>\n  <div class=\"repl-input\">\n    <input\n      type=\"text\"\n      class=\"repl-command-box\"\n      placeholder=\"Enter command here\"\n    />\n    <button class=\"submit-button\">Submit</button>\n  </div>\n</div>\n<div class=\"viewer\"></div>\n</div>\n<script type=\"module\" src=\"../src/main.js\"></script>";
beforeEach(function () {
    main.reset();
    document.body.innerHTML = START_HTML;
    findREPLInputBox();
    findSubmitButton();
});
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
test("repl-input exists", function () {
    var repl_input = document.getElementsByClassName("repl-input");
    expect(repl_input.length).toBe(1);
});
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
test("user input: load_file w/ valid csv", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                expect(main.getCurrentData()).toBeNull;
                return [4 /*yield*/, runCommandAsUser("load_file band.csv")];
            case 1:
                _a.sent();
                expect(main.getCurrentData()).toBe([
                    ["firstname", "lastname", "instrument"],
                    ["Giustina", "Burkle", "electric guitar"],
                    ["Corry", "Marisa", "drums"],
                    ["Benita", "Sikorski", "keyboard"],
                    ["Merrie", "Gunn", "bass guitar"],
                    ["Abbie", "Capello", "electric guitar"],
                ]);
                expect(screen.getAllByText("Loaded file: band.csv").length).toBe(1);
                expect(screen.getAllByText("Error loading file 'band.csv'").length).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
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
                expect(screen.getAllByText("Loaded file: invalidfile").length).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
test("user input: view", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runCommandAsUser("view")];
            case 1:
                _a.sent();
                expect(screen.getAllByText("Error loading table: table is null").length).toBe(1);
                expect(screen.getAllByText("Displayed current table").length).toBe(0);
                expect(viewerDiv.childElementCount).toBe(0);
                return [4 /*yield*/, runCommandAsUser("load_file band.csv")];
            case 2:
                _a.sent();
                return [4 /*yield*/, runCommandAsUser("view")];
            case 3:
                _a.sent();
                expect(screen.getAllByText("Displayed current table").length).toBe(1);
                expect(viewerDiv.childElementCount).toBe(1);
                expect(screen.getAllByText("Error loading table: table is null").length).toBe(0);
                return [2 /*return*/];
        }
    });
}); });
test("user input: help", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, runCommandAsUser("help")];
            case 1:
                _a.sent();
                expect(screen.getAllByText(main.HELP_MESSAGE).length).toBe(1);
                return [2 /*return*/];
        }
    });
}); });
