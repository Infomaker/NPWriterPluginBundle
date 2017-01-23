import { jxon, api, NilUUID, lodash } from 'writer'


class Author {

    constructor(uuid, name, nodeId) {
        this.uuid = uuid
        this.name = name
        this.nodeId = nodeId
    }

    isSimpleAuthor() {
        if (NilUUID.isNilUUID(this.uuid)) {
            return true
        }
        return false
    }

    fetchAuthorConcept() {
        return new Promise((resolve, reject) => {
            api.router.getConceptItem(this.uuid, 'x-im/author')
                .then((dom) => {
                    const conceptXML = dom.querySelector('concept')
                    const linksXML = dom.querySelector('itemMeta links')
                    const jsonFormat = jxon.build(conceptXML)

                    if (linksXML) {
                        this.links = jxon.build(linksXML)
                    }
                    this.conceptItem = jsonFormat
                    this.name = jsonFormat.name
                    this.email = this.findAttribute(jsonFormat, 'email')
                    this.isLoaded = true

                    resolve(this)

                })
                .catch((e) => {
                    console.error("Error fetching author", e)
                    reject(e)
                })
        })

    }
    findAttribute(object, attribute) {
        var match;

        function iterateObject(target, name) {
            Object.keys(target).forEach(function (key) {
                if (lodash.isObject(target[key])) {
                    iterateObject(target[key], name);
                } else if (key === name) {
                    match = target[key];
                }
            })
        }

        iterateObject(object, attribute)

        return match ? match : undefined;
    }
}

export default Author