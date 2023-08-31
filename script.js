const calculator_states = Object.freeze({
    NUMBER: Object.freeze({
        NO_DECIMAL: Symbol("no_decimal"),
        WITH_DECIMAL: Symbol("with_decimal"),
    }),
    SYMBOL: Symbol("symbol"),
});
let global_display = "";
let calculator_state = calculator_states.NUMBER.NO_DECIMAL;

window.addEventListener("DOMContentLoaded", () => {
    const numbers = document.querySelectorAll(".number");
    for (const number of numbers) {
        number.addEventListener("click", click_number_btn_handler);
    }

    const zero = document.querySelector(".zero");
    zero.addEventListener("click", click_zero_btn_handler);
    
    const operators = document.querySelectorAll(".operator");
    for (const operator of operators) {
        operator.addEventListener("click", click_operator_btn_handler);
    }

    const equal_btn = document.querySelector('.equals');
    equal_btn.addEventListener("click", click_equal_btn_handler);

    const all_clear = document.querySelector(".all-clear");
    all_clear.addEventListener("click", () => {
        calculator_state = calculator_states.NUMBER.NO_DECIMAL;
        global_display = "";
        update_display(global_display);
    });

    const backspace = document.querySelector(".backspace");
    backspace.addEventListener("click", click_backspace_btn_handler);

    const dot = document.querySelector(".dot");
    dot.addEventListener("click", click_dot_btn_handler);
});

function click_number_btn_handler(event) {
    const number = event.target.textContent;
    push_number(number);
}

function push_number(number) {
    switch (calculator_state) {
        case calculator_states.NUMBER.WITH_DECIMAL:
        case calculator_states.NUMBER.NO_DECIMAL:
            global_display += number;
        break;
            
        case calculator_states.SYMBOL:
            global_display += ` ${number}`;
            calculator_state = calculator_states.NUMBER.NO_DECIMAL;
        break;
    }

    update_display(global_display);        
}

function click_zero_btn_handler() {
    if (calculator_state === calculator_states.NUMBER.NO_DECIMAL) {
        const dot_list = global_display.split(" ");
        const last_on_dot = dot_list.pop();
        
        if (last_on_dot !== "" && Number(last_on_dot) === 0) {
            return;
        }
    }

    push_number("0");
}

function click_operator_btn_handler(event) {
    const symbol = event.target.textContent;
    push_operator(symbol);
}

function push_operator(symbol) {
    switch (calculator_state) {
        default:
            return;
        
        case calculator_states.NUMBER.WITH_DECIMAL:
            global_display = trim_zeroes(global_display);
        case calculator_states.NUMBER.NO_DECIMAL:
            const dot_list = global_display.split(".");
            const last_on_dot = dot_list.pop();
        
            if (last_on_dot === "") {
                global_display = dot_list.join(".");
            }
        break;

    }
    global_display += ` ${symbol}`;
    
    calculator_state = calculator_states.SYMBOL;
    update_display(global_display);
}

function trim_zeroes(string) {
    let result = string;

    if (result.endsWith("0")) {
        while (result.endsWith("0")) {
            result = result.substring(0, result.length - 1);
        }
    }

    return result;
}

function click_dot_btn_handler() {
    const display = global_display;
    switch (calculator_state) {
        case calculator_states.NUMBER.WITH_DECIMAL:
            return;
        
        case calculator_states.NUMBER.NO_DECIMAL:
            const last_char = display[display.length-1];

            if (last_char === undefined) {
                global_display = "0";
            } else if (last_char < "0" || last_char > "9") {
                global_display += " 0";
            }
        break;
            
        case calculator_states.SYMBOL:
            global_display += " 0";
        break;
    }

    calculator_state = calculator_states.NUMBER.WITH_DECIMAL;
    global_display += ".";
    update_display(global_display);
}

function update_display(string = global_display) {
    const text_element = document.querySelector(".text");
    text_element.textContent = string === "" ? "..." : string;
}

function click_equal_btn_handler() {
    if (calculator_state === calculator_states.SYMBOL || global_display === "") {
        return;
    }

    const dot_list = global_display.split(".");
    const last_on_dot = dot_list.pop();

    if (last_on_dot === "" || Number(last_on_dot) === 0) {
        global_display = dot_list.join(".");
    }

    const expression_text = global_display;
    const operators = [
        "+",
        "-",
        "*", 
        "/",
    ];

    let expr_arr = operators.reduce((acc, operator) => {
        return acc.map((element) => {
            const separated = element.split(operator);
            const last_e = separated.pop();

            const sandwich = separated.map(e => [e, operator]);
            sandwich.push(last_e);

            return sandwich.flat();
        }).flat();
    }, [expression_text]).map(e => e.trim());
    
    let result = expr_arr[0];
    for (let i=2; i<expr_arr.length; i+=2) {
        const curr_operator = expr_arr[i-1];
        const second_arg = expr_arr[i];

        result = operate(curr_operator, result, second_arg);
    }
    
    result = Number(result).toPrecision(8);
    if (result - Math.floor(result) < Number.EPSILON) {
        result = Math.floor(result);
    }

    if (result.includes(".")) {
        result = trim_zeroes(result);
    }
    update_display(`${global_display} = ${result}`);
    global_display = result;
}

function click_backspace_btn_handler() {
    display = global_display;
    let do_double_backspace = true;

    switch (calculator_state) {
        case calculator_states.SYMBOL:
            const sandwich = display.split(" ");
            const last_number = sandwich[sandwich.length - 2];

            if (last_number.includes(".")) {
                calculator_state = calculator_states.NUMBER.WITH_DECIMAL;
            } else {
                calculator_state = calculator_states.NUMBER.NO_DECIMAL;
            }
        break;
            
        case calculator_states.NUMBER.WITH_DECIMAL:
        case calculator_states.NUMBER.NO_DECIMAL:
            const second_back = display[display.length-2];
            if (second_back === ".") {
                calculator_state = calculator_states.NUMBER.NO_DECIMAL;
            } else if (second_back < "0" || second_back > "9") {
                calculator_state = calculator_states.SYMBOL;
            } else {
                do_double_backspace = false;
            }
        break;
    }

    display = backspace(display);
    if (do_double_backspace) {
        display = backspace(display);
    }

    global_display = display;
    update_display(global_display);
}

function backspace(string) {
    return string.substring(0, string.length-1);
}

function add(num1, num2) {
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);

    return number1 + number2;
}

function subtract(num1, num2) {
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);
    
    return number1 - number2;
}

function multiply(num1, num2) {
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);
    
    return number1 * number2;
}

function divide(num1, num2) {
    const number1 = parseFloat(num1);
    const number2 = parseFloat(num2);
    
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
