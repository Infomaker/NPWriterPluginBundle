import { PropertyAnnotation, Fragmenter } from 'substance'

export default (nodeType) => {
    class Node extends PropertyAnnotation {}

    Node.schema = {
        type: nodeType
    }

    // in presence of overlapping annotations will try to render this as one element
    Node.fragmentation = Fragmenter.SHOULD_NOT_SPLIT
    Node.autoExpandRight = false

    return Node
}
