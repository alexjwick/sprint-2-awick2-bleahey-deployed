import * as main from "./main";
/*
test("is 1 + 1 = 2?", () => {
  expect(1 + 1).toBe(2);
});

// Notice: we're testing the keypress handler's effect on state and /nothing else/
// We're not actually pressing keys!
// We're not looking at what the console produces!
test("handleKeypress counting", () => {
  main.handleKeypress(new KeyboardEvent("keypress", { key: "x" }));
  expect(main.getPressCount()).toBe(1);
  main.handleKeypress(new KeyboardEvent("keypress", { key: "y" }));
  expect(main.getPressCount()).toBe(2);
});
*/

test("get mode", () => {
  expect(main.getMode()).toBe("brief");
});

test("empty view", () => {
  expect(main.runView()).toBe("Error loading table: current data is null");
});

test("empty search", () => {
  expect(main.runSearch("test", "test")).toBe(
    "Error searching: no data has been loaded"
  );
});

//test("test create table", () => {});
