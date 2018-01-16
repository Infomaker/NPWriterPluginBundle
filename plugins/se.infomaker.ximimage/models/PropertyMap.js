import {api} from 'writer'

class PropertyMap {

    /**
     * Returns a valid property map, either the configured property map or default if config is invalid.
     * Will print error to console if property map is invalid
     *
     * @returns {{authors: string|boolean, caption: string|boolean, credit: string|boolean, alttext: string|boolean}}
     */
    static getValidMap() {
        if (PropertyMap.validatePropertyMap()) {
            return PropertyMap.propertyMap
        } else {
            console.error('Invalid ximimage property mapping, using default property map')
            return PropertyMap.defaultMap
        }
    }

    /**
     * @returns {{authors: string, caption: string, credit: string, alttext: boolean}}
     */
    static get defaultMap() {
        return {
            authors: 'authors',
            caption: 'caption',
            credit: 'credit',
            alttext: false
        }
    }

    /**
     * Returns the default property map with overridden configured values
     *
     * @returns {{authors: string|boolean, caption: string|boolean, credit: string|boolean, alttext: string|boolean}}
     */
    static get propertyMap() {
        return Object.assign(PropertyMap.defaultMap, api.getConfigValue('se.infomaker.ximimage', 'propertyMap', {}))
    }

    /**
     * Validates the property map
     *
     * @returns {boolean}
     */
    static validatePropertyMap() {
        const allowedValues = {
            authors: ['authors', false],
            caption: ['caption', 'credit', false],
            credit: ['caption', 'credit', false],
            alttext: ['caption', 'credit', false]
        }
        const propertyMap = PropertyMap.propertyMap

        return Object.keys(allowedValues).every((key) => allowedValues[key].includes(propertyMap[key]))
    }
}

export default PropertyMap
