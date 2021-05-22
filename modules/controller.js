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
    displayValue = "";
    displayPanel;

    pendingValue = null;
    pendingOperator = null;

    constructor() {
        this.bindUI()
    }
   
    operate(operator, a, b) {
        return operator.calc(a,b);
    }

    numpadWasPressed(e) {
        const pressedValue = e.target.id;
        if (pressedValue == "decimal-point") {

        } else {
            this.displayValue += pressedValue;
        }

        this.updateDisplay();
    }

    operatorWasPressed(e) {
        const pressedOperator = Operator[e.target.id.toUpperCase()];
        if (this.pendingValue && this.pendingOperator) {
            const res = this.operate(this.pendingOperator, this.pendingValue, parseFloat(this.displayValue));
            this.displayValue = res.toString();
            this.pendingValue = parseFloat(this.displayValue);
            this.pendingOperator = pressedOperator;
        } else {
            this.pendingValue = parseFloat(this.displayValue);
            this.pendingOperator = pressedOperator;
        }

        // Show the result on display, but reset display value from next number press
        this.updateDisplay();
        this.displayValue = "";
    }

    updateDisplay() {
        this.displayPanel.textContent = this.displayValue;
    }

    clearAll() {
        this.resetStoredValues();
        this.updateDisplay();
    }

    backspace() {
        this.displayValue = this.displayValue.slice(0, -1);
        this.updateDisplay();
    }

    equals() {
        if (this.pendingValue && this.pendingOperator && (this.displayValue.length > 0)) {
            const res = this.operate(this.pendingOperator, this.pendingValue, parseFloat(this.displayValue));
            this.displayValue = res.toString();
            this.updateDisplay();
            this.pendingValue = null;
            this.pendingOperator = null;
        }
    }

    resetStoredValues() {
        this.displayValue = "";
        this.pendingValue = null;
        this.pendingOperator = null;
    }


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

        this.displayPanel = document.querySelector(".js-display");
        this.updateDisplay();
    }
}