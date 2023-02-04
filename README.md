# LaTeXmos
Converts LaTeX that is normally not in Desmos (such as mutiline expressions, limits, matrices, etc.) into LaTeX that can be pasted into a Desmos expression line.

## Usage
```node LaTeX_to_Desmos.js [-h] [-s] [-ml] ["LaTeX goes here"]```

download ```LaTeX_to_Desmos.js``` and make an ```input.txt``` file in the same directory as it. Run ```node LaTeX_to_Desmos.js``` and you will see an output in terminal. Paste this into Desmos and you're done! 

### Flags
The -h flag displays the help menu.

The -s flag allows you to use a LaTeX string as input instead of a file named ```input.txt```. 

The -ml flag makes it so that when you paste into Desmos, you will have multiple expression lines instead of a single expression with all of the lines squished into it. This flag is **highly reccomended** as having all of your lines in one expression can become very laggy.

### Syntax

Limits are written as ```\lim{a \to b}```. Matrices are written as ```\begin{matrix} a & b & c \\ d & e & f \\ h & i & j \end{matrix}```. To do multiple lines, simply input multiple lines. An example ```input.txt``` file might look like this:

```
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} 
e^{i \theta} = cos(\theta) + i sin(\theta)
\begin{matrix} 1 & 0 \\ 0 & 1 \end{matrix} \begin{matrix} x \\ y \end{matrix} = \begin{matrix} x \\ y \end{matrix}
f'(x) = \lim_{h \to 0} \frac{f(x+h)-f(x)}{h}
```
