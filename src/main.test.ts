import * as main from "./main";

/**
 * Tests the default value of get mode to be brief.
 */
test("get mode default", () => {
  expect(main.getMode()).toBe("brief");
});

/**
 * Tests the runView function in the case where the data has not yet been loaded.
 */
test("empty view", () => {
  expect(main.runView()).toBe("Error loading table: current data is null");
});

/**
 * Tests the search functino in the case where the data has not yet been loaded.
 */
test("empty search", () => {
  expect(main.runSearch("test", "test")).toBe(
    "Error searching: no data has been loaded"
  );
});

/**
 * Tests getting the current data when it has not been loaded.
 */
test("current data null", () => {
  expect(main.getCurrentData()).toBeNull();
});

/**
 * Tests the output messages for correctly or incorrectly loading files
 */
test("run load file", () => {
  expect(main.runLoadFile("bad.csv")).toBe("Error loading file 'bad.csv'");
  expect(main.runLoadFile("band.csv")).toBe("Loaded file: 'band.csv'");
});

/**
 * Tests creating a table from a basic case and blank case (which would be no
 * matches).
 *
 * Since this function is internal, we only have to test these two cases.
 */
test("test create table", () => {
  const baseTable: string[][] = [
    ["test", "test"],
    ["test", "test"],
  ];
  let expectedTableHTML: string =
    "<tbody><tr><td>test</td><td>test</td></tr><tr><td>test</td><td>test</td></tr></tbody>";
  expect(main.createTable(baseTable).innerHTML).toBe(expectedTableHTML);

  const blankTable: string[][] = [[]];
  expectedTableHTML = "<tbody><tr></tr></tbody>";
  expect(main.createTable(blankTable).innerHTML).toBe(expectedTableHTML);
});
