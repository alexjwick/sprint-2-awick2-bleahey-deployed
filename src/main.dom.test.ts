import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/dom";
import * as main from "./main";

/**
 * Resets the DOM before every test
 */
let replInputBox: HTMLInputElement;
let submitButton: HTMLButtonElement;
let viewerDiv: HTMLDivElement;

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
  findREPLInputBox();
  findSubmitButton();
  findViewer();
});

function findREPLInputBox() {
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

function findSubmitButton(): void {
  const maybeButtons: HTMLCollectionOf<Element> =
    document.getElementsByClassName("submit-button");
  const maybeButton: Element | null = maybeButtons.item(0);
  if (maybeButton == null) {
    console.log("Couldn't find submit-button element");
  } else if (!(maybeButton instanceof HTMLButtonElement)) {
    console.log(`Found element ${maybeButton}, but it wasn't a button`);
  } else {
    submitButton = maybeButton;
  }
}

function findViewer(): void {
  const maybeViewers: HTMLCollectionOf<Element> =
    document.getElementsByClassName("viewer");
  const maybeViewer: Element | null = maybeViewers.item(0);
  if (maybeViewer == null) {
    console.log("Couldn't find viewer element");
  } else if (!(maybeViewer instanceof HTMLDivElement)) {
    console.log(`Found element ${maybeViewer}, but it wasn't a button`);
  } else {
    viewerDiv = maybeViewer;
  }
}

async function runCommandAsUser(command: string) {
  await userEvent.type(replInputBox, command);
  await userEvent.click(submitButton);
}

test("repl-input exists", () => {
  let repl_input: HTMLCollectionOf<Element> =
    document.getElementsByClassName("repl-input");
  expect(repl_input.length).toBe(1);
});

test("user input: mode", async () => {
  expect(main.getMode()).toBe("brief");
  await runCommandAsUser("mode");
  expect(main.getMode()).toBe("verbose");
  await runCommandAsUser("mode");
  expect(main.getMode()).toBe("brief");
});

test("user input: load_file w/ valid csv", async () => {
  expect(main.getCurrentData()).toBeNull;
  await runCommandAsUser("load_file band.csv");
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
});

test("user input: load_file w/ invalid csv", async () => {
  expect(main.getCurrentData()).toBeNull;
  await runCommandAsUser("load_file invalidfile");
  expect(main.getCurrentData()).toBeNull();
  expect(screen.getAllByText("Error loading file 'invalidfile'").length).toBe(
    1
  );
  expect(screen.getAllByText("Loaded file: invalidfile").length).toBe(0);
});

test("user input: view", async () => {
  await runCommandAsUser("view");
  expect(screen.getAllByText("Error loading table: table is null").length).toBe(
    1
  );
  expect(screen.getAllByText("Displayed current table").length).toBe(0);
  expect(viewerDiv.childElementCount).toBe(0);
  await runCommandAsUser("load_file band.csv");
  await runCommandAsUser("view");
  expect(screen.getAllByText("Displayed current table").length).toBe(1);
  expect(viewerDiv.childElementCount).toBe(1);
  expect(screen.getAllByText("Error loading table: table is null").length).toBe(
    0
  );
});

test("user input: help", async () => {
  await runCommandAsUser("help");
  expect(screen.getAllByText(main.HELP_MESSAGE).length).toBe(1);
});
