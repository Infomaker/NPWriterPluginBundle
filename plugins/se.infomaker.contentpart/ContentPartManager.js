import {api} from 'writer'

/**
 * @typedef ContentPart.Type
 * @property {string} name - Display name of the content part type
 * @property {string} uri - Unique URI to identify the content part type
 * @property {Boolean} [default] - If the type is the default content part type
 * @property {ContentPart.Field[]} fields - Fields on the content part type
 */

/**
 * @typedef ContentPart.Field
 * @property {string} id - Name of the field on the node
 * @property {string} [label=id] - Placeholder
 * @property {string} [icon] - FontAwesome icon
 * @property {string} [type="text"] - What kind of field editor should be rendered
 */

/**
 * Handles configuration and defaults for content parts
 */
class ContentPartManager {
    constructor(node) {
        const config = api.getConfigValue('se.infomaker.contentpart')
        if (!config) {
            throw new Error('Error in contentpart config')
        }

        this._config = config.data
        this.node = node
        this.reservedFields = ['text']

        this.disableUseOfAnnotationTools = this._config.disableUseOfAnnotationTools
        this.enableTextTypes = this._config.enableTextTypes
        this.contentPartTypes = []

        this._loadContentPartTypes()
    }


    /**
     * @private
     */
    _loadContentPartTypes() {
        const contentPartTypes = this._config.types
        if (!contentPartTypes || contentPartTypes.length === 0) {
            throw new Error('No content part types configured for contentpart')
        }

        /** @type ContentPart.Type[] */
        this.contentPartTypes = contentPartTypes.map(contentPartType => {
            return {
                uri: contentPartType.uri,
                name: contentPartType.name,
                default: contentPartType.default || false,
                fields: contentPartType.fields.map(field => this._mapFields(field))
            }
        })
    }

    /**
     * @private
     */
    _mapFields(field) {
        this._createFieldOnNode(field)
        const _defaults = this._getFieldDefaultsForID(field.id)
        return Object.assign({}, _defaults, field)
    }

    /**
     * @private
     */
    _createFieldOnNode(field) {
        const currentValue = this.node.fields[field.id]
        const doc = this.node.getDocument()
        if (doc && !this.reservedFields.includes(field.id) && currentValue === undefined) {
            doc.set([this.node.id, 'fields', field.id], '')
        }
    }

    /**
     * @private
     */
    _getFieldDefaultsForID(fieldID) {
        const _default = {
            type: 'text',
            label: fieldID,
            icon: null
        }

        switch (fieldID) {
            case 'title':
                _default.label = 'Title'
                _default.icon = 'fa-header'
                break
            case 'subject':
                _default.label = 'Subject'
                _default.icon = 'fa-pencil'
                break
            case 'text':
                _default.label = null
                _default.icon = null
                _default.type = '__ContainerEditor__'
                break
        }

        return _default
    }

    getContentPartTypes() {
        return this.contentPartTypes
    }

    getContentPartTypeByURI(uri) {
        return this.contentPartTypes.find(type => type.uri === uri)
    }

    getDefaultContentPartType() {
        let defaultContentPartType = this.contentPartTypes.find(type => type.default === true)

        if (!defaultContentPartType) {
            console.warn('No default content part type configured')
            return this.contentPartTypes[0]
        }
        return defaultContentPartType
    }
}

export default ContentPartManager
