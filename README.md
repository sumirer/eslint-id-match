# eslint-plugin-id-match

hyn_copyright

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





