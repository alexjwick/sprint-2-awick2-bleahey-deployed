import "@testing-library/jest-dom";
import * as main from "./main";
/**
 * Resets the DOM before every test
 */
var replInputBox;
var START_HTML = "<div class=\"program\">\n<div class=\"repl\">\n  <div class=\"repl-history\"></div>\n  <div class=\"repl-input\">\n    <input\n      type=\"text\"\n      class=\"repl-command-box\"\n      placeholder=\"Enter command here\"\n    />\n    <button class=\"submit-button\">Submit</button>\n  </div>\n</div>\n<div class=\"viewer\"></div>\n</div>\n<script type=\"module\" src=\"../src/main.js\"></script>";
beforeEach(function () {
    main.clearHistory();
    document.body.innerHTML = START_HTML;
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
});
test("repl-input exists", function () {
    var repl_input = document.getElementsByClassName("repl-input");
    expect(repl_input.length).toBe(1);
});
test("change mode", function () {
    expect(main.getMode()).toBe("brief");
    main.interpretCommand("mode");
    expect(main.getMode()).toBe("verbose");
});
