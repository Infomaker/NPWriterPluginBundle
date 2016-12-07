import {NPFileProxy} from 'writer'

class XimimageFileProxy extends NPFileProxy {
}

// to detect that this class should take responsibility for a fileNode
XimimageFileProxy.match = function (fileNode) {
    return fileNode.imType === 'x-im/image'
}

export default XimimageFileProxy