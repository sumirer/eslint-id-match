/**
 * @fileoverview tt
 * @author eslint-id-match
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var ruleIdMatch = require("./rules/idMatch.js");
var rulePropsMatch = require("./rules/propsMatch.js")
var arrowRule = require("./rules/arrowFunction")

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = {
    'value-name-match': ruleIdMatch,
    'props-match': rulePropsMatch,
    'arrow-function': arrowRule
};


