var elt = document.getElementById('bernard');
var calculator = Desmos.GraphingCalculator(elt, {"graphpaper": false, "settingsMenu":false, "expressionsTopbar": true, "keypad": true});
var myInput = CodeMirror(document.getElementById("input"), {
    value: `x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} 
e^{i \\theta} = cos(\\theta) + i sin(\\theta)
\\begin{matrix} 1 & 0 \\\\ 0 & 1 \\end{matrix} \\begin{matrix} x \\\\ y \\end{matrix} = \\begin{matrix} x \\\\ y \\end{matrix}
f'(x) = \\lim_{h \\to 0} \\frac{f(x+h)-f(x)}{h}`,
    mode:  "stex",
    lineWrapping: true,
    lineNumbers: true
});
var myOutput = CodeMirror(document.getElementById("output"), {
    value: "",
    mode:  "stex",
    lineWrapping: true,
    lineNumbers: true
});
function run() {
    const ml = document.getElementById("single-expression-multiline").checked;
    const la = document.getElementById("left-align").checked;
    const mode = "math"
    console.log(CodeMirror.value);
    const input = myInput.getValue();
    const output = convert(input, ml, la, mode);
    myOutput.setValue(output);
    if (!ml) {
        for (let line of output.split('\n')) {
            calculator.setExpression({id: hashCode(line), latex: line});
        }
    }
    else {
        calculator.setExpression({id: hashCode(output), latex: output});
    }
    
}
