module.exports = {
    meta: {
        fixable: 'code',
        schema: [
            {
                camelCaseReg: {
                    type: 'string'
                },
                upCaseReg: {
                    type: 'string'
                },
                reactStateErr: {
                    type: 'string'
                },
                camelCaseErr: {
                    type: 'string'
                }
            }
        ]
    },
    create(context) {

        let [schema] = context.options;
        const { camelCaseReg, upCaseReg, reactStateErr, camelCaseErr } = schema;

        const CAMEL_CASE = camelCaseReg || '^[a-z]+([A-Z][a-z]{0,})*$';

        const UP_CASE = upCaseReg || '^[A-Z]+([_][A-Z]{0,})*$';

        /**
         * test name match
         * @see CAMEL_CASE
         * @param {string} name
         */
        function isCamelCase(name) {
            return new RegExp(CAMEL_CASE).test(name);
        }

        /**
         * test name match
         * @see UP_CASE
         * @param {string} name
         */
        function isUpCase(name) {
            return new RegExp(UP_CASE).test(name);
        }

        /**
         * report error message
         * @param node {AST} AST Node element
         * @param message {string} message
         * @param fixCallback
         */
        function report(node, message, fixCallback) {
            context.report({ node, message, fix: fixCallback })
        }

        /**
         * report camel case error message
         * @param node {AST} AST Node element
         * @param name {string} value name
         */
        function reportCamelCaseError(node, name) {
            let message = camelCaseErr || `Variable '${name}' must be camel case and match "${CAMEL_CASE}"`;
            message = message.replace(/\$value\$/g, name)
            report(node, message, (fixer)=>fixCamelCase(fixer, node, name));
        }

        function stringIsUpCase(str){
            return str >= 'A' && str <= 'Z'
        }

        function stringIsLowerCase(str) {
            return str >= 'a' && str <= 'z'
        }

        /**
         * fix name
         * @param fixer
         * @param node {AST}
         * @param value {string}
         */
        function fixCamelCase(fixer, node, value) {
            let str = value;
           try{
                // replace - _
                str.replace(/[-_]/, '');
                const first = str.substring(0,1);
                const sen = str.substring(1, 2);
                console.log(first, sen);
                console.log(stringIsLowerCase(first), )
                if (stringIsUpCase(first)){
                    if (stringIsUpCase(sen)){
                        str = str.replace(/([A-Z])/g,"_$1").toLocaleUpperCase().substr(1);
                    }else {
                        str = first.toLocaleLowerCase() + str.substr(1);
                    }
                }
            }catch (e) {
            }
            return  fixer.replaceText(node, str);
        }

        /**
         * check function params
         * @param params {Array}
         */
        function checkFunctionParams(params) {
            for (let index = 0; index < params.length; index++) {
                const value = params[index];
                if ([paramsList.includes(value.type)]){
                    if (value.left && value.left.type === 'Identifier' && !isCamelCase(value.left.name)){
                        reportCamelCaseError(value.left, value.left.name);
                        continue;
                    }
                    if (value.name && !isCamelCase(value.name)){
                        reportCamelCaseError(value, value.name);
                    }
                }
            }
        }

        // no check type, value maybe function
        const valueExcList = ['ArrowFunctionExpression', 'CallExpression', 'FunctionExpression'];

        const functionList = ['FunctionExpression', 'ArrowFunctionExpression'];

        const paramsList = ['Identifier', 'AssignmentPattern'];

        return {
            "MethodDefinition": function (node) {
                if (node.key.type === 'Identifier') {
                    const fnName = node.key.name;
                    if (!isCamelCase(fnName)) {
                        reportCamelCaseError(node.key, fnName);
                    }
                    // check function params
                    if (functionList.includes(node.value && node.value.type)){
                        checkFunctionParams(node.value.params || [])
                    }
                }
            },
            "VariableDeclaration": function (node) {
                const values = node.declarations || [];
                for (let index = 0; index < values.length; index++) {
                    const value = values[index];
                    // must left is value right is
                    if (value.type === 'VariableDeclarator' && !valueExcList.includes(value.init.type)) {
                        const name = value.id.type === 'Identifier' ? value.id.name : '';
                        if (name && !isCamelCase(name) && !isUpCase(name)) {
                            reportCamelCaseError(value.id, name);
                        }
                    }
                }
            },
            'ExpressionStatement': function (node) {
                if (node.expression && node.expression.type === 'AssignmentExpression') {
                    const expression = node.expression;
                    const left = expression.left;
                    const right = expression.right;
                    const leftName = left.property.name;
                    const isReactState = left.object.type === 'ThisExpression';
                    if (!isCamelCase(leftName)) {
                        reportCamelCaseError(left.property, leftName);
                    }
                    // check react state value
                    if (isReactState && right.type === 'ObjectExpression' && leftName === 'state') {
                        const rightProperties = right.properties || [];
                        for (let index = 0; index < rightProperties.length; index++) {
                            const element = rightProperties[index];
                            if (element.type === 'Property' && element.key && element.key.type === 'Identifier') {
                                if (!isCamelCase(element.key.name)) {
                                    let message = reactStateErr || `react state value '${element.key.name}' must be camel case amd match '${CAMEL_CASE}'`
                                    message = message.replace(/\$value\$/g, element.key.name);
                                    report(element.key, message, (fixer)=> fixCamelCase(fixer, element.key, element.key.name))
                                }
                            }
                        }
                    }
                }
            },
            'ArrowFunctionExpression':function (node) {
                checkFunctionParams(node.params || [])
            }
        }
    }
}