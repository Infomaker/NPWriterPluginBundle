const {TextBlock} = substance

class PreambleNode extends TextBlock {}

PreambleNode.define({
    "id": {type: 'string'}
})

export default PreambleNode