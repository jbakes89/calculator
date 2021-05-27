# Calculator

Author: Joseph Bakes (22nd May, 2021)

## Description

A calculator webpage as part of The Odin Project Foundations course.

### Things I've learned/practised:
- How to use unicode symbols in HTML and Javascript
- This is the first time I've actually used a `grid` display
- Learned how to adapt text size/length to available width (using `window.getComputedStyle()`)
- Handling large numbers in Javascript
- Handling keyboard input

### Things to add/improve:
- Visual feedback for keyboard presses that mimics the `active` state of the buttons during mouse clicks.
    - I tried doing this by toggling a pseudo-class on `keydown` and `keyup` with the same style as `:active`. The only problem with this was a bug when holding down a keyboard key and clicking the mouse anywhere on the screen at the same time, which seemed to lock the button in an `active` state. I guess this is because holding the key down kept the button going in-and-out of `focus`, so when the mouse was clicked, it was possible to trigger the `mousedown` event but miss the `mouseup` event.
- Dark mode
- More calculator-like font for nostaliga(?)