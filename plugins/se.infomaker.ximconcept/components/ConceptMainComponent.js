import {Component} from "substance"
import { api, ConceptService } from 'writer'
import ConceptListComponent from './ConceptListComponent'
import ConceptSearchComponent from "./ConceptSearchComponent";
import ConceptDialogComponent from './ConceptDialogComponent'

class ConceptMainComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    getInitialState() {
        const pluginConfig = this.props.pluginConfigObject.pluginConfigObject.data
        const conceptType = pluginConfig.name
        const name = conceptType.replace('-', '').replace('/', '')
        const types = Object.keys(pluginConfig.types || {})
        const entities = pluginConfig.entities
        const existingItems = ConceptService.getExistingConceptsByType(conceptType, types, entities)

        return {
            name,
            pluginConfig,
            types,
            entities,
            conceptType,
            existingItems
        }
    }

    addItem(item) {
        if (item.uuid) {
            if (!this.itemExists(item)) {

                if (this.state.pluginConfig.appendDataToLink) {
                    ConceptService.addExtendedDataLink(this.state.name, item)
                } else {
                    ConceptService.addPlainLink(this.state.name, item)
                }

                this.extendState({
                    existingItems: [...this.state.existingItems, item]
                })
            } else {
                api.ui.showNotification(this.state.name, this.getLabel('formsearch.item-exists-label'), this.getLabel('formsearch.item-exists-description'))
            }
        } else {
            this.showDialog(item)
        }
    }

    editItem(item) {
        this.showDialog(item)
    }

    handleUpdatedConcept(item) {
        this.stitch = item
    }

    handleAddedConcept(item) {
        this.addItem(item)
    }

    removeItem(item) {
        ConceptService.removeConceptItem(this.state.name, item)
        const newItemList = []
        this.state.existingItems.forEach((existingItem) => {
            if (existingItem.uuid !== item.uuid) {
                newItemList.push(existingItem)
            }
        })

        this.extendState({
            existingItems: newItemList
        })
    }

    itemExists(item) {
        const existingItem = this.state.existingItems.find(i => i.uuid === item.uuid)

        return (existingItem !== undefined)
    }

    /**
     * Show information about the author in AuthorInfoComponent rendered in a dialog
     */
    showDialog(item) {
        api.ui.showDialog(
            ConceptDialogComponent,
            {
                item,
                config: this.state.pluginConfig,
                save: (item && item.uuid) ? this.handleUpdatedConcept : this.handleAddedConcept
            },
            {
                primary: this.getLabel('save'),
                secondary: this.getLabel('cancel'),
                title: `${this.state.pluginConfig.label}: ${item ? item.ConceptName : ''}`,
                global: true
            }
        )
    }

    render($$) {
        const config = this.state.pluginConfig || {}
        const { label, enableHierarchy, placeholderText, singleValue, editable, entities } = config
        const { conceptType, types } = this.state || {}
        const header = $$('h2').append(label)

        const list = $$(ConceptListComponent, {
            editItem: this.editItem.bind(this),
            removeItem: this.removeItem.bind(this),
            list: this.state.existingItems,
            enableHierarchy,
            editable,
        })

        const search = $$(ConceptSearchComponent, {
            placeholderText,
            conceptTypes: types.length ? types : conceptType,
            entities,
            editable,
            disabled: (singleValue && this.state.existingItems.length) ? true : false,
            addItem: this.addItem.bind(this),
            itemExists: this.itemExists.bind(this)
        }).ref('conceptSearchComponent')

        const el = $$('div')
            .addClass(`concept-main-component ${conceptType}`)
            .append(header)
            .append(list)
            .append(search)
            .ref('conceptMainComponent')

        return el
    }
}

export default ConceptMainComponent
