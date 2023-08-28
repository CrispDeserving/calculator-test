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
