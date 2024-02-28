const calcRowBtns = document.querySelectorAll(".calc-row > button");
const clear = document.getElementById("clear");
const del = document.getElementById("delete");
const expressionDisplay = document.getElementById("expression");
let expression = "";
const resultDisplay = document.getElementById("result");
const validInsertionKeys = '0123456789+-*/.';

const operators = {
    "+": add,
    "-": subtract,
    "*": multiply,
    "/": divide,
    ".": null,
    "=": null,
};

function add(a, b) {
    return Number(a) + Number(b);
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    return a / b;
}

function operate(a, b, op) {
    return operators[op](a, b);
}

function isInsertionValid(content) {
    if (!validInsertionKeys.includes(content)) return false;

    if (content in operators) {
        if (expression.at(-1) in operators || expression === '') return false;
    }

    if (content === '.') return checkDotValidity();

    return true;
}

function checkDotValidity() {
    let lastOperatorIndex = -1;
    for (let i = 0; i < expression.length; i++) {
        if ('+*-/'.includes(expression.at(i))) lastOperatorIndex = i;
    }

    const expressionSubstring = expression.slice(lastOperatorIndex + 1); 

    if (expressionSubstring.includes('.')) return false;
    return true;
}

function insertCharOnDisplay(content) {
    if (!isInsertionValid(content)) return;

    expression += content;
    expressionDisplay.textContent = expression;
}

function addCalcRowFunctionality() {
    for (let i = 0; i < calcRowBtns.length; i++) {
        calcRowBtns.item(i).addEventListener("click", e => {
            insertCharOnDisplay(e.target.textContent);
        })
    }
}

function addSpecialButtonFunctionality() {
    const equalsBtn = document.getElementById("=");
    equalsBtn.addEventListener("click", evaluate);

    const delBtn = document.getElementById("delete");
    delBtn.addEventListener("click", deleteLastCharacter);

    const clear = document.getElementById("clear");
    clear.addEventListener("click", clearExpression);
}

let result = 0;
function evaluate() {
    if (expression.at(-1) in operators || expression === '') return;

    const anyOperators = new RegExp("[-]|[+]|[/]|[*]");
    let numbers = expression.split(anyOperators);
    let expressionOperators = [...expression].filter( e => '+-/*'.includes(e));

    for (let i = 0; i < expressionOperators.length;) {
        let currentOp = expressionOperators[i];

        if (currentOp !== '*' && currentOp !== '/') {
            i++;
            continue
        }

        let partialResult = operators[currentOp](+numbers[i], +numbers[i + 1]);
        numbers[i] = partialResult;

        numbers.splice(i + 1, 1);
        expressionOperators.splice(i, 1);
    }

    while (expressionOperators.length > 0) {
        let currentOp = expressionOperators.at(0);
        let partialResult = operators[currentOp](+numbers.at(0), +numbers.at(1));

        numbers.splice(0, 2, partialResult);
        expressionOperators.shift();
    }

    result = numbers.at(0);
    result = Math.floor(result * 1e5) / 1e5;
    resultDisplay.textContent = result;
}

function deleteLastCharacter() {
    expression = expression.slice(0, -1);
    expressionDisplay.textContent = expression;
}

function clearExpression() {
    expression = "";
    expressionDisplay.textContent = expression;
}

function addKeyboardFunctionality() {
    const body = document.body;
    body.addEventListener("keydown", e => {
        if (validInsertionKeys.includes(e.key)) insertCharOnDisplay(e.key);
        else if (e.key === 'Enter') evaluate();
        
        if (e.key !== 'Backspace') return;

        if (e.ctrlKey) clearExpression();
        else deleteLastCharacter();
    })
}

addKeyboardFunctionality();
addCalcRowFunctionality();
addSpecialButtonFunctionality();
