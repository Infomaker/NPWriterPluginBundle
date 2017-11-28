import XmlHandler from '@infomaker/xml-handler'
import { ConceptService } from 'writer'

class FormItemModel {

    get uiGroups() {
        return Array.isArray(this._uiGroups) ? this._uiGroups : []
    }

    set uiGroups(uiGroups) {
        this._uiGroups = Array.isArray(uiGroups) ? uiGroups : []
    }

    async getUiGroups(item) {
        this.item = item
        
        try {
            this.conceptXml = await ConceptService.getConceptItemXml(item)
            this.conceptItemConfig = await ConceptService.fetchConceptItemConfigJson(item)
        } catch (error) {
            return [{
                error: `Could not load template/config file for ${item.ConceptImTypeFull}`
            }]
        }

        this.xmlHandler = new XmlHandler(this.conceptXml)

        this.uiGroups = this.conceptItemConfig.groups.map(group => {
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

        return this.uiGroups
    }

    save(refs) {
        this.uiGroups.forEach(group => {
            group.fields.forEach(field => {
                const value = refs[field.refId].val()
                if (!field.node) {
                    this.xmlHandler.createNode(field.xpath)
                }
                this.xmlHandler.setNodeValue(field.node, value)
            })
        })

        if (this.item.uuid) {
            ConceptService.updateConceptItemXml(
                this.item.uuid,
                new XMLSerializer().serializeToString(this.conceptXml.documentElement)
            )
        } else {
            ConceptService.createConceptItemXml(
                new XMLSerializer().serializeToString(this.conceptXml.documentElement)
            )
        }
    }
}

export default FormItemModel
