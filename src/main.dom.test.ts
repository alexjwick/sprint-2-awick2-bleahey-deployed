import "@testing-library/jest-dom";
import * as main from "./main";
/**
 * Resets the DOM before every test
 */
let replInputBox: HTMLInputElement;

const START_HTML: string = `<div class="program">
<div class="repl">
  <div class="repl-history"></div>
  <div class="repl-input">
    <input
      type="text"
      class="repl-command-box"
      placeholder="Enter command here"
    />
    <button class="submit-button">Submit</button>
  </div>
</div>
<div class="viewer"></div>
</div>
<script type="module" src="../src/main.js"></script>`;

beforeEach(() => {
  main.reset();
  document.body.innerHTML = START_HTML;
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
});

test("repl-input exists", () => {
  let repl_input: HTMLCollectionOf<Element> =
    document.getElementsByClassName("repl-input");
  expect(repl_input.length).toBe(1);
});

test("change mode", () => {
  expect(main.getMode()).toBe("brief");
  main.interpretCommand("mode");
  expect(main.getMode()).toBe("verbose");
});
