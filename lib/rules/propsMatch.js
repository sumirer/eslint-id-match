module.exports = {
    meta: {
        fixable: 'code',
        schema: [
            {
                camelCaseReg: {
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
        const {camelCaseReg, camelCaseErr} = schema;

        const CAMEL_CASE = camelCaseReg || '^[a-z]+([A-Z][a-z]{0,})*$';


        /**
         * test name match
         * @see CAMEL_CASE
         * @param {string} name
         */
        function isCamelCase(name) {
            return new RegExp(CAMEL_CASE).test(name);
        }


        /**
         * report error message
         * @param node {ASTNode} AST Node element
         * @param message {string} message
         * @param fixCallback
         */
        function report(node, message, fixCallback) {
            context.report({node, message, fix: fixCallback})
        }

        /**
         * report camel case error message
         * @param node {ASTNode} AST Node element
         * @param name {string} value name
         */
        function reportCamelCaseError(node, name) {
            let message = camelCaseErr || `props name '${name}' must be camel case and match "${CAMEL_CASE}"`;
            message = message.replace(/\$value\$/g, name)
            report(node, message, (fixer) => fixCamelCase(fixer, node, name));
        }

        function stringIsUpCase(str) {
            return str >= 'A' && str <= 'Z'
        }

        /**
         * fix name
         * @param fixer
         * @param node {ASTNode}
         * @param value {string}
         */
        function fixCamelCase(fixer, node, value) {
            let str = value;
            try {
                // replace - _
                str.replace(/[-_]/, '');
                const first = str.substring(0, 1);
                if (stringIsUpCase(first)) {
                    str = first.toLocaleLowerCase() + str.substr(1);
                }
            } catch (e) {
            }
            return fixer.replaceText(node, str);
        }

        return {
            'JSXAttribute': function (node) {
                if (node.name.type === 'JSXIdentifier' && !isCamelCase(node.name.name)) {
                    reportCamelCaseError(node.name, node.name.name)
                }
            }
        }
    }
}