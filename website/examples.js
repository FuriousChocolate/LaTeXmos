const examples = [
{
    latex: `% This is an example of a multiline display. Please check the multiline box and optionally the left-align box to see it in action.\nax^2 + bx + c = 0\nx^2 + \\frac{b}{a} + \\frac{c}{a} = 0\nx^2 + \\frac{b}{a}x = -\\frac{c}{a}\nx^2 + 2\\frac{b}{2a}x + \\left(\\frac{b}{2a}\\right)^2 = \\left(\\frac{b}{2a}\\right)^2 - \\frac{c}{a}\n\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{b^2}{4a^2} - \\frac{4ac}{4a^2}\nx + \\frac{b}{2a} = \\frac{\\pm \\sqrt{b^2 - 4ac}}{2a}\nx = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`,
    settings: {
        ml: true,
        la: true,
        mode: "math"
    }
},
{
    latex: `% This is an example of limit notation. Use "\\lim_{a \\to b}" to display limits.\nf'(x) = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}`,
    settings: {
        ml: false,
        la: false,
        mode: "math"
    }
},
{
    latex: `% This is an example of matrix notation. Use "\\begin{matrix} ... \\end{matrix}" to start and end matrices, "&" to signify the next column, and "\\\\" to signify the next row.\n\\begin{matrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{matrix} \\begin{matrix} x \\\\ y \\\\ z \\\\ w \\end{matrix} = \\begin{matrix} x \\\\ y \\\\ z \\\\ w \\end{matrix}`,
    settings: {
        ml: false,
        la: false,
        mode: "math"
    }
},
{
    latex: `% This is an example of comments in LaTeXmos. Adding "%" to a line causes everything that comes after it to have no effect on the output.\n% As you can see, there are multiple lines of comments here, but the only text that will be displayed is the equation at the bottom.\n%\n%\n%\ny = x^2`,
    settings: {
        ml: false,
        la: false,
        mode: "math"
    }
},
{
    latex: `% This is an example of switching between text and math mode. This example is meant to be run in the default math mode.\n\\begin{text} This is an example of text mode. Inside text mode, you can also do \\begin{math} 1 + \\frac{1}{2} \\end{math} to create inline math, and vice versa. \\end{text}`,
    settings: {
        ml: false,
        la: false,
        mode: "math"
    }
},
{
    latex: `% This is an example of switching between text and math mode. This example is meant to be run with the text mode checkbox checked.\nStuff you type here will automatically be in text mode.\nIf you want to do math, you have to specify like so: \\begin{math} \\sqrt{2} \\end{math}.\nInside math mode, you can also do \\backslash\\backslash begin\\left\\{text\\right\\} and \\backslash\\backslash end\\left\\{text\\right\\} to create inline text, and vice versa.`,
    settings: {
        ml: true,
        la: true,
        mode: "text"
    }
}
]