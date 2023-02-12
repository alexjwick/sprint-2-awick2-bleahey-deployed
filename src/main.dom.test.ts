import '@testing-library/dom'
import '@testing-library/jest-dom'

/**
 * Resets the DOM before every test
 */
beforeEach(() => {
    // Set up a mock document containing the skeleton that index.html starts with
    document.body.innerHTML = `
    <div class="repl">
        <div class="repl-history">            
        </div>
        <hr>
        <div class="repl-input">
            <input type="text" class="repl-command-box">
        </div>
    </div>
    `
  })

test('repl-input exists', () => {
    let repl_input : HTMLCollectionOf<Element> = document.getElementsByClassName("repl-input")
    expect(repl_input.length).toBe(1)
})