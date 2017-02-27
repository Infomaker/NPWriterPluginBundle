export default {
    execute: function(params, context) {
        let character = params.text.substr(
            params.start,
            params.end - params.start
        )

        const rules = context.api.getConfigValue(
            'se.infomaker.charactertransformation',
            'rules'
        )

        if (!Array.isArray(rules) && rules.length < 1) {
            return
        }

        for (var n = 0; n < rules.length; n++) {
            if (!rules[n].char || !rules[n].to) {
                continue
            }

            if (character === rules[n].char) {
                let pos = rules[n].position
                if (typeof pos === 'number' && pos !== params.start) {
                    continue
                }

                replaceCharacter(params, context, rules[n])
                break
            }
        }

        function replaceCharacter(params, context, rule) {
            let toChar = null
            if (Array.isArray(rule.to)) {
                toChar = rule.to[0]
            }
            else {
                toChar = rule.to
            }

            context.editorSession.transaction(tx => {
                tx.setSelection({
                    type: 'property',
                    path: params.path,
                    containerId: 'body',
                    startOffset: params.start,
                    endOffset: params.end
                })
                tx.insertText(toChar)
            })
        }
    }
}
