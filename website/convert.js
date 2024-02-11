
const MAX_LINES = 50;
// Converts a latex string into a desmos string.
function convert(data, SINGLE_EXPRESSION_MULTILINE, LEFT_ALIGN, DEFAULT_MODE) {
    let lines = data.split("\n");

    // Removes comments.
    lines = lines.map((line) => (line.split("%")[0]));
    // Removes empty lines.
    lines = lines.filter((line) => line !== "");

    // Stores the old lines for later in a new copy.
    const old_lines = lines.slice();

    // Replaces limits and matrices in each line and switches modes properly.
    for (let line in lines) {
        lines[line] = 
        replaceDoubleIntegrals(
            replaceMatrices(
                replaceLimits(
                    replaceParentheses(
                        replaceModes(
                            lines[line], DEFAULT_MODE
                        )
                    )
                )
            )
        );
        
    }
    if (!SINGLE_EXPRESSION_MULTILINE) {
        return lines.join("\n");
    }

    if (lines.length > MAX_LINES) {
        return "\\textcolor{#ff0000}{\\mathrm{ERROR:\\ Too\\ many\\ lines!\\ Max\\ is\\ " + MAX_LINES + "}}";
    }
    // Wraps each line in black.
    lines = lines.map((line) => "\\textcolor{#000}{" + line + "}")

    if (LEFT_ALIGN) {
        // Adds an invisible copy of every line to every other line. For example, if the lines were
        //   a
        //  bbb
        //   cc
        // To make it left aligned, it would become
        //  abbbcc
        //  bbbacc
        //  ccabbb
        // Where everything after the first characters are invisible.
        // This is very inefficient and I should probably change it.x
        for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines.length; j++) {
                if (j === i) continue;
                lines[i] += 
                replaceDoubleIntegrals(
                    replaceMatrices(
                        replaceLimits(
                            replaceParentheses(
                                replaceModes(
                                    old_lines[j], DEFAULT_MODE
                                )
                            )
                        , false)
                    , false)
                )
                
            }
        }
    }

    // Adds binom wrappers for multiline.
    return "\\textcolor{transparent}{" + groupLines(lines) + "}";
}



// Hashes a string into a number.
function hashCode(str) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
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

// Replaces all the \( and \) in a line with \left( and \right). Also replaces all the \[ and \] in a line with \left[ and \right] and all the \{ and \} in a line with \left\{ and \right\}.
function replaceParentheses(line) {
    // Makes sure only to replace things like \( if they are not already preceeded by \left or \right.
    for (let i = 0; i < line.length; i++) {
        if (line.slice(i, i + 2) === "\\(" && line.slice(i - 5, i) !== "\\left") {
            line = line.slice(0, i) + "\\left(" + line.slice(i + 2);
        }
        if (line.slice(i, i + 2) === "\\)" && line.slice(i - 6, i) !== "\\right") {
            line = line.slice(0, i) + "\\right)" + line.slice(i + 2);
        }
        if (line.slice(i, i + 2) === "\\[" && line.slice(i - 5, i) !== "\\left") {
            line = line.slice(0, i) + "\\left[" + line.slice(i + 2);
        }
        if (line.slice(i, i + 2) === "\\]" && line.slice(i - 6, i) !== "\\right") {
            line = line.slice(0, i) + "\\right]" + line.slice(i + 2);
        }
        if (line.slice(i, i + 2) === "\\{" && line.slice(i - 5, i) !== "\\left") {
            line = line.slice(0, i) + "\\left\\{" + line.slice(i + 2);
        }
        if (line.slice(i, i + 2) === "\\}" && line.slice(i - 6, i) !== "\\right") {
            line = line.slice(0, i) + "\\right\\}" + line.slice(i + 2);
        }
    }
    return line;
}

function replaceModes(line, DEFAULT_MODE) {
    if (DEFAULT_MODE === "text") {
        line = "\\mathrm{" + line + "}";
    }
    let operations = [DEFAULT_MODE];
    let chunks = [{latex: "", mode: DEFAULT_MODE}];

    // Replaces \math{ and } with \begin{math} and \end{math} and \text{ and } with \begin{text} and \end{text}
    // for (let i = 0; i < line.length; i++) {
    //     if(line.slice(i, i + 6) === "\\math{") {
    //         line = line.slice(0, i) + "\\begin{math}" + line.slice(i + 6);
    //     }
    //     let j = i + 1;
    //     let openCount = 1;
    //     while (true) {
    //         if (line[j] === undefined) break;
    //         if (line[j] === "{") openCount++;
    //         if (line[j] === "}") openCount--;
    //         if (openCount === 0) {
    //             line = line.slice(0, j) + "\\end{math}" + line.slice(j + 1);
    //             break;
    //         }
    //         j++;
    //     }
    //     if (line.slice(i, i + 6) === "\\text{") {
    //         line = line.slice(0, i) + "\\begin{text}" + line.slice(i + 6);
    //     }
    //     j = i + 1;
    //     console.log(line[j])
    //     openCount = 1;
    //     while (true) {
    //         if (line[j] === undefined) break;
    //         if (line[j] === "{") openCount++;
    //         if (line[j] === "}") openCount--;
    //         if (openCount === 0) {
    //             line = line.slice(0, j) + "\\end{text}" + line.slice(j + 1);
    //             break;
    //         }
    //         j++;
    //         console.log('...')
    //     }
    // }

    for (let i = 0; i < line.length; i++) {
        if (line.slice(i, i + 12) === "\\begin{text}") {
            operations.push("text");
            i += 12;
        }
        if (line.slice(i, i + 10) === "\\end{text}") {
            operations.pop();
            i += 10;
        }
        if (line.slice(i, i + 12) === "\\begin{math}") {
            operations.push("math")
            i += 12;
        }
        if (line.slice(i, i + 10) === "\\end{math}") {
            operations.pop();
            i += 10;
        }
        if (chunks.at(-1).mode !== operations.at(-1)) {
            chunks.push({latex: "", mode: operations.at(-1)});
        }
        if (i >= line.length) break;
        chunks[chunks.length - 1].latex += line[i];
    }
    // Zero width space black magic
    chunks = witchcraft(chunks);
    
    // replaces all spaces in text mode with "\ ".
    chunks = chunks.map(x => (x.mode === "text")?{latex: x.latex.replace(/ /g, "\\ "), mode: "text"}:x);
    
    return chunks.map(x => (x.mode === DEFAULT_MODE)?x.latex:
        (DEFAULT_MODE === "math")?"\\mathrm{" + x.latex + "}":
        "}" + x.latex + "\\mathrm{"
    ).join("").replace(/\\mathrm{}/g, "");
}

function witchcraft(chunks) {
    let newChunks = [];
    for (let chunk of chunks) {
        if (chunk.mode === "math") {
            newChunks.push(chunk);
            continue;
        }
        // Breaks the chunks latex into strings of alpanumeric characters and non-alphanumeric characters.
        let split = chunk.latex.split(/([a-zA-Z0-9]+)/);
        // For each string of characters, if it is alphanumeric and there isn't a backslash in the previous array element, add a zero width space.
        for (let i = 0; i < split.length; i++) {
            if ((i > 0 && split[i].match(/[a-zA-Z0-9]/) && !split[i - 1].includes("\\")) && !(i > 2 && split[i].match(/[a-zA-Z0-9]/) && split[i - 1] === "{" && (split[i - 2] === "begin" || split[i - 2] === "end") && split[i - 3].includes("\\"))) {
                split[i] = split[i].split("").join("\u200B");
            }
        }
        // Joins the array back into a string.
        chunk.latex = split.join("");

        newChunks.push(chunk);
    }

    return newChunks;
}

function replaceDoubleIntegrals(line) {
    for (let i = 0; i < line.length; i++) {
        // console.log(line.slice(i,i+5))
        if (line.slice(i,i+5) === "\\iint") {
            const firstHalf = line.slice(0, i - 1);
            const secondHalf = line.slice(i+5);
            line = firstHalf + "\\int_{​}^{​} \\int" + secondHalf;
        }
    }
    return line;
}