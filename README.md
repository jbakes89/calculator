# Calculator

Author: Joseph Bakes (22nd May, 2021)

## Description

A calculator webpage as part of The Odin Project Foundations course.

### Things I've learned/practised:
- How to use unicode symbols in HTML and Javascript
- This is the first time I've actually used a `grid` display
- Learned how to adapt text size/length to available width (using `window.getComputedStyle()`)
- [Will soon learn about] handling large numbers in Javascript
- Learned/practised how to handle keyboard input

### Things to add/improve:
- Visual feedback for keyboard presses that mimics the `active` state of the buttons during mouse clicks.
    - I tried doing this by toggling a pseudo-class on `keydown` and `keyup` with the same style as `:active`. The only problem with this was a bug when holding down a keyboard key and clicking the mouse anywhere on the screen at the same time, which seemed to lock the button in an `active` state. I guess this is because holding the key down kept the button going in-and-out of `focus`, so when the mouse was clicked, it was possible to trigger the `mousedown` event but miss the `mouseup` event.

## "Patch notes" (26th May, 2021)
- Reworked representation of currently displayed value to fix bugs relating to decimal points and backspace function.
    - Typing n.0 no longer causes issues.
    - Deleting the last digit on the display no longer results in "NaN" being shown.
    - Hanging decimal points can now be deleted.
    - The first digit after the decimal point can now be deleted with deleting the decimal point itself.
- Fixed bug of mouse clicks on buttons interfering with keyboard input by removing focus after clicks.
- Fixed display overflow handling to only show exponential format when the integer part was too large for the display (learned that `toPrecision()` does this automatically)
- Stopped backspace functioning on the results of calculations.
- Added an error message for dividing by zero.
- Added a plus/minus (toggle sign) button.

## TODO (updated 26th May, 2021)
- Add an "ongoing calculation" span at the top of display to show pendingValue and pendingOperator.
- Handle `Infinity` (`> Number.MAX_VALUE`)
- Improve appearance
- Add a hidden button to rotate the calculator(?)