const {BlockNode} = substance
import {api} from 'writer'
import {DefaultDOMElement} from 'substance'
class Ximimage extends BlockNode {

    getImageFile() {
        if (this.imageFile) {
            return this.document.get(this.imageFile)
        }
    }

    getUrl() {
        let imageFile = this.getImageFile()
        if (imageFile) {
            return imageFile.getUrl()
        }
    }

    setAlignment(alignment) {
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'alignment'], alignment)
        })
    }

    setSoftcropData(data) {
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'crops'], data);
        })
    }

    setAuthors(authors) {
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'authors'], authors)
        })
    }

    /**
     * This method is called from NPFile when file is uploaded.
     *
     * @todo Implement support for authors/byline
     *
     * @param {DOMDoucment} newsItemDOMDocument
     */
    handleDOMDocument(newsItemDOMDocument) {
        const dom = newsItemDOMDocument.documentElement,
            uuid = dom.getAttribute('guid'),
            uri = dom.querySelector('itemMeta > itemMetaExtProperty[type="imext:uri"]'),
            // TODO: Implement support for authors/byline
            // authors = dom.querySelectorAll('itemMeta > links > link[rel="author"]'),
            text = dom.querySelector('contentMeta > metadata > object > data > text'),
            credit = dom.querySelector('contentMeta > metadata > object > data > credit'),
            width = dom.querySelector('contentMeta > metadata > object > data > width'),
            height = dom.querySelector('contentMeta > metadata > object > data > height')

        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'uuid'], uuid ? uuid : '')
            tx.set([this.id, 'uri'], uri ? uri.attributes['value'].value : '')
            tx.set([this.id, 'text'], text ? text.textContent : '')
            tx.set([this.id, 'credit'], credit ? credit.textContent : '')
            tx.set([this.id, 'width'], width ? width.textContent : '')
            tx.set([this.id, 'height'], height ? height.textContent : '')
        }, {history: false})

    }

    /**
     * Fetchpayload is used when inserting an existing image with an UUID.
     * @param context
     * @param cb
     */
    fetchPayload(context, cb) {
        // const doc = api.editorSession.getDocument()
        const fileNode = this.getImageFile()

        // If the fileNode contains a sourceUUID it's an existing item
        // from the relation plugin
        // Create a newsml importer and use the same importer as when opening an article
        if (fileNode.sourceUUID) {
            api.router.get('/api/newsitem/' + fileNode.uuid, {imType: 'x-im/article'})
                .then(response => api.router.checkForOKStatus(response))
                .then(response => response.text())
                .then((xmlString) => {

                    // Create a newsML importer
                    const newsMLImporter = api.configurator.createImporter('newsml', {
                        api: api
                    })

                    // Get the converter for newsml
                    const newsMLConverters = context.converterRegistry.get('newsml')

                    // Get converter for ximimage
                    const ximImageConverter = newsMLConverters.get('ximimage')

                    // Create a default DOMElement for the image Newsitem
                    const imageNewsItemDocument = DefaultDOMElement.parseXML(xmlString)
                    const imageNewsItem = imageNewsItemDocument[0]

                    // Find the object element in the newsitem
                    let imageObjectElement = imageNewsItem.find('contentMeta > metadata > object[type="x-im/image"]')

                    let node = {}

                    // Parse only the object element as a defaultDOMElement
                    const defaultDOMImageNewsitem = DefaultDOMElement.parseXML(imageObjectElement.outerHTML)

                    // Run the ximimage import method
                    ximImageConverter.import(defaultDOMImageNewsitem, node, newsMLImporter, true)

                    const uri = imageNewsItem.find('itemMetaExtProperty[type="imext:uri"]').attr('value')
                    const uuid = imageNewsItem.attr('guid')

                    node.uri = uri
                    node.uuid = uuid
                    node.imageFile = fileNode.id

                    // Run callback that will update all the values on the ximimage node
                    cb(null, node)
                })
                .catch((e) => {
                    cb(e)
                })
        }


    }
}

Ximimage.isResource = true

Ximimage.define({
    type: 'ximimage',
    uuid: {type: 'string', optional: true},
    uri: {type: 'string', optional: true},
    imageFile: {type: 'file'},
    width: {type: 'number', optional: true},
    height: {type: 'number', optional: true},

    errorMessage: {type: 'string', optional: true},
    crops: {type: 'object', default: []},
    authors: {type: 'array', default: []},

    // Semi configurable, optional, fields
    caption: {type: 'string', default: ''},
    alttext: {type: 'string', optional: true},
    credit: {type: 'string', optional: true},
    alignment: {type: 'string', optional: true}
})

export default Ximimage
