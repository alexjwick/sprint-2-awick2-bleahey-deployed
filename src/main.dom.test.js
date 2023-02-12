import '@testing-library/dom';
import '@testing-library/jest-dom';
/**
 * Resets the DOM before every test
 */
beforeEach(function () {
    // Set up a mock document containing the skeleton that index.html starts with
    document.body.innerHTML = "\n    <div class=\"repl\">\n        <div class=\"repl-history\">            \n        </div>\n        <hr>\n        <div class=\"repl-input\">\n            <input type=\"text\" class=\"repl-command-box\">\n        </div>\n    </div>\n    ";
});
test('repl-input exists', function () {
    var repl_input = document.getElementsByClassName("repl-input");
    expect(repl_input.length).toBe(1);
});
