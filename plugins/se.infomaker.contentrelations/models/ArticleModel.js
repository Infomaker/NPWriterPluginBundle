class ArticleModel {

    /**
     * Will mapp OC props to article object
     *
     * @param {object} item OpenCOntent hit
     * @param {object} propertyMap object with key => value pairs of propeties (plugin => oc)
     */
    constructor(item, propertyMap) {
        try {
            const props = item.versions[0].properties
            Object.keys(propertyMap).forEach(key => {
                this[key] = props[propertyMap[key]] || []
            })
        } catch (error) {
            console.warn('Error creating ArticleModel: ', error)
        }
    }

}

export default ArticleModel
