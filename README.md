# Template Expander

A simple program that expands tags.

## Features
  - Allows the user to provide files with tags that the program will expand.
  - Tags can be followed by ```'s``` or ```s```. The program produces a syntactically correct expansion.
  - Tags can be of type ```person``` or ```object```. Only tags of type ```person``` can by followed by the possesive ```'s```.

## Usage

The program expands all files in the ```in``` directory.
Text enclosed in ```{}``` and the optional ```'s``` and ```s``` immediatelly following the ```}``` symbol will be considered a tag.

The ```expand.js``` program copies the files in the ```in``` directory to the ```out``` directory and expands all tags.

The ```tagOps.js``` program allows the user to manage known tags.
If the input text does have an unknown tag, the ```expand.js``` program will crash.

The ```tags``` folder contains tag definitions.
It is not recommended to modify the content of the folder.
The user should use the ```tagOps.js``` program instead.


## Example

The ```in``` folder contains two example text files. 