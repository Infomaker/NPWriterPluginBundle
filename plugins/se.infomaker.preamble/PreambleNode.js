const {TextBlock} = substance

class PreambleNode extends TextBlock {}

PreambleNode.type = 'preamble'
PreambleNode.define({
    "id": {type: 'string'}
})

export default PreambleNode