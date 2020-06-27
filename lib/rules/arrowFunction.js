module.exports = {
    meta: {
        schema: [
            {
                error: {
                    type: 'string'
                }
            }
        ]
    },

    create(context) {
        let [schema] = context.options;
        let error = '';
        if (schema) {
            error = schema.error;
        }
        return {
            'ArrowFunctionExpression': function (node) {
                const body = node.body;
                if (body && body.type === 'CallExpression') {
                    let argument = body.arguments || [];
                    let params = node.params || [];
                    const length = argument.length;
                    // argument length less params length, check
                    if (argument.length <= params.length && argument.length !== 0) {
                        argument = argument.filter(item => item.type === 'Identifier');
                        // only have Identifier
                        if (argument.length === length) {
                            let eq = true;
                            for (let index = 0; index < argument.length; index++) {
                                for (let pIndex = 0; pIndex < params.length; pIndex++) {
                                    if (params[pIndex].name !== argument[index].name && eq) {
                                        eq = false
                                    }
                                }
                            }
                            if (eq) {
                                context.report({
                                    node,
                                    message: error || 'The parameters on both sides of the arrow function are equal, please simplify'
                                })
                            }
                        }
                    }
                }
            }
        }
    }
}