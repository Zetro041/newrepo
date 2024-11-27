let runningTotal = 0;
let buffer = "0"; // Current number being entered
let equationBuffer = ""; // Full equation
let previousOperator = null;
let resetBufferOnNextNumber = false; // Flag to reset buffer after operator
let history = []; // Array to store the last 5 calculations

const mainScreen = document.querySelector(".screen"); // For showing current input or result
const equationScreen = document.querySelector(".screen1"); // For showing the history

function buttonClick(value) {
    if (isNaN(value)) {
        handleSymbol(value);
    } else {
        handleNumber(value);
    }
    updateScreens();
}

function handleSymbol(symbol) {
    switch (symbol) {
        case "C":
            buffer = "0";
            runningTotal = 0;
            previousOperator = null;
            resetBufferOnNextNumber = false;
            break;
        case "=":
            if (previousOperator == null) {
                return;
            }
            flushOperation(parseInt(buffer));
            equationBuffer += ` ${buffer} = ${runningTotal}`;
            addToHistory(equationBuffer); // Add completed equation to history
            buffer = runningTotal.toString();
            equationBuffer = ""; // Clear the equation buffer for a new calculation
            previousOperator = null;
            resetBufferOnNextNumber = true;
            runningTotal = 0;
            break;
        case "←":
            if (buffer.length === 1) {
                buffer = "0";
            } else {
                buffer = buffer.substring(0, buffer.length - 1);
            }
            break;
        case "+":
        case "−":
        case "×":
        case "÷":
            handleMath(symbol);
            break;
    }
}

function handleMath(symbol) {
    if (buffer === "0" && runningTotal === 0) {
        return; // Prevent adding an operator without a valid operand
    }

    const intBuffer = parseInt(buffer);

    if (runningTotal === 0) {
        runningTotal = intBuffer;
    } else {
        flushOperation(intBuffer);
    }

    previousOperator = symbol;
    equationBuffer += ` ${buffer} ${symbol}`; // Append the operator and operand to the equation
    resetBufferOnNextNumber = true; // Prepare for the next number input
    buffer = "0"; // Clear buffer for the next operand
}

function flushOperation(intBuffer) {
    if (previousOperator === "+") {
        runningTotal += intBuffer;
    } else if (previousOperator === "−") {
        runningTotal -= intBuffer;
    } else if (previousOperator === "×") {
        runningTotal *= intBuffer;
    } else if (previousOperator === "÷") {
        runningTotal /= intBuffer;
    }
}

function handleNumber(numberString) {
    if (resetBufferOnNextNumber) {
        buffer = numberString; // Replace the buffer with the new number
        resetBufferOnNextNumber = false;
    } else if (buffer === "0") {
        buffer = numberString; // Replace initial zero
    } else {
        buffer += numberString; // Append digit to the current number
    }
}

function addToHistory(equation) {
    history.push(equation); // Add the new equation to history
    if (history.length > 5) {
        history.shift(); // Remove the oldest equation if history exceeds 5
    }
}

function updateScreens() {
    mainScreen.innerText = buffer; // Show current input or result
    equationScreen.innerText = history.join("\n"); // Show history of equations, joined with line breaks
}

function init() {
    document.querySelector(".calc-buttons").addEventListener("click", function (event) {
        const value = event.target.innerText;
        buttonClick(value);
    });
}

init();
