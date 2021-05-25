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
    displayPanel;
    keyboardLinkedButtons = {};

    test;

    // Stored values/flags
    currentValue = null;
    pendingDecimal = false;
    pendingValue = null;
    pendingOperator = null;

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
        this.displayValueElement.textContent = (this.currentValue ?? "").toString() + (this.pendingDecimal ? "." : "");
        if (this.displayValueOverflows()) {
            console.log("Text too wide");
            this.resolveDisplayOverflow();
        }
    }


    // Event handling
    numpadWasPressed(e) {
        const pressedValue = e.target.id;
        if (pressedValue == "decimal-point") {
            if (!(this.currentValue ?? "").toString().includes(".")) {
                this.pendingDecimal = true;
            }
        } else {
            this.currentValue = parseFloat((this.currentValue ?? "").toString() + this.resolveDecimalPoint() + pressedValue);
        }

        this.updateDisplay();
    }

    operatorWasPressed(e) {
        const pressedOperator = Operator[e.target.id.toUpperCase()];
        if (this.pendingValue && this.pendingOperator) {
            const res = this.operate(this.pendingOperator, this.pendingValue, this.currentValue);
            this.currentValue = Number(res.toFixed(15));
            this.pendingValue = this.currentValue;
            this.pendingOperator = pressedOperator;
        } else {
            this.pendingValue = this.currentValue;
            this.pendingOperator = pressedOperator;
        }

        // Show the result on display, but reset display value from next number press
        this.updateDisplay();
        this.currentValue = null;
    }

    clearAll() {
        this.resetStoredValues();
        this.updateDisplay();
    }

    backspace() {
        this.currentValue = parseFloat((this.currentValue ?? "").toString().slice(0, -1));
        this.updateDisplay();
    }

    equals() {
        if (this.pendingValue && this.pendingOperator) {
            const res = this.operate(this.pendingOperator, this.pendingValue, this.currentValue);
            this.currentValue = Number(res.toFixed(15));
            this.updateDisplay();
            this.pendingValue = null;
            this.pendingOperator = null;
        }
    }

    // Helper Methods
    resetStoredValues() {
        this.currentValue = this.pendingValue = this.pendingOperator = null;
    }

    resolveDecimalPoint() {
        if (this.pendingDecimal) {
            this.pendingDecimal = false;
            return ".";
        } else {
            return "";
        }
    }

    displayValueOverflows() {
        return this.displayValueElement.clientWidth > parseFloat(window.getComputedStyle(this.displayPanel).width)
    }

    resolveDisplayOverflow() {
        console.log(`Resolving display overflow...`);
        let precision = 15;
        while (this.displayValueOverflows()) {
            this.displayValueElement.textContent = parseFloat(this.displayValueElement.textContent).toExponential(precision);
            precision--;
        }
    }


    // Bind UI elements
    bindUI() {
        const numpadPressHandler = e => this.numpadWasPressed(e);
        const numpadButtons = document.querySelectorAll(".js-numpad-button");
        for (var button of numpadButtons) {
            button.addEventListener("click", numpadPressHandler);
            this.keyboardLinkedButtons[button.id] = button;
        }

        const operatorPressHandler = e => this.operatorWasPressed(e);
        const operatorButtons = document.querySelectorAll(".js-operator-button");
        for (var button of operatorButtons) {
            button.addEventListener("click", operatorPressHandler);
            this.keyboardLinkedButtons[button.id] = button;
        }

        const clearAllButton = document.querySelector(".js-clear-all");
        clearAllButton.addEventListener("click", e => this.clearAll());
        this.keyboardLinkedButtons[clearAllButton.id] = clearAllButton;

        const backspaceButton = document.querySelector(".js-backspace");
        backspaceButton.addEventListener("click", e => this.backspace());
        this.keyboardLinkedButtons[backspaceButton.id] = backspaceButton;

        const equalsButton = document.querySelector(".js-equals");
        equalsButton.addEventListener("click", e => this.equals());
        this.keyboardLinkedButtons[equalsButton.id] = equalsButton;

        this.displayValueElement = document.querySelector(".js-display-value");
        this.displayPanel = document.querySelector(".js-display-panel");
        this.updateDisplay();
    }

    bindKeys() {
        document.addEventListener("keyup", e => {
            let key = e.key;
            console.log(`${key} was pressed`)
            /* Normally I'd use switch-case, but this doesn't allow regex testing for
            numerical characters. I saw an example online using switch (true) and
            case /[0-9]/.test(key); this might be a better solution for real-world,
            but for it seemed to "hacky" for a practice project */ 
            // Numbers
            if (/[0-9]/.test(key)) {
                this.keyboardLinkedButtons[key].click();
            // Decimal point
            } else if (key == "." || key == "Decimal") {
                this.keyboardLinkedButtons["decimal-point"].click();
            // Operators
            } else if (/[x\+\-\/\*]/.test(key)) {
                this.keyboardLinkedButtons[{
                    "+": "add", "-": "subtract", "/": "divide",
                    "*": "multiply", "x": "multiply"
                }[key]].click();
            // Backspace
            } else if (key == "Backspace" || key == "Delete") {
                this.keyboardLinkedButtons["clear"].click();
            // Escape (clear all)
            } else if (key == "Escape" || key == "Esc") {
                this.keyboardLinkedButtons["clear-all"].click();
            // Equals/Return/Enter
            } else if (key == "=" || key == "Equals" || key == "Enter") {
                this.keyboardLinkedButtons["equals"].click();
            }
        })
    }
}