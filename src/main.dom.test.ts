import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/dom";
import * as main from "./main";

/**
 * Resets the DOM before every test
 */

/** The box that the user types text input into. */
let replInputBox: HTMLInputElement;
/** The submit button that causes the inputted command to be interpreted */
let submitButton: HTMLButtonElement;
/** A div element that displays the table or rows currently being viewed */
let viewerDiv: HTMLDivElement;

/**
 * The HTML that will be tested in this DOM test suite
 */
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

// Runs before each test
beforeEach(() => {
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

/**
 * Finds the submit button on the document and assigns it to the corresponding
 * global variable if successful, printing to the console otherwise.
 */
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

/**
 * Finds the viewer div on the document and assigns it to the corresponding
 * global variable if successful, printing to the console otherwise.
 */
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

/**
 * A helper function that mimicks a user running a command through the web page.
 *
 * @param command - the command to run
 */
async function runCommandAsUser(command: string) {
  await userEvent.type(replInputBox, command);
  await userEvent.click(submitButton);
}

/**
 * Tests that the repl input section exists.
 */
test("repl input section exists", () => {
  let replInput: HTMLCollectionOf<Element> =
    document.getElementsByClassName("repl-input");
  expect(replInput.length).toBe(1);
});

/**
 * Tests that the repl command box exists.
 */
test("repl command box exists", () => {
  let replCommandBox: HTMLCollectionOf<Element> =
    document.getElementsByClassName("repl-command-box");
  expect(replCommandBox.length).toBe(1);
});

/**
 * Tests that the submit button exists.
 */
test("submit button exists", () => {
  let submitButton: HTMLCollectionOf<Element> =
    document.getElementsByClassName("submit-button");
  expect(submitButton.length).toBe(1);
});

/**
 * Tests that the repl history exists.
 */
test("repl history exists", () => {
  let replHistory: HTMLCollectionOf<Element> =
    document.getElementsByClassName("repl-history");
  expect(replHistory.length).toBe(1);
});

/**
 * Tests that the viewer exists.
 */
test("viewer exists", () => {
  let viewer: HTMLCollectionOf<Element> =
    document.getElementsByClassName("viewer");
  expect(viewer.length).toBe(1);
});

/**
 * Tests changing modes from brief to verbose and back to brief.
 */
test("user input: mode", async () => {
  expect(main.getMode()).toBe("brief");
  await runCommandAsUser("mode");
  expect(main.getMode()).toBe("verbose");
  await runCommandAsUser("mode");
  expect(main.getMode()).toBe("brief");
});

/**
 * Tests that the load_file command with a valid csv loads the file correctly.
 */
test("user input: load_file w/ valid csv", async () => {
  expect(main.getCurrentData()).toBeNull;
  await runCommandAsUser("load_file band.csv");
  expect(main.getCurrentData()).toStrictEqual([
    ["firstname", "lastname", "instrument"],
    ["Giustina", "Burkle", "electric guitar"],
    ["Corry", "Marisa", "drums"],
    ["Benita", "Sikorski", "keyboard"],
    ["Merrie", "Gunn", "bass guitar"],
    ["Abbie", "Capello", "electric guitar"],
  ]);
  expect(screen.getAllByText("Loaded file: 'band.csv'").length).toBe(1);
});

/**
 * Tests the load_file command with an invalid csv.
 */
test("user input: load_file w/ invalid csv", async () => {
  expect(main.getCurrentData()).toBeNull;
  await runCommandAsUser("load_file invalidfile");
  expect(main.getCurrentData()).toBeNull();
  expect(screen.getAllByText("Error loading file 'invalidfile'").length).toBe(
    1
  );
});

/**
 * Tests the view function in unloaded csv and loaded csv cases.
 */
test("user input: view", async () => {
  await runCommandAsUser("view");
  expect(
    screen.getAllByText("Error loading table: current data is null").length
  ).toBe(1);
  expect(viewerDiv.childElementCount).toBe(0);
  await runCommandAsUser("load_file band.csv");
  await runCommandAsUser("view");
  expect(screen.getAllByText("Displayed current table").length).toBe(1);
  expect(viewerDiv.childElementCount).toBe(1);
});

/**
 * Tests search with correct column and value
 */
test("user input: search w/ valid column and value", async () => {
  await runCommandAsUser("load_file band.csv");
  await runCommandAsUser("search instrument drums");
  expect(screen.getAllByText("Displayed results").length).toBe(1);
  expect(viewerDiv.childElementCount).toBe(1);
});

/**
 * Tests search when the column is correct but the value is incorrect.
 * Happy (belated) annoy squidward day.
 */
test("user input: search w/ valid column and invalid value", async () => {
  await runCommandAsUser("load_file band.csv");
  await runCommandAsUser("search instrument mayonaise");
  expect(screen.getAllByText("No results found").length).toBe(1);
  expect(viewerDiv.childElementCount).toBe(0);
});

/**
 * Tests search when the column is incorrect but the value is correct.
 */
test("user input: search w/ invalid column and valid value", async () => {
  await runCommandAsUser("load_file band.csv");
  await runCommandAsUser("search condiment drums");
  expect(screen.getAllByText("No results found").length).toBe(1);
  expect(viewerDiv.childElementCount).toBe(0);
});

/**
 * Tests search when the value and column are incorrect
 */
test("user input: search w/ invalid column and value", async () => {
  await runCommandAsUser("load_file band.csv");
  await runCommandAsUser("search condiment mayo");
  expect(screen.getAllByText("No results found").length).toBe(1);
  expect(viewerDiv.childElementCount).toBe(0);
});

/**
 * Tests search when no CSV data has been loaded yet.
 */
test("user input: search w/ no data loaded yet", async () => {
  await runCommandAsUser("search instrument drums");
  expect(
    screen.getAllByText("Error searching: no data has been loaded").length
  ).toBe(1);
  expect(viewerDiv.childElementCount).toBe(0);
});

/**
 * Test search when no further arguments are passed.
 */
test("user input: search w/ no args", async () => {
  await runCommandAsUser("search");
  expect(
    screen.getAllByText("Error searching: invalid number of arguments").length
  ).toBe(1);
  expect(viewerDiv.childElementCount).toBe(0);
});

/**
 * Tests the search case where only one argument is passed.
 */
test("user input: search w/ too few args", async () => {
  await runCommandAsUser("search yadayada");
  expect(
    screen.getAllByText("Error searching: invalid number of arguments").length
  ).toBe(1);
  expect(viewerDiv.childElementCount).toBe(0);
});

/**
 * Tests the search case where too many arguments are passed as an input.
 */
test("user input: search w/ too many args", async () => {
  await runCommandAsUser("search radda radda radda");
  expect(
    screen.getAllByText("Error searching: invalid number of arguments").length
  ).toBe(1);
  expect(viewerDiv.childElementCount).toBe(0);
});

/**
 * Tests the help message displays a description of all functions.
 */
test("user input: help", async () => {
  await runCommandAsUser("help");
  const helpMessageString: string = document
    .getElementsByTagName("p")[0]
    .innerHTML.toString();
  expect(helpMessageString.includes("mode")).toBeTruthy();
  expect(helpMessageString.includes("load_file")).toBeTruthy();
  expect(helpMessageString.includes("view")).toBeTruthy();
  expect(helpMessageString.includes("search")).toBeTruthy();
  expect(helpMessageString.includes("help")).toBeTruthy();
});
