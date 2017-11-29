import {api} from 'writer'

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


    _loadContentPartTypes() {
        const contentPartTypes = this._config.contentPartTypes
        if (!contentPartTypes || contentPartTypes.length === 0) {
            throw new Error('No content part types configured for contentpart')
        }

        this.contentPartTypes = contentPartTypes.map(contentPartType => {
            return {
                uri: contentPartType.uri,
                name: contentPartType.name,
                default: contentPartType.default || false,
                fields: contentPartType.fields.map(field => this._mapFields(field))
            }
        })
    }

    _mapFields(field) {
        this._createFieldOnNode(field)
        const _defaults = this._getFieldDefaultsForID(field.id)
        return Object.assign({}, _defaults, field)
    }

    _createFieldOnNode(field) {
        const currentValue = this.node.fields[field.id]
        if (!this.reservedFields.includes(field.id) && currentValue === undefined) {
            this.node.fields[field.id] = ''
            console.info('Creating field', field.id, 'on node')
        }
    }

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

    getFieldsByURI(uri) {
        const contentPartType = this.getContentPartTypeByURI(uri)
        if (!contentPartType) { return }
        return contentPartType
    }
}

export default ContentPartManager
