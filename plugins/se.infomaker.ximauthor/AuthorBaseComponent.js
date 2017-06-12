import {Component} from 'substance'
import {lodash} from 'writer'

const find = lodash.find

class AuthorBaseComponent extends Component {
    /**
     * Get concept > definition with @role equal to parameter 'role'.
     *
     * @param role
     * @returns {null}
     * @protected
     */
    _getDefinition(role) {
        const collection = this._toArray(this.state.author.concept.definition)
        const definition = find(collection, (item) => item['@role'] === role)

        return definition ? definition.keyValue : null
    }

    /**
     * Get and concatenate itemMeta > itemMetaExtProperty for @type='firstName' and 'lastName'
     * in order to get author full name.
     *
     * @returns {string}
     * @protected
     */
    _getFullName() {
        return this._getItemMetaExtProperty('imext:firstName') + ' ' + this._getItemMetaExtProperty('imext:lastName')
    }

    /**
     * Returns all itemMeta > links > link. If links does not exist, empty array is returned.
     *
     * @returns {*}
     * @protected
     */
    _getItemMetaLinks() {
        if (this.state.author.itemMeta.links) {
            return this._toArray(this.state.author.itemMeta.links.link)
        }
        return []
    }

    /**
     * Get concept > metadata > object[@type] === 'x-im/contact-info' > data > [elementName].
     *
     * @param elementName   Name of element searched.
     * @returns {null}      String if match, otherwise null.
     * @protected
     */
    _getDataElement(elementName) {
        if (this.state.author.concept.metadata) {
            const collection = this._toArray(this.state.author.concept.metadata.object)
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
     * @returns {null}  String if match, otherwise null.
     * @protected
     */
    _getItemMetaExtProperty(type) {
        const collection = this._toArray(this.state.author.itemMeta.itemMetaExtProperty)
        const property = find(collection, (item) => item['@type'] === type)

        return property ? property['@value'] : null
    }

    /**
     * Get itemMeta > links > link[@type] === [type] > @[attributeName].
     *
     * @param type          Type, i.e. attribute 'type' of link to search for.
     * @param attributeName Name of attribute to get value from.
     * @returns {null}      String if match, otherwise null.
     * @private
     */
    _getItemMetaLinkAttribute(type, attributeName) {
        if (this.state.author.itemMeta && this.state.author.itemMeta.links) {
            const linkArray = this._toArray(this.state.author.itemMeta.links.link)
            const link = find(linkArray, (item) => item['@type'] === type)

            return link ? link['@' + attributeName] : null
        }
        return null
    }

    _toArray(objects) {
        if (!objects) {
            objects = []
        }
        return Array.isArray(objects) ? objects : [objects]
    }
}

export default AuthorBaseComponent