import {NilUUID, idGenerator, api} from 'writer'
import Author from './Author'

export default {
    type: 'ximimage',
    tagName: 'object',

    matchElement: function (el) {
        return el.is('object') && el.attr('type') === 'x-im/image'
    },

    /**
     *
     * @param el
     * @param node
     * @param {NewsMLImporter} converter
     * @param {bool} newsItemConversion If the converter is used to convert a newsItem for a image (metadata from repository)
     */
    import: function (el, node, converter, newsItemConversion) {

        const objectElementId = el.attr('id')

        // Import link - base data
        var linkEl = el.find('links>link')

        let imageFile = {
            id: idGenerator(),
            type: 'npfile',
            imType: 'x-im/image',
            parentNodeId: objectElementId
        }

        if (el.attr('uuid')) {
            imageFile.uuid = el.attr('uuid')
        }

        if (linkEl && linkEl.attr('uri')) {
            node.uri = linkEl.attr('uri')
        }

        if (linkEl && linkEl.attr('url')) {
            imageFile.url = linkEl.attr('url')
        }

        converter.createNode(imageFile)
        node.imageFile = imageFile.id
        node.uuid = el.attr('uuid')

        let dataEl
        if (newsItemConversion) {
            dataEl = el.find('data')
        } else {
            dataEl = el.find(':scope>links>link>data')
        }
        // Import data


        node.caption = ''
        node.alttext = ''
        node.credit = ''
        node.alignment = ''
        node.disableAutomaticCrop = false

        if (dataEl) {
            dataEl.children.forEach(function (child) {
                if (child.tagName === 'text') {
                    node.caption = converter.annotatedText(child, [node.id, 'caption']);
                }

                if (child.tagName === 'alttext') {
                    node.alttext = converter.annotatedText(child, [node.id, 'alttext']);
                }

                if (child.tagName === 'credit') {
                    node.credit = converter.annotatedText(child, [node.id, 'credit']);
                }

                if (child.tagName === 'alignment') {
                    node.alignment = child.text();
                }

                if (child.tagName === 'width') {
                    node.width = parseInt(child.text(), 10)
                }

                if (child.tagName === 'height') {
                    node.height = parseInt(child.text(), 10)
                }

                if (child.tagName === 'disableAutomaticCrop') {
                    node.disableAutomaticCrop = (child.text() === 'true') ? true : false
                }
            })

            const flagsEl = dataEl.find(':scope>flags')
            if (flagsEl) {
                flagsEl.children.forEach(childEl => {
                    if (childEl.text() === 'disableAutomaticCrop') {
                        node.disableAutomaticCrop = true
                    }
                })
            }
        }

        // Import author links
        node.authors = []
        let authorLinks
        if (newsItemConversion) {
            authorLinks = el.find('links')
        } else {
            authorLinks = linkEl.find('links')
        }

        if (authorLinks) {
            node.authors = this.convertAuthors(node, authorLinks)
        }

        // Import softcrops
        if (!newsItemConversion) {
            let imageModule = api.getPluginModule('se.infomaker.ximimage', 'ximimagehandler')
            let softcrops = imageModule.importSoftcropLinks(
                linkEl.find('links')
            )

            if (softcrops.length) {
                node.crops = {
                    crops: softcrops
                }
            }
        }
    },

    convertAuthors: function(node, authorLinks) {
        let seen = new Map();

        return authorLinks.children.map(function (authorLinkEl) {
            if ("author" === authorLinkEl.getAttribute('rel')) {
                const author = new Author(authorLinkEl.getAttribute('uuid'), authorLinkEl.getAttribute('title'), node.id)
                const emailElement = authorLinkEl.find('email')
                if(emailElement) {
                    author.email = emailElement.textContent
                }
                return author
            } else {
                return null
            }
        }).filter((author) => {
            return author !== null
        }).filter((author) => {
            if (author.isSimpleAuthor) {
                return true
            }

            if (seen.get(author.uuid) !== undefined) {
                return false
            } else {
                seen.set(author.uuid, author)
                return true
            }
        })
    },

    export: function (node, el, converter) {
        var $$ = converter.$$;

        let fileNode = node.document.get(node.imageFile)

        el.removeAttr('data-id')
        el.attr({
            id: node.id,
            type: 'x-im/image',
            uuid: fileNode.uuid ? fileNode.uuid : NilUUID.getNilUUID()
        })


        var data = $$('data').append([
            $$('width').append(String(node.width)),
            $$('height').append(String(node.height)),
        ])

        if (node.disableAutomaticCrop) {
            data.append(
                $$('flags').append(
                    $$('flag').append('disableAutomaticCrop')
                )
            )
        }

        let fields = api.getConfigValue('se.infomaker.ximimage', 'fields') || []
        fields.forEach(obj => {
            let name = (obj.name === 'caption' ? 'text' : obj.name)

            if (!node[obj.name]) {
                data.append($$(name).append(''))
            }
            else if (obj.type === 'option') {
                data.append(
                    $$(name).append(node[obj.name])
                )
            }
            else {
                data.append(
                    $$(name).append(
                        converter.annotatedText([node.id, obj.name])
                    )
                )
            }
        })

        const imageLinks = $$('links')

        // Add crops to data
        if (node.crops) {
            let imageModule = api.getPluginModule('se.infomaker.ximimage', 'ximimagehandler')
            imageModule.exportSoftcropLinks($$, imageLinks, node.crops.crops)
        }


        var link = $$('link').attr({
            rel: 'self',
            type: 'x-im/image',
            uri: node.uri ? node.uri : '',
            uuid: fileNode.uuid ? fileNode.uuid : NilUUID.getNilUUID()
        }).append(data);


        if (node.authors.length) {
            const authorLink = node.authors.map((author) => {
                const authorLink = $$('link').attr({
                    rel: 'author',
                    uuid: author.uuid,
                    title: author.name,
                    type: 'x-im/author'
                })

                if(author.email) {
                    const data = $$('data')
                    const email = $$('email').append(author.email)
                    data.append(email)
                    authorLink.append(data)
                }
                return authorLink
            })

            imageLinks.append(authorLink)
        }

        if (imageLinks.children.length > 0) {
            link.append(imageLinks)
        }

        el.append(
            $$('links').append(
                link
            )
        )
    }
}
