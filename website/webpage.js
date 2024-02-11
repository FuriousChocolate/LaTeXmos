window.onload = setup;
var calculator, myInput, myOutput;
function setup() {
    // Calculator setup.
    var elt = document.getElementById('bernard');
    calculator = Desmos.GraphingCalculator(elt, {"graphpaper": false, "settingsMenu":false, "expressionsTopbar": true, "keypad": true});

    // CodeMirror setup.
    myInput = CodeMirror(document.getElementById("input"), {
        value: randomExample(),
        mode:  "stex",
        lineWrapping: true,
        lineNumbers: true,
        theme: "monokai",
        placeholder: "Type LaTeX here..."
    });
    myOutput = CodeMirror(document.getElementById("output"), {
        value: "",
        mode:  "stex",
        lineWrapping: true,
        lineNumbers: true,
        theme: "monokai",
        placeholder: "Output will appear here. You can copy and paste from here straight into desmos."
    });
}

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

// Examples
function randomExample() {
    const index = Math.floor(Math.random() * examples.length);
    document.getElementById("single-expression-multiline").checked = examples[index].settings.ml;
    document.getElementById("left-align").checked = examples[index].settings.la;
    document.getElementById("text-mode").checked = examples[index].settings.mode === "text";
    return examples[index].latex;
}