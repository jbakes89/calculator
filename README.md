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


## TODO (updated 25th May, 2021)
- Rework decimal point function
    - Typing *n*.0 results in the 0 and decimal point being deleted.
    - Also see problems with backspace function (below), since these are interrelated.
- Rework backspace function (or display value function) to handle unintended interactions, e.g.
    - Deleting the last digit on the display results in "NaN".
    - Pending decimals currently can't be deleted.
    - If the first digit after a decimal is deleted, the decimal point is also deleted.
- Rework display overflow handling
    - long, small numbers (e.g., 1.234567890123456) should just be rounded to the maximum precision that fits the display, instead of displaying as an exponential. Specifically, if the integer part of the number can be shown in the display, the number should just be rounded appropriately; exponentials should only be used when the integer part of the number overflows.
- Handle division by zero
    - Fun option: "Okay, we're taking away zero privileges" -> hide zero button temporarily(?)
    - Sensible option: "ERR: Can't divide by zero"
- Handle large values (research MAX_VALUE vs MAX_SAFE_INTEGER)
- Improve float precision(?) 
- Improve appearance
- Add a hidden button to rotate the calculator(?)