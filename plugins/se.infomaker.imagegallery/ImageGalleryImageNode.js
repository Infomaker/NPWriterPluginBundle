import {api, jxon, lodash as _, NilUUID} from 'writer'
import {BlockNode} from 'substance'

class ImageGalleryImageNode extends BlockNode {

    static _isEqual(author, other) {

        if (author === null || author === undefined) {
            return false
        }

        if (other === null || other === undefined) {
            return false
        }

        if (author.isSimpleAuthor) {
            return other.name === author.name
        } else {
            return other.uuid === author.uuid
        }
    }

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

    fetchSpecifiedUrls(fallbacks) {
        let imageFile = this.getImageFile()
        if (!imageFile) {
            return Promise.reject('No image file available')
        }

        if (!imageFile.proxy) {
            return Promise.reject('No image file available')
        }

        return imageFile.proxy.fetchSpecifiedUrls(fallbacks)
    }

    addAuthor(author) {
        const authors = this.authors
        let result = authors.find((item) => ImageGalleryImageNode._isEqual(item, author))

        if (result !== undefined) {
            // Do not add author is it already exist
            throw new Error('Cannot add selected author to list of authors due to: Author already exists in list')
        }

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
        if (!author.isSimpleAuthor) {
            this.updateAuthorFromConcept(author)
        }
    }

    setAuthors(authors) {
        api.editorSession.transaction((tx) => {
            tx.set([this.id, 'authors'], authors)
        })
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
                    console.error('Error fetching author', e)
                    reject(e)
                })
        })

    }

    findAttribute(object, attribute) {
        let match

        function iterateObject(target, name) {
            Object.keys(target).forEach(function(key) {
                if (_.isObject(target[key])) {
                    iterateObject(target[key], name)
                } else if (key === name) {
                    match = target[key]
                }
            })
        }

        iterateObject(object, attribute)

        return match ? match : undefined
    }

    /**
     * Takes all authors available on the node and loads the conceptItem for this authors
     *  When all authors is fetched the nodes authors property is updated
     */
    fetchAuthorsConcept() {
        const authors = this.authors
        const authorsLoadPromises = this.authors.map((author) => {
            if (!author.isSimpleAuthor && author.isLoaded === false) {
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
                }, {history: false})
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
                    if (author.uuid === updatedAuthor.uuid) {
                        return author
                    }
                    return undefined
                })

                if (authorObject) {
                    const index = authors.indexOf(authorObject)
                    authors[index] = updatedAuthor
                    api.editorSession.transaction((tx) => {
                        tx.set([this.id, 'authors'], authors)
                    }, {history: false})
                }
            })
    }
}

ImageGalleryImageNode.define({
    type: 'imagegalleryimage',
    imageFile: {type: 'file', optional: true},
    authors: {type: 'array', default: []},
    caption: {type: 'string', default: ''},
})

export default ImageGalleryImageNode
