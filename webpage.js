var elt = document.getElementById('bernard');
var calculator = Desmos.GraphingCalculator(elt, {"graphpaper": false, "settingsMenu":false, "expressionsTopbar": true, "keypad": true});
function run() {
    const ml = document.getElementById("single-expression-multiline").checked;
    const la = document.getElementById("left-align").checked;
    const input = document.getElementById("input").value;
    const output = convert(input, ml, la);
    document.getElementById("output").value = output;
    if (!ml) {
        for (let line of output.split('\n')) {
            calculator.setExpression({id: hashCode(line), latex: line});
        }
    }
    else {
        calculator.setExpression({id: hashCode(output), latex: output});
    }
    
}
