import { PropertyAnnotation, Fragmenter } from 'substance';
import { types } from './config';

class Node extends PropertyAnnotation {}

Node.schema = {
    type: types.NODE
};

// in presence of overlapping annotations will try to render this as one element
Node.fragmentation = Fragmenter.SHOULD_NOT_SPLIT;
Node.autoExpandRight = false;

export default Node;
