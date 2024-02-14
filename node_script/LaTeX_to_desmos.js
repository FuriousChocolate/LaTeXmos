// Welcome to LaTeXmos! FuriousChocolate - 2023.

/*
*
* WARNING: This file is currently (Feb 2024) outdated. Please use the latest version found in convert.js.
*
*
*
*
*
*/
// If you want your lines to be in separate expressions, use the -ml flag.
let SINGLE_EXPRESSION_MULTILINE = true;
// If you would like to use a string as an input, use the -s flag.
let STRING_INPUT = false;
// Getting the input and making sure it's valid.
if (process.argv.length > 5) {
    console.log("\x1b[31mToo many arguments. Did you forget to put your LaTeX code in quotes?\x1b[0m");
    process.exit(1);
}
process.argv.forEach(val => {
    if (val === "-s")   STRING_INPUT = true;
    if (val === "-ml")  SINGLE_EXPRESSION_MULTILINE = false;
    if (val === "-h") {
        console.log(
            "\n\nWelcome to \x1b[32mLaTeX\x1b[31mmos\x1b[0m! This is a tool that converts \x1b[32mLaTeX\x1b[0m to \x1b[31mDesmos\x1b[0m usable LaTeX.\n\n" +
            "To use LaTeXmos, you need to have Node.js installed. You are reading this message right now, which means you were able to run something, and all hope isn't lost. You have Node.js.\n\n" +
            "Run the command \"node LaTeX_to_desmos.js\" to convert LaTeX code in a file named \"input.txt\" to Desmos usable LaTeX. You should see an output in terminal after running the command, simply select the whole thing and paste it into Desmos.\n\n" +
            "For more advanced usage, you may use it as following: \"node LaTeX_to_desmos.js [-h] [-s] [-ml] [\"LaTeX here\"]\".\n\nThe -h flag displays the help menu you are reading right now.\n\nThe -s flag uses the string at the end of the prompt as the input instead of input.txt.\n\nThe -ml flag separates each newline in your input into a new expression line in Desmos instead of putting it all in one line. The -ml flag is highly reccomended, as having too many lines in a single expression can cause a lot of lag.\n\n" +
            "To see more, visit the github page: https://github.com/FuriousChocolate/LaTeXmos\n\n" +
            "Any questions? Contact me on the unofficial Desmos discord server: https://discord.gg/gmrHtbQGBC at FuriousChocolate#1121"
        )
        process.exit(0);
    }
});
if (2 + !SINGLE_EXPRESSION_MULTILINE + 2 * STRING_INPUT !== process.argv.length) {
    console.log("\x1b[31mToo few arguments. If you use the -s flag, you need to add LaTeX code in quotes at the end.\x1b[0m");
    process.exit(1);
}
if (STRING_INPUT && (process.argv.at(-1) === "-s" || process.argv.at(-1) === "-ml")) {
    console.log("\x1b[31mYou used the -s flag, but LaTeXmos couldn't find ant LaTeX code in quotes at the end.\x1b[0m");
    process.exit(1);
}

// Input.
let input;
if (STRING_INPUT) {
    input = process.argv.at(-1);
}
else {
    fs = require('fs');
    input = fs.readFileSync("input.txt", "utf8");
}

// Converts input to Desmos usable LaTeX.
const output = convert(input);

// Logs the output.
console.log(output);


function convert(data) {

    let lines = data.split("\n");

    // Replaces limits and matrices in each line.
    for (let line in lines) {
        lines[line] = replaceMatrices(replaceLimits(lines[line]));
    }
    
    if (!SINGLE_EXPRESSION_MULTILINE) {
        return lines.join("\n");
    }
    // Wraps each line in black.
    lines = lines.map((line) => "\\textcolor{#000}{" + line + "}")
    
    // Left aligns.
    for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines.length; j++) {
            if (j === i) continue;
            lines[i] += replaceMatrices(replaceLimits(data.split("\n")[j], false), false);
        }
    }
    
    // Adds binom wrappers for multiline.
    const final = "\\textcolor{transparent}{" + groupLines(lines) + "}";
    return final;
}

// Turns a list of lines into a single line of latex that displays as multiline.
function groupLines(lines) {
    let newLines = [];
    
    // Puts binoms on the lines in pairs of two, and if there's an odd number just put parentheses to line everything up.
    for (let i = 0; i < lines.length - (lines.length % 2); i++) {
        if (i % 2 === 0) {
            newLines.push("\\binom{" + lines[i] + "}{" + lines[i + 1] + "}");
        }
    }
    if (lines.length % 2 === 1) {
        newLines.push("\\left(" + lines[lines.length - 1] + "\\right)");
    }
    // Keep grouping until there's only one left.
    if (newLines.length === 1) {
        return newLines[0];
    } else {
        return groupLines(newLines);
    }
}

// Replaces all the \lim_{a \to b} in a line with my verson of a desmos displayable limit.
function replaceLimits(line, invisibleBinom = true) {
    for (let i = 0; i < line.length; i++) {
        if (i > line.length - 4) break;
        if (line.slice(i, i + 4) === "\\lim") {
            let firstHalf = "";
            let secondHalf = "";
            let isFirstHalf = true;
            let j = i + 6;
            let openCount = 1;
        
            while (true) {
                if (line[j] === undefined) break;
                if (line[j] === "{") openCount++;
                if (line[j] === "}") openCount--;
                if (openCount === 0) break;
                if (openCount === 1 && line.slice(j, j + 3) === "\\to") {
                    isFirstHalf = false;
                    j += 3;
                }
                if (isFirstHalf)    firstHalf += line[j];
                else                secondHalf += line[j];
                j++;
            }
            let newString = "";
            if (invisibleBinom) {
                newString = "\\textcolor{transparent}{\\binom{\\textcolor{#000}{\\mathrm{lim}}}{\\textcolor{#000}{^{" + firstHalf + "\\to" + secondHalf + "}}}";
            }
            else {
                newString = "\\binom{\\mathrm{lim}}{^{" + firstHalf + "\\to" + secondHalf + "}";
            }
            // Replaces the items from i to j with the new string.
            line = line.slice(0, i) + newString + line.slice(j);
        }
    }
    return line;
}

// Replaces all the \begin{matrix} and \end{matrix} in a line with my verson of a desmos displayable matrix.
function replaceMatrices(line, invisibleBinom = true) {
    for (let i = 0; i < line.length; i++) {
        if (i > line.length - 14) break;
        if (line.slice(i, i + 14) === "\\begin{matrix}") {
            let j = i + 14;
            let openCount = 1;
            let matrix = [""];
            while (true) {
                if (line[j] === undefined) break;
                if (line.slice(j, j + 14) === "\\begin{matrix}") {
                    openCount++;
                }
                if (line.slice(j, j + 12) === "\\end{matrix}") {
                    openCount--;
                }
                if (openCount ===  1) {
                    if (line[j] === "\\" && line[j + 1] === "\\") {
                        matrix.push("");
                        j += 2;
                    }
                    if (line[j] === "&") {
                        matrix[matrix.length - 1] += "\\ \\ ";
                        j++;
                    }
                }
                if (openCount === 0) break;
                matrix[matrix.length - 1] += line[j];
                j++;
                
            }
            // Idk why this is here but it doesn't work when I remove it.
            j += 12;
            let newString = "";
            if (invisibleBinom) {
                // Wraps each matrix line in black
                matrix = matrix.map((line) => "\\textcolor{#000}{" + line + "}");
                newString = "\\left[\\textcolor{transparent}{" + groupLines(matrix) + "}\\right]";
            }
            else {
                newString = "\\left[" + groupLines(matrix) + "\\right]";
            }
            line = line.slice(0, i) + newString + line.slice(j);
        }
    }
    return line;
}
