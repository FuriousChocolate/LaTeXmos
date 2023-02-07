
// Converts a latex string into a desmos string.
function convert(data, SINGLE_EXPRESSION_MULTILINE, LEFT_ALIGN, DEFAULT_MODE) {

    let lines = data.split("\n");

    // If default mode is text mode, wrap each line in text mode.  Otherwise math is on by default.
    if (DEFAULT_MODE === "text") {
        lines = lines.map((line) => "\\mathrm{" + line + "}");
    }

    // Replaces limits and matrices in each line and switches modes properly.
    for (let line in lines) {
        lines[line] = replaceMatrices(replaceLimits(replaceModes(lines[line], DEFAULT_MODE)));
    }
    
    if (!SINGLE_EXPRESSION_MULTILINE) {
        return lines.join("\n");
    }
    // Wraps each line in black.
    lines = lines.map((line) => "\\textcolor{#000}{" + line + "}")

    if (LEFT_ALIGN) {
        for (let i = 0; i < lines.length; i++) {
            for (let j = 0; j < lines.length; j++) {
                if (j === i) continue;
                lines[i] += replaceMatrices(replaceLimits(data.split("\n")[j], false), false);
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

function replaceModes(line, DEFAULT_MODE) {
    let operations = [DEFAULT_MODE];
    let chunks = [{latex: "", mode: DEFAULT_MODE}];
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
    ).join("");
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
            if (i > 2) console.log(split[i].match(/[a-zA-Z0-9]/), split[i - 1] === "{", split[i - 2] === "begin", split[i - 3].includes("\\"))
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