const {TextBlock} = substance

class FactbodyNode extends TextBlock {}

FactbodyNode.define({
    "id": {type: 'string'}
})

export default FactbodyNode