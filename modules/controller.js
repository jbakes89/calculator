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

    test;

    // Stored values/flags
    currentValue = null;
    pendingDecimal = false;
    pendingValue = null;
    pendingOperator = null;

    // Init
    constructor() {
        this.bindUI()
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
        }

        const operatorPressHandler = e => this.operatorWasPressed(e);
        const operatorButtons = document.querySelectorAll(".js-operator-button");
        for (var button of operatorButtons) {
            button.addEventListener("click", operatorPressHandler);
        }

        const clearAllButton = document.querySelector(".js-clear-all");
        clearAllButton.addEventListener("click", e => this.clearAll());

        const backspaceButton = document.querySelector(".js-backspace");
        backspaceButton.addEventListener("click", e => this.backspace());

        const equalsButton = document.querySelector(".js-equals");
        equalsButton.addEventListener("click", e => this.equals());

        this.displayValueElement = document.querySelector(".js-display-value");
        this.displayPanel = document.querySelector(".js-display-panel");
        this.updateDisplay();
    }
}