import {BlockNode, DefaultDOMElement} from 'substance'
import {api} from 'writer'

class TeaserNode extends BlockNode {

    /**
     *  Pasted from
     *  @see {Ximteaser}
     *  Maybe find a better way to do it?
     */

    getImageFile() {
        if (!this.imageFile) {
            return
        }

        // FIXME: This should not be done if already done
        // Right now this is done multiple times.
        return this.document.get(this.imageFile)
    }

    getUrl() {
        let imageFile = this.getImageFile()
        if (imageFile) {
            return imageFile.getUrl()
        }
    }

    setSoftcropData(data, disableAutomaticCrop) {
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'crops'], data)
            tx.set([this.id, 'disableAutomaticCrop'], disableAutomaticCrop)
        })
    }

    handleDOMDocument(newsItemDOMDocument) {
        const dom = newsItemDOMDocument.documentElement,
            uuid = dom.getAttribute('guid'),
            uri = dom.querySelector('itemMeta > itemMetaExtProperty[type="imext:uri"]').getAttribute('value'),
            width = dom.querySelector('contentMeta > metadata > object > data > width'),
            height = dom.querySelector('contentMeta > metadata > object > data > height')

        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'uuid'], uuid)
            tx.set([this.id, 'uri'], uri)
            tx.set([this.id, 'width'], width ? Number(width.textContent) : null)
            tx.set([this.id, 'height'], height ? Number(height.textContent) : null)
        })
    }

    /**
     * Fetchpayload is used when inserting an existing image with an UUID into the teaser.
     * @param context
     * @param cb
     */
    fetchPayload(context, cb) {
        // const doc = api.editorSession.getDocument()
        const fileNode = this.getImageFile()

        // If the fileNode contains a sourceUUID it's an existing item
        // from the relation plugin
        // Create a newsml importer and use the same importer as when opening an article
        if (fileNode && fileNode.sourceUUID) {
            api.router.get('/api/newsitem/' + fileNode.uuid, {imType: 'x-im/article'})
                .then(response => api.router.checkForOKStatus(response))
                .then(response => response.text())
                .then((xmlString) => {

                    // Create a default DOMElement for the image Newsitem
                    const imageNewsItemDocument = DefaultDOMElement.parseXML(xmlString)
                    const imageNewsItem = imageNewsItemDocument[0]

                    // Find the object element in the newsitem
                    const width = imageNewsItem.find('contentMeta > metadata > object > data > width')
                    const height = imageNewsItem.find('contentMeta > metadata > object > data > height')

                    let node = {}
                    node.uri = imageNewsItem.find('itemMetaExtProperty[type="imext:uri"]').attr('value')
                    node.width = Number(width.textContent)
                    node.height = Number(height.textContent)

                    cb(null, node)
                })
                .catch((e) => {
                    cb(e)
                })
        }
    }
}

TeaserNode.isResource = false
TeaserNode.define({

    type: 'ximteaser',
    dataType: {type: 'string', optional: false},
    imageFile: {type: 'file', optional: true},
    uuid: {type: 'string', optional: true},
    uri: {type: 'string', optional: true},
    title: {type: 'text', optional: false, default: ''},
    subject: {type: 'string', optional: false, default: ''},
    text: {type: 'string', optional: false, default: ''},

    width: {type: 'number', optional: true},
    height: {type: 'number', optional: true},
    crops: {type: 'object', default: []},
    disableAutomaticCrop: {type: 'boolean', optional: true, default: false}
})

export default TeaserNode
