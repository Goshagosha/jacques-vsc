# Jacques-vsc
Frontend extension for [Jacques](https://github.com/Goshagosha/Jacques)  
Inferring DSL-to-code translation rule sets from examples.

# Installation
VSCode command palette ( Ctrl + Shift + P ) -> Extensions: Install from VSIX  

# Use
VSCode command palette ( Ctrl + Shift + P ) -> Jacques: Start  

![](docs/jacques-csv.png)

**Important!**  
Jacques expects to recognize variable objects as such, to decompose queries into ASTs correctly. This means that first query almost always have to be a definition. We recommend something like this:  
DSL: `## data = load from 'file.csv'`  
Code: `data = pd.load_csv('file.csv')`   
  
Push example -> Process all -> Get rules  
  
Now you can give it more complex and long examples, using `data` as a dummy object. Try this next:  
DSL: `## on data | select columns 'SNo', 'ObservationDate' | head 10 | sort by 'Confirmed' ascending | show `  
Code: `print(data[['SNo', 'ObservationDate']].head(10).sort_values(['Confirmed'], axis='index', ascending=[True]))`  

"Export" button allows to export learned rules into a standalone NLDSL spec script.  
To completely reset inference progress, use "Reset".

# Statistics

## src/
| path | files | code | comment | blank | total |
| :--- | ---: | ---: | ---: | ---: | ---: |
| . | 11 | 540 | 50 | 93 | 683 |
| html | 1 | 29 | 0 | 3 | 32 |
| media | 2 | 104 | 0 | 17 | 121 |
| test | 3 | 33 | 33 | 13 | 79 |
| test/suite | 2 | 20 | 28 | 7 | 55 |

## webviews/
| path | files | code | comment | blank | total |
| :--- | ---: | ---: | ---: | ---: | ---: |
| . | 8 | 440 | 14 | 50 | 504 |
| components | 1 | 103 | 5 | 13 | 121 |
| pages | 1 | 5 | 0 | 2 | 7 |
| ui | 4 | 321 | 3 | 33 | 357 |

No tests or devdocumentation