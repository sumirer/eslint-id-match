# eslint-plugin-id-match

* Check the naming in the project and standardize the naming (camel-case)
* Check the naming of functions and the variable names of functions and arrow functions
```
  reg = '^[a-z]+([A-Z][a-z]{0,})*$'
```
# example
```javascript
   
     // good
    function  handleTest(){
       ...
    }

    // bad
    function  HandleTest(){
      ...
    }
 
  class Test{
    constructor(){
        this.state = {
          // bad
          Value:'',
          // good
          value:''
        };
        // bad
        this.Test = ''
    }

    // good
    handleTest(value){
       ...
    } 

   // bad
    HandleTest(value){
       ...
    } 

  // bad
    handleTest(Value){
       ...
    }
  }
```
But the plug-in did not check the value function, arrow function and other undiscriminated objects
```javascript
  // right
  const TestFn = function() {
    ...
  }
   // right
  const TestFn = React.createContext();
  
  // right
  const TestFn = ()=>{
    ...
  }
```
## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-id-match`:

```
$ npm install eslint-plugin-id-match --save-dev
```


## Usage

Add `12` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "id-match"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "id-match/value-name-match":[
                    2,{
                        "camelCaseReg": "you test camel case reg",
                        "upCaseReg": "you test up case reg (if you don't need is, set '*' )",
                        "reactStateErr":"xxx ‘$value$’ xxx ($value$ will be replaced with value name)",
                        "camelCaseErr":"xxx '$value$' xxx ($value$ will be replaced with value name)"
                    }
                ]
    }
}
```

## Supported Rules

* Fill in provided rules here

#
[![NPM Stats](https://nodei.co/npm/eslint-plugin-id-match.png?downloads=true&downloadRank=true)](https://npmjs.org/package/eslint-plugin-id-match/)



