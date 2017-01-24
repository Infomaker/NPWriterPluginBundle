import { NilUUID } from 'writer'

class Author {

    constructor(uuid, name, nodeId) {
        this.uuid = uuid
        this.name = name
        this.nodeId = nodeId
        this.isLoaded = false
        this.isSimpleAuthor = NilUUID.isNilUUID(this.uuid) ? true : false
    }
}

export default Author