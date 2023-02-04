# LaTeXmos
Converts LaTeX that is normally not in Desmos (such as mutiline expressions, limits, matrices, etc.) into LaTeX that can be pasted into a Desmos expression line.

## Usage
```node LaTeX_to_Desmos.js [-h] [-s] [-ml] ["LaTeX goes here"]```

download ```LaTeX_to_Desmos.js``` and make an ```input.txt``` file in the same directory as it. Run ```node LaTeX_to_Desmos.js``` and you will see an output in terminal. Paste this into Desmos and you're done! 

### Flags
The -h flag displays the help menu.

The -s flag allows you to use a LaTeX string as input instead of a file named ```input.txt```. 

The -ml flag makes it so that when you paste into Desmos, you will have multiple expression lines instead of a single expression with all of the lines squished into it. This flag is **highly reccomended** as having all of your lines in one expression can become very laggy.
