
var elt = document.getElementById('bernard');
var calculator = Desmos.GraphingCalculator(elt, {"graphpaper": false, "settingsMenu":false, "expressionsTopbar": true, "keypad": true});

function run() {
    const ml = document.getElementById("single-expression-multiline").checked;
    const la = document.getElementById("left-align").checked;
    const input = document.getElementById("input").value;
    const output = convert(input, ml, la);
    document.getElementById("output").innerHTML = output;
    if (!ml) {
        for (let line of output.split('\n')) {
            calculator.setExpression({id: line, latex: line});
        }
    }
    else {
        calculator.setExpression({id: output, latex: output});
    }
    
}
