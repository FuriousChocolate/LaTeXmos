var examples = [
`% This is an example of a multiline display. Please check the multiline box and optionally the left-align box to see it in action.
ax^2 + bx + c = 0
x^2 + \\frac{b}{a} + \\frac{c}{a} = 0
x^2 + \\frac{b}{a}x = -\\frac{c}{a}
x^2 + 2\\frac{b}{2a}x + \\left(\\frac{b}{2a}\\right)^2 = \\left(\\frac{b}{2a}\\right)^2 - \\frac{c}{a}
\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2}{4a^2} - \\frac{4ac}{4a^2}
x + \\frac{b}{2a} = \\frac{\\pm \\sqrt{b^2 - 4ac}}{2a}
x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`,
`% This is an example of limit notation. Use "\\lim_{a \\to b}" to display limits.
f'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}`,
`% This is an example of matrix notation. Use "\\begin{matrix} ... \\end{matrix}" to start and end matrices, & to signify the next column, and \\\\ to signify the next row.
\\begin{matrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{matrix} \\begin{matrix} x \\\\ y \\\\ z \\\\ w \\end{matrix} = \\begin{matrix} x \\\\ y \\\\ z \\\\ w \\end{matrix}`,
`% This is an example of comments in LaTeXmos. Adding "%" to a line causes everything that comes after it to have no effect on the output.
% As you can see, there are multiple lines of comments here, but the only text that will be displayed is the equation at the bottom.
%
%
%
y = x^2`,
`% This is an example of switching between text and math mode. This example is meant to be run in the default math mode.
\\begin{text} This is an example of text mode. Inside text mode, you can also do \\begin{math} 1 + \\frac{1}{2} \\end{math} to create inline math, and vice versa. \\end{text}`,
`% This is an example of switching between text and math mode. This example is meant to be run with the text mode checkbox checked.
Stuff you type here will automatically be in text mode.
If you want to do math, you have to specify like so: \\begin{math} \\sqrt{2} \\end{math}.
Inside math mode, you can also do \\backslash\\backslash begin\\left\\{text\\right\\} and \\backslash\\backslash end\\left\\{text\\right\\} to create inline text, and vice versa.`
]


// Calculator setup.
var elt = document.getElementById('bernard');
var calculator = Desmos.GraphingCalculator(elt, {"graphpaper": false, "settingsMenu":false, "expressionsTopbar": true, "keypad": true});

// CodeMirror setup.
var myInput = CodeMirror(document.getElementById("input"), {
    value: getRandom(examples),
    mode:  "stex",
    lineWrapping: true,
    lineNumbers: true,
    theme: "monokai",
    placeholder: "Type LaTeX here..."
});
var myOutput = CodeMirror(document.getElementById("output"), {
    value: "",
    mode:  "stex",
    lineWrapping: true,
    lineNumbers: true,
    theme: "monokai",
    placeholder: "Output will appear here..."
});
function run() {
    const ml = document.getElementById("single-expression-multiline").checked;
    const la = document.getElementById("left-align").checked;
    const mode = document.getElementById("text-mode").checked? "text" : "math";
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

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}