import {Component} from 'substance'
import {lodash} from 'writer'

const find = lodash.find

class AuthorBaseComponent extends Component {
    /**
     * Get concept > definition with @role equal to parameter 'role'.
     *
     * @param role      Role that defines the definition, e.g 'drol:short'.
     * @param author    Optional. If not supplied author in state is used.
     * @returns {null}
     * @protected
     */
    getDefinition(role, author) {
        const source = author || this.state.author
        return this._getDefinition(role, source)
    }

    _getDefinition(role, author) {
        const collection = this._toArray(author.concept.definition)
        const definition = find(collection, (item) => item['@role'] === role)
        return definition ? definition.keyValue : null
    }

    /**
     * Get and concatenate itemMeta > itemMetaExtProperty for @type='firstName' and 'lastName'
     * in order to get author full name.
     *
     * @param author        Optional. If not supplied author in state is used.
     * @returns {string}
     * @protected
     */
    getFullName(author) {
        const source = author || this.state.author
        return this._getFullName(source)
    }

    _getFullName(author) {
        return this.getItemMetaExtProperty('imext:firstName', author) + ' ' + this.getItemMetaExtProperty('imext:lastName', author)
    }

    /**
     * Returns all itemMeta > links > link. If links does not exist, empty array is returned.
     *
     * @param author    Optional. If not supplied author in state is used.
     * @returns {*}
     * @protected
     */
    getItemMetaLinks(author) {
        const source = author || this.state.author
        return this._getItemMetaLinks(source)
    }

    _getItemMetaLinks(author) {
        if (author.itemMeta.links) {
            return this._toArray(author.itemMeta.links.link)
        }
        return []
    }

    /**
     * Get concept > metadata > object[@type] === 'x-im/contact-info' > data > [elementName].
     *
     * @param elementName   Name of element searched.
     * @param author        Optional. If not supplied author in state is used.
     * @returns {null}      String if match, otherwise null.
     * @protected
     */
    getDataElement(elementName, author) {
        const source = author || this.state.author
        return this._getDataElement(elementName, source)
    }

    _getDataElement(elementName, author) {
        if (author.concept.metadata) {
            const collection = this._toArray(author.concept.metadata.object)
            const metadataObject = find(collection, (item) => item['@type'] === 'x-im/contact-info')

            if (metadataObject && metadataObject.data) {
                return metadataObject.data[elementName]
            }
        }
        return null
    }

    /**
     * Get itemMeta > itemMetaExtProperty with @type equal to parameter 'type'.
     *
     * @param type      Attribute 'type' value searched for.
     * @param author    Optional. If not supplied author in state is used.
     * @returns {null}  String if match, otherwise null.
     * @protected
     */
    getItemMetaExtProperty(type, author) {
        const source = author || this.state.author
        return this._getItemMetaExtProperty(type, source)
    }

    _getItemMetaExtProperty(type, author) {
        const collection = this._toArray(author.itemMeta.itemMetaExtProperty)
        const property = find(collection, (item) => item['@type'] === type)
        return property ? property['@value'] : null
    }

    /**
     * Get itemMeta > links > link[@type] === [type] > @[attributeName].
     *
     * @param type          Type, i.e. attribute 'type' of link to search for.
     * @param attributeName Name of attribute to get value from.
     * @param author        Optional. If not supplied author in state is used.
     * @returns {null}      String if match, otherwise null.
     * @private
     */
    getItemMetaLinkAttribute(type, attributeName, author) {
        const source = author || this.state.author
        return this._getItemMetaLinkAttribute(type, attributeName, source)
    }

    _getItemMetaLinkAttribute(type, attributeName, author) {
        if (author.itemMeta && author.itemMeta.links) {
            const linkArray = this._toArray(author.itemMeta.links.link)
            const link = find(linkArray, (item) => item['@type'] === type)
            return link ? link['@' + attributeName] : null
        }
        return null
    }

    /**
     * Creates a data bearer object used for creating author links in article.
     *
     * If configuration flag appendAuthorDataToLink exists and is true, the created
     * object will contain all author properties, otherwise only name and email.
     *
     * @returns {object}
     * @private
     */
    createUpdateAuthorLinkObject(author) {
        const source = author || this.state.author

        const authorLinkObject = {
            name: this.getFullName(source)
        }

        const email = this.getDataElement('email', source)
        if (email) {
            authorLinkObject['email'] = email
        }

        if (this.context.api.getConfigValue('se.infomaker.ximauthor', 'appendAuthorDataToLink')) {
            const firstName = this.getItemMetaExtProperty('imext:firstName', source)
            if (firstName) {
                authorLinkObject['firstName'] = firstName
            }

            const lastName = this.getItemMetaExtProperty('imext:lastName', source)
            if (lastName) {
                authorLinkObject['lastName'] = lastName
            }

            const phone = this.getDataElement('phone', source)
            if (phone) {
                authorLinkObject['phone'] = phone
            }

            const facebookUrl = this.getItemMetaLinkAttribute('x-im/social+facebook', 'url', source)
            if (facebookUrl) {
                authorLinkObject['facebookUrl'] = facebookUrl
            }

            const twitterUrl = this.getItemMetaLinkAttribute('x-im/social+twitter', 'url', source)
            if (twitterUrl) {
                authorLinkObject['twitterUrl'] = twitterUrl
            }

            const shortDescription = this.getDefinition('drol:short', source)
            if (shortDescription) {
                authorLinkObject['shortDescription'] = shortDescription
            }

            const longDescription = this.getDefinition('drol:long', source)
            if (longDescription) {
                authorLinkObject['longDescription'] = longDescription
            }
        }

        return authorLinkObject
    }

    _toArray(objects) {
        if (!objects) {
            objects = []
        }
        return Array.isArray(objects) ? objects : [objects]
    }
}

export default AuthorBaseComponent