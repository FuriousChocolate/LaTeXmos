const examples = [
{
    latex: `% This is an example of a multiline display. Please check the multiline box and optionally the left-align box to see it in action.\nax^2 + bx + c = 0\nx^2 + \\frac{b}{a} + \\frac{c}{a} = 0\nx^2 + \\frac{b}{a}x = -\\frac{c}{a}\nx^2 + 2\\frac{b}{2a}x + \\(\\frac{b}{2a}\\)^2 = \\(\\frac{b}{2a}\\)^2 - \\frac{c}{a}\n\\(x + \\frac{b}{2a}\\)^2 = \\frac{b^2}{4a^2} - \\frac{4ac}{4a^2}\nx + \\frac{b}{2a} = \\frac{\\pm \\sqrt{b^2 - 4ac}}{2a}\nx = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`,
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
    latex: `% This is an example of switching between text and math mode. This example is meant to be run in the default math mode.\n\\text{ This is an example of text mode. }\n\\text{Inside text mode, you can also do $ 1 + \\frac{1}{2} $} \n\\text{to create inline math, and vice versa. }`,
    settings: {
        ml: true,
        la: true,
        mode: "math"
    }
},
{
    latex: `% This is an example of switching between text and math mode. This example is meant to be run with the text mode checkbox checked.\n\n% Note that to display math in text node, $$ are required around the expression.\nHere is an example of a double integral:\n$\\iint_{a}^{b}f(x)dx$\nAnd this is a limit:\n$\\lim_{h \\to 0}\\(\\frac{f(x + h) - f(x)}{h}\\) = f'(x)$`,
    settings: {
        ml: true,
        la: true,
        mode: "text"
    }
},
{
    latex: `% This is an example of some basic LaTeXmos replacements.\n% Create auto-resize brackets with \\( instead of \\left( and \\) instead of right. Also works for [] and {}.\n\\( \\frac{a}{b} \\) = \\[ \\frac{a}{b} \\] = \\{ \\frac{a}{b} \\}\n% Use \\implies and \\iff to draw arrows\n\\( a \\iff b \\) \\text{ and } \\( b \\iff c \\) \\implies \\( a \\iff c \\) \n% use \\dots to draw dots at the bottom and \cdots to draw dots in the middle.\n\\mathbb{Z} = \\{\\dots, -2, -1, 0, 1, 2, \\dots\\}\n100! = 100 \\times 99 \\times \\cdots \\times 2 \\times 1\n% use \\zwsp to draw zero width spaces. Useful for filling empty boxes in integrals and sums. Compare the following two:\n\\sum_{\\zwsp}^{\\zwsp} \\text{ vs. } \\sum`,
    settings: {
        ml: true,
        la: true,
        mode: "math"
    }
}
]