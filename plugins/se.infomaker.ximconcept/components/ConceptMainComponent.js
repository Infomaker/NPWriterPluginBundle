import {Component} from "substance"
import { api, ConceptService, event } from 'writer'
import ConceptListComponent from './ConceptListComponent'
import ConceptSearchComponent from "./ConceptSearchComponent";
import ConceptDialogComponent from './ConceptDialogComponent'
import ConceptItemModel from '../models/ConceptItemModel'

class ConceptMainComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    didMount() {
        api.events.on(this.state.conceptName, event.DOCUMENT_CHANGED, async function(event) {
            if (event.name === this.state.name) {
                this.reloadArticleConcepts()
            }
        }.bind(this))
    }

    dispose() {
        api.events.off(this.state.name, event.DOCUMENT_CHANGED)
    }

    reloadArticleConcepts() {
        this.extendState({
            existingItems: ConceptService.getArticleConceptsByType(this.state.conceptType, this.state.types, this.state.entities)
        })
    }

    getInitialState() {
        const pluginConfig = this.props.pluginConfigObject.pluginConfigObject.data
        const conceptType = pluginConfig.name
        const name = conceptType.replace('-', '').replace('/', '')
        const types = Object.keys(pluginConfig.types || {})
        const entities = pluginConfig.entities
        const existingItems = ConceptService.getArticleConceptsByType(conceptType, types, entities)

        return {
            name,
            pluginConfig,
            types,
            entities,
            conceptType,
            existingItems
        }
    }

    updateArticleConcept(item) {
        ConceptService.updateArticleConcept(this.state.name, item)
    }

    async addConceptToArticle(item) {
        item = await (new ConceptItemModel(item, this.state.pluginConfig)).extractConceptArticleData(item)
        ConceptService.addArticleConcept(this.state.name, item)
    }

    addItem(item) {
        if (item && item.uuid) {
            if (!this.itemExists(item)) {

                this.addConceptToArticle(item)

                this.reloadArticleConcepts()
            } else {
                api.ui.showNotification(this.state.name, this.getLabel('formsearch.item-exists-label'), this.getLabel('formsearch.item-exists-description'))
            }
        } else {
            this.editItem({ ConceptImTypeFull: this.state.conceptType, ...item })
        }
    }

    removeItem(item) {
        ConceptService.removeArticleConceptItem(this.state.name, item)
    }

    itemExists(item) {
        const existingItem = this.state.existingItems.find(i => i.uuid === item.uuid)

        return (existingItem !== undefined)
    }

    /**
     * Show information about the author in AuthorInfoComponent rendered in a dialog
     */
    editItem(item) {
        api.ui.showDialog(
            ConceptDialogComponent,
            {
                item,
                config: this.state.pluginConfig,
                save: (item && item.create) ? this.addConceptToArticle.bind(this) : this.updateArticleConcept.bind(this),
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
        let search
        const config = this.state.pluginConfig || {}
        const { label, enableHierarchy, placeholderText, singleValue, editable, entities } = config
        const { conceptType, types } = this.state || {}
        const header = $$('h2')
            .append(`${label} (${this.state.existingItems.length})`)
            .addClass('concept-header')

        const list = $$(ConceptListComponent, {
            editItem: this.editItem.bind(this),
            removeItem: this.removeItem.bind(this),
            existingItems: this.state.existingItems,
            enableHierarchy,
            editable,
        }).ref('conceptListComponent')

        if (!singleValue || !this.state.existingItems.length) {
            search = $$(ConceptSearchComponent, {
                placeholderText,
                conceptTypes: types.length ? types : conceptType,
                entities,
                editable,
                disabled: (singleValue && this.state.existingItems.length) ? true : false,
                addItem: this.addItem.bind(this),
                itemExists: this.itemExists.bind(this)
            }).ref('conceptSearchComponent')
        }

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
