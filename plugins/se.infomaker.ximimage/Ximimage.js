import { jxon, api, lodash as _, NilUUID } from 'writer'
import { DefaultDOMElement, BlockNode } from 'substance'


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

    setSoftcropData(cropData, disableAutomaticCrop) {
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'crops'], cropData);
            tx.set([this.id, 'disableAutomaticCrop'], disableAutomaticCrop)
        })
    }

    setAuthors(authors) {
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'authors'], authors)
        })
    }

    /**
     * Returns a newsML importer
     * @returns {*}
     */
    getNewsMLImporter() {
        return api.configurator.createImporter('newsml', {
            api: api
        })

    }

    getXimImageConverter(context) {

        let converterRegistry = context.converterRegistry
        if(!converterRegistry) {
            converterRegistry = context.editorSession.converterRegistry
        }

        // Get the converter for newsml
        const newsMLConverters = converterRegistry.get('newsml')

        // Get converter for ximimage
        return newsMLConverters.get('ximimage')
    }

    /**
     * This method is called from NPFile when file is uploaded.
     *
     * @param {DOMDoucment} newsItemDOMDocument
     * @param context
     */
    handleDOMDocument(newsItemDOMDocument, context) {
        const newsItemDOMElement = DefaultDOMElement.parseXML(newsItemDOMDocument.documentElement.outerHTML)
        const dom = newsItemDOMDocument.documentElement,
            uuid = dom.getAttribute('guid'),
            uri = dom.querySelector('itemMeta > itemMetaExtProperty[type="imext:uri"]'),
            authors = newsItemDOMElement.find('itemMeta > links'),
            text = dom.querySelector('contentMeta > metadata > object > data > text'),
            credit = dom.querySelector('contentMeta > metadata > object > data > credit'),
            width = dom.querySelector('contentMeta > metadata > object > data > width'),
            height = dom.querySelector('contentMeta > metadata > object > data > height')

        let convertedAuthors = []
        if(authors) {
            const ximimageConverter = this.getXimImageConverter(context)

            // Uses the ximImageConverter to convert links to authors
            // Sets the authors-property on this node
            convertedAuthors = ximimageConverter.convertAuthors(this, authors)
        }

        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'uuid'], uuid ? uuid : '')
            tx.set([this.id, 'uri'], uri ? uri.attributes['value'].value : '')
            if (isUnset(this.caption)) {
                tx.set([this.id, 'caption'], text ? text.textContent : '')
            }
            if (isUnset(this.credit)) {
                tx.set([this.id, 'credit'], credit ? credit.textContent : '')
            }
            tx.set([this.id, 'width'], width ? Number(width.textContent) : '')
            tx.set([this.id, 'height'], height ? Number(height.textContent) : '')
            if (isUnset(this.authors)) {
                tx.set([this.id, 'authors'], convertedAuthors)
            }
        })

    }


    addAuthor(author) {
        const authors = this.authors
        authors.push(author)

        // First add the authors to the node
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'authors'], authors)
        })

        /*
            We the author is added we try to load the concept newsitem for this author.
            When concepts information is fetch we update the authors on the node yet again.
            Only fetch information for authors that has a uuid
         */
        if(!author.isSimpleAuthor) {
            this.updateAuthorFromConcept(author)
        }

    }

    removeAuthor(author) {
        const authors = this.authors
        for (let n = 0; n < authors.length; n++) {

            if (!NilUUID.isNilUUID(author.uuid) && authors[n].uuid === author.uuid) {
                authors.splice(n, 1)
                break
            }
            else if (NilUUID.isNilUUID(author.uuid) && authors[n].name === author.name) {
                authors.splice(n, 1)
                break
            }
        }
        // First add the authors to the node
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'authors'], authors)
        })
    }

    /**
     *
     * @param author
     * @returns {Promise}
     */
    fetchAuthorConcept(author) {
        return new Promise((resolve, reject) => {
            api.router.getConceptItem(author.uuid, 'x-im/author')
                .then((dom) => {
                    const conceptXML = dom.querySelector('concept')
                    const linksXML = dom.querySelector('itemMeta links')
                    const jsonFormat = jxon.build(conceptXML)

                    if (linksXML) {
                        author.links = jxon.build(linksXML)
                    }
                    author.name = jsonFormat.name
                    author.email = this.findAttribute(jsonFormat, 'email')
                    author.isLoaded = true

                    resolve(author)

                })
                .catch((e) => {
                    console.error("Error fetching author", e)
                    reject(e)
                })
        })

    }
    findAttribute(object, attribute) {
        let match

        function iterateObject(target, name) {
            Object.keys(target).forEach(function (key) {
                if (_.isObject(target[key])) {
                    iterateObject(target[key], name);
                } else if (key === name) {
                    match = target[key];
                }
            })
        }

        iterateObject(object, attribute)

        return match ? match : undefined;
    }

    /**
     * Takes all authors available on the node and loads the conceptItem for this authors
     *  When all authors is fetched the nodes authors property is updated
     */
    fetchAuthorsConcept() {
        const authors = this.authors
        const authorsLoadPromises = this.authors.map((author) => {
            if(!author.isSimpleAuthor && author.isLoaded === false) {
                return this.fetchAuthorConcept(author)
            } else {
                return null
            }
        }).filter((author) => {
            return author !== null
        })

        Promise.all(authorsLoadPromises)
            .then(() => {
                api.editorSession.transaction((tx) => {
                    tx.set([this.id, 'authors'], authors)
                }, { history: false })
            })
    }

    /**
     *
     * @param {Author} author
     */
    updateAuthorFromConcept(author) {
        const authors = this.authors

        this.fetchAuthorConcept(author)
            .then((updatedAuthor) => {
                const authorObject = authors.find((author) => {
                    if(author.uuid === updatedAuthor.uuid) {
                        return author
                    }
                    return undefined
                })

                if(authorObject) {
                    const index = authors.indexOf(authorObject)
                    authors[index] = updatedAuthor
                    api.editorSession.transaction((tx) => {
                        tx.set([this.id, 'authors'], authors)
                    }, { history: false })

                }

            })

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
            api.router.get('/api/newsitem/' + fileNode.uuid, { imType: 'x-im/article' })
                .then(response => api.router.checkForOKStatus(response))
                .then(response => response.text())
                .then((xmlString) => {

                    // Get converter for ximimage
                    const ximImageConverter = this.getXimImageConverter(context)
                    const newsMLImporter = this.getNewsMLImporter()

                    // Create a default DOMElement for the image Newsitem
                    const imageNewsItemDocument = DefaultDOMElement.parseXML(xmlString)
                    const imageNewsItem = imageNewsItemDocument[0]

                    // Find the object element in the newsitem
                    let imageObjectElement = imageNewsItem.find('contentMeta > metadata > object[type="x-im/image"]')

                    let node = {}
                    node.id = this.id

                    // Parse only the object element as a defaultDOMElement
                    const defaultDOMImageNewsitem = DefaultDOMElement.parseXML(imageObjectElement.outerHTML)

                    // Run the ximimage import method
                    ximImageConverter.import(defaultDOMImageNewsitem, node, newsMLImporter, true)

                    const uri = imageNewsItem.find('itemMetaExtProperty[type="imext:uri"]').attr('value')
                    const uuid = imageNewsItem.attr('guid')
                    const authorLinks = imageNewsItem.find('newsItem > itemMeta > links')

                    node.authors = ximImageConverter.convertAuthors(node, authorLinks)
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

function isUnset(field) {
    if (field === undefined || field === null) {
        return true;
    }

    if (_.isString(field) && field.trim() === "") {
        return true;
    }

    //noinspection RedundantIfStatementJS
    if (_.isArray(field) && field.length === 0) {
        return true;
    }

    return false;
}


Ximimage.isResource = true

Ximimage.define({
    type: 'ximimage',
    uuid: { type: 'string', optional: true },
    uri: { type: 'string', optional: true },
    imageFile: { type: 'file' },
    width: { type: 'number', optional: true },
    height: { type: 'number', optional: true },
    disableAutomaticCrop: { type: 'boolean', optional: true, default: false },
    errorMessage: { type: 'string', optional: true },
    crops: { type: 'object', default: [] },
    authors: { type: 'array', default: [] },

    // Semi configurable, optional, fields
    caption: { type: 'string', default: '' },
    alttext: { type: 'string', optional: true },
    credit: { type: 'string', optional: true },
    alignment: { type: 'string', optional: true }
})

export default Ximimage
