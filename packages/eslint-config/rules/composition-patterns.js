/**
 * Custom ESLint Rules for Composition Patterns
 *
 * These rules enforce composition pattern best practices as defined in the
 * COMPOSITION_PATTERNS.md documentation.
 *
 * Based on the "Composition is all you need" principle from Slack Composer refactoring.
 */

/**
 * Rule: no-excessive-boolean-props
 *
 * Prevents components from having too many boolean configuration props.
 * Suggests using variant patterns or compound components instead.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
const noExcessiveBooleanProps = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow excessive boolean props in components. Use variant patterns or composition instead.',
            category: 'Best Practices',
            recommended: true,
        },
        schema: [
            {
                type: 'object',
                properties: {
                    max: {
                        type: 'number',
                        default: 2,
                    },
                    ignoreProps: {
                        type: 'array',
                        items: { type: 'string' },
                        default: ['disabled', 'required', 'readOnly', 'checked', 'defaultChecked'],
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            tooManyBooleanProps:
                'Component has {{count}} boolean props (max: {{max}}). Consider using variant patterns or compound components instead.',
            suggestVariantPattern:
                'Instead of multiple booleans, use a variant prop: variant?: "primary" | "secondary" | ...',
            suggestCompoundComponents:
                'Consider splitting this into compound components: <Component><Component.Variant /></Component>',
        },
    },

    create(context) {
        const options = context.options[0] || {}
        const max = options.max || 2
        const ignoreProps = new Set(
            options.ignoreProps || ['disabled', 'required', 'readOnly', 'checked', 'defaultChecked'],
        )

        return {
            // Match TypeScript interface declarations
            TSInterfaceDeclaration(node) {
                // Only check interfaces ending with 'Props'
                if (!node.id.name.endsWith('Props')) {
                    return
                }

                const booleanProps = node.body.body.filter(member => {
                    if (member.type !== 'TSPropertySignature') return false
                    if (!member.key || member.key.type !== 'Identifier') return false
                    if (ignoreProps.has(member.key.name)) return false

                    // Check if type annotation is boolean
                    const typeAnnotation = member.typeAnnotation?.typeAnnotation
                    if (!typeAnnotation) return false

                    return (
                        typeAnnotation.type === 'TSBooleanKeyword' ||
                        (typeAnnotation.type === 'TSUnionType' &&
                            typeAnnotation.types.some(
                                t => t.type === 'TSBooleanKeyword' || t.type === 'TSUndefinedKeyword',
                            ))
                    )
                })

                if (booleanProps.length > max) {
                    context.report({
                        node,
                        messageId: 'tooManyBooleanProps',
                        data: {
                            count: booleanProps.length,
                            max,
                        },
                        suggest: [
                            {
                                messageId: 'suggestVariantPattern',
                                fix: () => null, // This is a suggestion, not an auto-fix
                            },
                            {
                                messageId: 'suggestCompoundComponents',
                                fix: () => null,
                            },
                        ],
                    })
                }
            },
        }
    },
}

/**
 * Rule: prefer-object-mapping
 *
 * Suggests using object mapping instead of ternary operators for className conditions.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
const preferObjectMapping = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Prefer object mapping over ternary operators for conditional classNames',
            category: 'Best Practices',
            recommended: false,
        },
        messages: {
            useLiteralMapping:
                'Prefer object mapping for className conditions. Example: const variantClasses = { primary: "...", secondary: "..." }',
        },
    },

    create(context) {
        return {
            // Match: className={condition ? 'class-a' : 'class-b'}
            JSXAttribute(node) {
                if (node.name.name !== 'className' || !node.value || node.value.type !== 'JSXExpressionContainer') {
                    return
                }

                const expression = node.value.expression
                if (expression.type === 'ConditionalExpression') {
                    // Check if both consequent and alternate are string literals
                    if (
                        expression.consequent.type === 'Literal' &&
                        expression.alternate.type === 'Literal' &&
                        typeof expression.consequent.value === 'string' &&
                        typeof expression.alternate.value === 'string'
                    ) {
                        context.report({
                            node: expression,
                            messageId: 'preferObjectMapping',
                        })
                    }
                }
            },
        }
    },
}

/**
 * Rule: no-boolean-component-selection
 *
 * Discourages selecting components based on boolean flags.
 * Suggests using separate components or discriminated unions instead.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
const noBooleanComponentSelection = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Disallow component selection based on boolean flags. Use separate components instead.',
            category: 'Best Practices',
            recommended: false,
        },
        messages: {
            noBooleanComponentSelection:
                'Avoid selecting components with booleans. Use separate components or discriminated union variants instead.',
        },
    },

    create(context) {
        return {
            // Match: const Component = condition ? ComponentA : ComponentB
            VariableDeclarator(node) {
                if (
                    node.init &&
                    node.init.type === 'ConditionalExpression' &&
                    node.id.type === 'Identifier' &&
                    /^[A-Z]/.test(node.id.name)
                ) {
                    // Check if test is a simple boolean
                    if (node.init.test.type === 'Identifier') {
                        context.report({
                            node: node.init,
                            messageId: 'noBooleanComponentSelection',
                        })
                    }
                }
            },
        }
    },
}

// Export all rules
export const compositionRules = {
    'composition-patterns/no-excessive-boolean-props': noExcessiveBooleanProps,
    'composition-patterns/prefer-object-mapping': preferObjectMapping,
    'composition-patterns/no-boolean-component-selection': noBooleanComponentSelection,
}

// Export as ESLint plugin
export default {
    rules: {
        'no-excessive-boolean-props': noExcessiveBooleanProps,
        'prefer-object-mapping': preferObjectMapping,
        'no-boolean-component-selection': noBooleanComponentSelection,
    },
}
