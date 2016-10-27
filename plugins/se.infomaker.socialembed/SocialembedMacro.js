export default {

    execute: function(params, context) {
        // var match = /(https?:\/\/([^\s]+))/.exec(params.text)
        let match = /abc/.exec(params.text)
        let editorSession = context.editorSession

        if (match) {
            editorSession.executeCommand('socialembed', {
                url: 'https://twitter.com/fraserspeirs/status/694515217666064385'
            })
            return true
        }
    }
}