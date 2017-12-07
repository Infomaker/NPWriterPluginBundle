import XmlHandler from '@infomaker/xml-handler'
import { ConceptService } from 'writer'

class ConceptItemModel {

    get nameXpath() {
        return '/*:conceptItem/*:concept/*:name/text()'
    }

    get uiGroups() {
        return Array.isArray(this._uiGroups) ? this._uiGroups : []
    }

    set uiGroups(uiGroups) {
        this._uiGroups = Array.isArray(uiGroups) ? uiGroups : []
    }

    constructor(item, config) {
        this.item = item
        this.errors = []
        this.config = config
    }

    async setUp() {
        if (!this.conceptXml) {
            try {
                this.conceptXml = await ConceptService.getConceptItemXml(this.item)
            } catch (error) {
                this.errors.push({
                    error: `Error: ${error}`
                })
            }
        }

        if (!this.conceptItemConfig) {
            try {
                this.conceptItemConfig = await ConceptService.fetchConceptItemConfigJson(this.item)
            } catch (error) {
                this.errors.push({
                    error: `Error: ${error}`
                })
            }
        }

        if (!this.xmlHandler) {
            this.xmlHandler = new XmlHandler(this.conceptXml)
        }
    }

    async getUiGroups() {
        await this.setUp()

        this.uiGroups = this.conceptItemConfig.details.map(group => {
            return {
                ...group,
                fields: group.fields.map((field, index) => {
                    const node = this.xmlHandler.getNode(field.xpath)
                    const nodeValue = this.xmlHandler.getNodeValue(node)

                    return {
                        ...field,
                        value: nodeValue,
                        node: node,
                        refId: `${group.title.replace(/ /g, "").trim()}-${index}`
                    }
                })
            }
        })
        this.uiGroups.errors = this.errors || []

        // TODO: Un-stitch this
        if (this.item.create) {
            this.uiGroups[0].fields[0].value = this.item.searchedTerm
        }

        return this.uiGroups
    }

    async extractConceptArticleData(item) {
        await this.setUp()

        if (this.config.appendDataToLink) {
            if (this.conceptItemConfig.articleData) {
                item.articleData = this.conceptItemConfig.articleData.reduce((accumulator, prop) => {
                    accumulator[prop.name] = this.xmlHandler.getNodeValue(this.xmlHandler.getNode(prop.xpath))
                    return accumulator
                }, {})
            }
        }

        item.name = this.xmlHandler.getNodeValue(this.xmlHandler.getNode(this.nameXpath))
        
        return item
    }

    async save(refs) {
        let item = this.item

        this.uiGroups.forEach(group => {
            group.fields.forEach(field => {
                this.xmlHandler.createNodes(field.xpath)

                const value = refs[field.refId].val()
                const elementNode = this.xmlHandler.getSourceNode(field.xpath)
                const valueNode = this.xmlHandler.getNode(field.xpath)

                if (valueNode.singleNodeValue) {
                    this.xmlHandler.setNodeValue(valueNode, value)
                } else {
                    this.xmlHandler.setNodeValue(elementNode, value)
                }
            })
        })

        item = await this.extractConceptArticleData(item)

        const xmlString = new XMLSerializer().serializeToString(this.conceptXml.documentElement).trim().replace(/ xmlns=""/g, '')
        
        if (item.uuid) {
            ConceptService.updateConceptItemXml(item.uuid, xmlString)
        } else {
            item.uuid = await ConceptService.createConceptItemXml(xmlString)
        }

        return item
    }
}

export default ConceptItemModel
