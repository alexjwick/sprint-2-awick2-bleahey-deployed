import "@testing-library/dom";
import "@testing-library/jest-dom";
// all exports from main will now be available as main.X
import * as main from "./main";
test("is 1 + 1 = 2?", function () {
    expect(1 + 1).toBe(2);
});
// Notice: we're testing the keypress handler's effect on state and /nothing else/
// We're not actually pressing keys!
// We're not looking at what the console produces!
test("handleKeypress counting", function () {
    main.handleKeypress(new KeyboardEvent("keypress", { key: "x" }));
    expect(main.getPressCount()).toBe(1);
    main.handleKeypress(new KeyboardEvent("keypress", { key: "y" }));
    expect(main.getPressCount()).toBe(2);
});
