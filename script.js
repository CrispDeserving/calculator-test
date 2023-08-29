const calculator_states = Object.freeze({
    NUMBER: Symbol("number"),
    SYMBOL: Symbol("symbol"),
});

let global_display = "";
let calculator_state = calculator_states.NUMBER;

window.addEventListener("DOMContentLoaded", () => {
    const numbers = document.querySelectorAll(".number");
    for (const number of numbers) {
        number.addEventListener("click", click_number_btn_handler);
    }
    
    const operators = document.querySelectorAll(".operator");
    for (const operator of operators) {
        operator.addEventListener("click", click_operator_btn_handler);
    }
});

function click_number_btn_handler(event) {
    const number = event.target.textContent;
    push_number(number);
}

function push_number(number) {
    switch (calculator_state) {
        case calculator_states.NUMBER:
            global_display += number;
            break;
            
        case calculator_states.SYMBOL:
            global_display += ` ${number}`;
            break;
    }

    calculator_state = calculator_states.NUMBER;
    update_display(global_display);        
}

function click_operator_btn_handler(event) {
    const symbol = event.target.textContent;
    push_operator(symbol);
}

function push_operator(symbol) {
    if (calculator_state !== calculator_states.NUMBER) {
        return;
    }
    global_display += ` ${symbol}`;

    calculator_state = calculator_states.SYMBOL;
    update_display(global_display);
}

function update_display(text) {
    const text_element = document.querySelector(".text");
    text_element.textContent = text;
}

function add(num1, num2) {
    const number1 = parseInt(num1);
    const number2 = parseInt(num2);

    return number1 + number2;
}

function subtract(num1, num2) {
    const number1 = parseInt(num1);
    const number2 = parseInt(num2);
    
    return number1 - number2;
}

function multiply(num1, num2) {
    const number1 = parseInt(num1);
    const number2 = parseInt(num2);
    
    return number1 * number2;
}

function divide(num1, num2) {
    const number1 = parseInt(num1);
    const number2 = parseInt(num2);
    
    return number1 / number2;
}

function operate(operator, num1, num2) {
    switch (operator) {
        case "+":
            return add(num1, num2);

        case "-":
            return subtract(num1, num2);
        
        case "*":
            return multiply(num1, num2);

        case "/":
            return divide(num1, num2);

        default:
            return NaN;
    }
}
