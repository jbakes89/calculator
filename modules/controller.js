const Operator = {
    ADD: {
        asString: "+",
        calc: (a,b) => a+b
    },
    SUBTRACT: {
        asString: "-",
        calc: (a,b) => a-b
    },
    MULTIPLY: {
        asString: "\u00D7",
        calc: (a,b) => a*b
    },
    DIVIDE: {
        asString: "\u00F7",
        calc: (a,b) => a/b
    }
}

export class Controller {
    // UI elements
    displayValueElement;
    displayErrorElement;
    displayEquationElement;
    displayPanel;
    keyboardLinkedButtons = {};

    // Stored values/flags
    currentNumberString = "";
    // equation.pendingValue = null;
    // equation.pendingOperator = null;
    // equation.equalsSign = false;
    equation = {
        pendingValue: null,
        pendingOperator: null,
        secondValue: null,
        equalsSign: false,
    };

    // Init
    constructor() {
        this.bindUI();
        this.bindKeys();
    }

    
    // Core Methods
    operate(operator, a, b) {
        return operator.calc(a,b);
    }

    updateDisplay() {
        this.displayErrorElement.textContent = "";
        this.displayErrorElement.style.display = "none";
        this.displayValueElement.textContent = this.currentNumberString;
        if (this.displayValueOverflows()) {
            console.log("Text too wide");
            this.resolveDisplayOverflow();
        }

        this.displayEquationElement.textContent = (
            `${this.equation.pendingValue ?? ""}` +
            ` ${this.equation.pendingOperator ? this.equation.pendingOperator.asString : ""}` +
            ` ${this.equation.secondValue ?? ""}` +
            ` ${this.equation.equalsSign ? "=" : ""}`
            );
    }

    toggleSign() {
        // Would it be better to just let this be handled by the subtraction sign?
        if (!this.equation.equalsSign) {
            this.currentNumberString = (this.currentNumberString[0] == "-") ?
                (this.currentNumberString.slice(1)) :
                ("-" + this.currentNumberString);
            this.updateDisplay();
        }
    }


    // Event handling
    numpadWasPressed(e) {
        if (this.equation.equalsSign) {
            this.equation.equalsSign = false;
            this.currentNumberString = "";
        }
        const pressedValue = e.target.id;
        if (pressedValue == "decimal-point") {
            if (!this.currentNumberString.includes(".")) {
                this.currentNumberString += "."
            }
        } else {
            this.currentNumberString += pressedValue;
        }

        this.updateDisplay();
    }

    operatorWasPressed(e) {
        const pressedOperator = Operator[e.target.id.toUpperCase()];

        if (!this.currentNumberString) {
            if (pressedOperator == Operator.SUBTRACT) {
                this.currentNumberString = "-" + this.currentNumberString;
                this.updateDisplay();
            }
            return;
        }
        
        if (this.equation.pendingValue && this.equation.pendingOperator) {
            console.log("Check");
            this.equals();
            this.equation.pendingValue = parseFloat(this.currentNumberString);
            this.equation.pendingOperator = pressedOperator;
        } else {
            this.equation.pendingValue = parseFloat(this.currentNumberString)
            this.equation.pendingOperator = pressedOperator;
        }

        this.equation.equalsSign = false;
        this.currentNumberString = "";

        this.updateDisplay();
    }

    clearAll() {
        this.resetStoredValues();
        this.updateDisplay();
    }

    backspace() {
        if (!this.equation.equalsSign) {
            this.currentNumberString = this.currentNumberString.slice(0, -1);
            this.updateDisplay();
        }
    }

    equals() {
        if (!this.currentNumberString) {
            return;
        }

        if (this.equation.pendingValue && this.equation.pendingOperator && this.currentNumberString) {
            this.equation.secondValue = parseFloat(this.currentNumberString);
            // Handle division by zero
            if (this.equation.pendingOperator == Operator.DIVIDE && this.equation.secondValue == 0) {
                this.raiseError("Can't divide by zero");
                return;
            }
            const res = this.operate(this.equation.pendingOperator, this.equation.pendingValue, this.equation.secondValue);
            if (res > Number.MAX_VALUE) {
                this.raiseError("Maximum value exceeded");
                return;
            }
            // Number(res.toFixed(15)) solves (I think?) issues due to float precision (e.g., 0.1 * 0.2 = 0.020000000000004) 
            this.currentNumberString = Number(res.toFixed(15)).toString();
            this.equation.equalsSign = true;
            this.updateDisplay();
            this.equation.pendingValue = null;
            this.equation.pendingOperator = null;
            this.equation.secondValue = null;
        }
    }

    // Helper Methods
    resetStoredValues() {
        this.equation.pendingValue = this.equation.pendingOperator = this.equation.secondValue = null;
        this.currentNumberString = "";
        this.equation.equalsSign = false;
    }

    displayValueOverflows() {
        return this.displayValueElement.clientWidth > parseFloat(window.getComputedStyle(this.displayPanel).width)
    }

    resolveDisplayOverflow() {
        console.log(`Resolving display overflow...`);
        let precision = 21;
        while (this.displayValueOverflows()) {
            this.displayValueElement.textContent = parseFloat(this.currentNumberString).toPrecision(precision);
            precision--;
        }
    }

    raiseError(message) {
        this.clearAll();
        this.displayErrorElement.textContent = `ERROR: ${message}`;
        this.displayErrorElement.style.display = "block";
    }


    // Bind UI elements
    bindUI() {
        const numpadPressHandler = e => {
            this.numpadWasPressed(e);
            e.target.blur();
        };
        const numpadButtons = document.querySelectorAll(".js-numpad-button");
        for (var button of numpadButtons) {
            button.addEventListener("click", numpadPressHandler);
            this.keyboardLinkedButtons[button.id] = button;
        }

        const operatorPressHandler = e => {
            this.operatorWasPressed(e);
            e.target.blur();
        };
        const operatorButtons = document.querySelectorAll(".js-operator-button");
        for (var button of operatorButtons) {
            button.addEventListener("click", operatorPressHandler);
            this.keyboardLinkedButtons[button.id] = button;
        }

        const clearAllButton = document.querySelector(".js-clear-all");
        clearAllButton.addEventListener("click", e => {
            this.clearAll();
            e.target.blur();
        });
        this.keyboardLinkedButtons[clearAllButton.id] = clearAllButton;

        const backspaceButton = document.querySelector(".js-backspace");
        backspaceButton.addEventListener("click", e => {
            this.backspace();
            e.target.blur();
        });
        this.keyboardLinkedButtons[backspaceButton.id] = backspaceButton;

        const equalsButton = document.querySelector(".js-equals");
        equalsButton.addEventListener("click", e => {
            this.equals();
            e.target.blur();
        });
        this.keyboardLinkedButtons[equalsButton.id] = equalsButton;

        const plusMinusButton = document.querySelector(".js-plus-minus");
        plusMinusButton.addEventListener("click", e => {
            this.toggleSign();
            e.target.blur();
        });

        this.displayValueElement = document.querySelector(".js-display-value");
        this.displayPanel = document.querySelector(".js-display-panel");

        this.displayErrorElement = document.querySelector(".js-display-error");

        this.displayEquationElement = document.querySelector(".js-display-equation");

        this.updateDisplay();
    }

    bindKeys() {
        /* From my own testing, it felt more natural to have typing inputs respond on "keydown",
        but actions ("clear all", "equals", and operators) respond on "keyup". */

        document.addEventListener("keydown", e => {
            let key = e.key;
            console.log(`${key} was pressed`)
            /* Normally I'd use switch-case, but this doesn't allow regex testing for
            numerical characters. I saw an example online using switch (true) and
            case /[0-9]/.test(key); this might be a better solution for real-world,
            but for it seemed to "hacky" for a practice project */ 
            if (/[0-9]/.test(key)) {
                // Numbers
                const button = this.keyboardLinkedButtons[key];
                button.click();
            } else if (key == "." || key == "Decimal") {
                // Decimal point
                const button = this.keyboardLinkedButtons["decimal-point"]
                button.click();
            } else if (key == "Backspace" || key == "Delete") {
                // Backspace
                this.keyboardLinkedButtons["clear"].click();
            } else if (key == "/") {
                /*I noticed that forward-slash triggers the "Quick Find" dialogue on Firefox,
                so we use preventDefault() to stop that behaviour */
                if (key == "/") { e.preventDefault(); }
            }
        })

        document.addEventListener("keyup", e => {
            let key = e.key;
            console.log(`${key} was pressed`)
            /* Normally I'd use switch-case, but this doesn't allow regex testing for
            numerical characters. I saw an example online using switch (true) and
            case /[0-9]/.test(key); this might be a better solution for real-world,
            but for it seemed to "hacky" for a practice project */ 
            if (key == "Escape" || key == "Esc") {
                // Escape (clear all)
                this.keyboardLinkedButtons["clear-all"].click();
            } else if (key == "=" || key == "Equals" || key == "Enter") {
                // Equals/Return/Enter
                this.keyboardLinkedButtons["equals"].click();
            } else if (/[x\+\-\/\*]/.test(key)) {
                // Operators
                this.keyboardLinkedButtons[{
                    "+": "add", "-": "subtract", "/": "divide",
                    "*": "multiply", "x": "multiply"
                }[key]].click();
            }
        })
    }
}