import {NPFileProxy} from 'writer'

class XimpdfFileProxy extends NPFileProxy {
}

// to detect that this class should take responsibility for a fileNode
XimpdfFileProxy.match = function (fileNode) {
    return fileNode.imType === 'x-im/pdf'
}

export default XimpdfFileProxy