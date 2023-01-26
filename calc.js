const operations = {
    '/': (num, factor) => { return factor === 0 ? NaN : num / factor },
    '*': (num, factor) => { return num * factor},
    '-': (num, factor) => { return num - factor },
    '+': (num, factor) => { return num + factor },
}

let operation = '';

(function() {
    document.addEventListener('keydown', (key) => {add(key.key)})
})()

function processOperation() {
    operation = handleOperation(operation)
    updateResult(operation % 1 != 0 ? operation.toFixed(3) : operation)
}

function add(char) {
    if (!new RegExp(/[/\*\-\+\(\)0-9\.\=]|Backspace|Enter/).test(char)) {
        return
    }
    switch(char) {
        case "Backspace": {
            if (typeof operation === 'number') {
                reset();
                return;
            }
            backspace()
            updateResult(operation)
            return;
        }
        case 'Enter': case '=': {
            processOperation()
            return;
        }
        default: {
            if (char === '.' && !canPlaceDigit(operation)) return;
            operation += char
            updateResult(operation)
        }
    }
}

function canPlaceDigit(text) {
    let numTxt = ''
    let currentCharacter = ''
    let numOfChars = 0
    for (let i = text.length; i > 0; i--) {
        let char = text.substring(i-1, i)
        if (char === '.') return false;
        if (new RegExp(/[/\*\-\+]/).test(char)) break
        ++numOfChars
    }
    return numOfChars > 0
}

function updateResult(text) {
    document.querySelector('#result > p').textContent = text === '' ? '0' : text
}

function printError(error) {
    switch(error) {
        case 'missing_bracket': { updateResult('Malformed operation'); reset(); break; }
    }
}

function reset() {
    operation = ''
    updateResult(operation)
}

function backspace() {
    operation = operation.substring(0, operation.length - 1)
}

function handleOperation(string) {
    console.log(string)
    let i1 = string.indexOf('(')
    if (i1 === -1) {
        let mathOp = string
        let opPos = mathOp.search(/[/\*\-\+]/)
        if (opPos < 0) {
            return +mathOp
        }
        let total = +mathOp.substring(0, opPos)
        mathOp = mathOp.replace(total, '')
        while (true) {
            if (mathOp === '') {
                break  
            }
            let operator = mathOp.substring(0, 1)
            mathOp = mathOp.replace(operator, '')
            let operatorPos = mathOp.search(/[/\*\-\+]/)
            let number = +mathOp.substring(0, (
                operatorPos < 0 ? mathOp.length : operatorPos
            ))
            console.log(mathOp)
            mathOp = mathOp.replace(number, '')
            console.log(mathOp)
            // console.log(operator)
            total = operations[operator](total, number)
        }
        return total
    }
    let i2 = string.indexOf(')')
    if (i2 === -1) {
        printError('missing_bracket')
        return
    }
    let calc = operation = string.substring(i1+1, i2)
    return handleOperation(string.replace(`(${calc})`, handleOperation(calc)))
}