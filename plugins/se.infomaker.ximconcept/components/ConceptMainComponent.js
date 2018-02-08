import {Component} from "substance"
import { api, ConceptService, event } from 'writer'
import ConceptListComponent from './ConceptListComponent'
import ConceptSearchComponent from "./ConceptSearchComponent";
import ConceptDialogComponent from './ConceptDialogComponent'
import ConceptItemModel from '../models/ConceptItemModel'
import ConceptSelectTypeComponent from './ConceptSelectTypeComponent'

class ConceptMainComponent extends Component {

    didMount() {
        api.events.on(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED, async (event) => {
            const types = this.state.types ? this.state.types : []
            const eventName = (event.name || '').replace('-', '').replace('/', '')
            const matchingType = types.map(type => type.replace('-', '').replace('/', '')).find(type => type === eventName)

            if ((eventName === this.state.name) || eventName === matchingType ) {
                this.reloadArticleConcepts()
            }
        })
    }

    dispose() {
        api.events.off(this.state.name, event.DOCUMENT_CHANGED)
    }

    reloadArticleConcepts() {
        this.extendState({
            existingItems: ConceptService.getArticleConceptsByType(this.state.conceptType, this.state.types, this.state.subtypes)
        })
    }

    getInitialState() {
        const pluginConfig = this.props.pluginConfigObject.pluginConfigObject.data
        const conceptType = pluginConfig.name
        const name = conceptType.replace('-', '').replace('/', '')
        const types = Object.keys(pluginConfig.types || {})
        const subtypes = pluginConfig.subtypes
        const existingItems = ConceptService.getArticleConceptsByType(conceptType, types, subtypes)
        const propertyMap = ConceptService.getPropertyMap()

        return {
            name,
            pluginConfig,
            types,
            subtypes,
            conceptType,
            existingItems,
            propertyMap
        }
    }

    async addConceptToArticle(item) {
        item = await (new ConceptItemModel(item, this.state.pluginConfig, this.state.propertyMap)).extractConceptArticleData(item)

        if (!item.errors) {
            ConceptService.addArticleConcept(item)
        } else {
            api.ui.showNotification(
                this.state.name,
                this.getLabel('invalid.conceptItem.label'),
                item.errors.reduce((iterator, error) => { return `${iterator}${iterator.length ? ', ' : ''}${error.error}`}, '')
            )
        }
    }

    updateArticleConcept(item) {
        ConceptService.updateArticleConcept(item)
    }

    removeArticleConcept(item) {
        ConceptService.removeArticleConceptItem(item)
    }

    async addItem(item) {
        if (item && item.uuid) {
            if (!this.itemExists(item)) {

                this.extendState({ 'working': true })
                await this.addConceptToArticle(item)

                this.reloadArticleConcepts()
                this.extendState({ 'working': false })
            } else {
                api.ui.showNotification(this.state.name, this.getLabel('formsearch.item-exists-label'), this.getLabel('formsearch.item-exists-description'))
            }
        } else {
            if (this.state.pluginConfig.editable) {
                this.editItem({
                    ...item,
                    ConceptImTypeFull: this.state.types.length ? null : this.state.conceptType
                })
            }
        }
    }

    itemExists(item) {
        const existingItem = this.state.existingItems.find(i => i.uuid === item.uuid)

        return (existingItem !== undefined)
    }

    /**
     * Show information about the author in AuthorInfoComponent rendered in a dialog
     */
    editItem(item) {
        const title = `${item.create ? this.getLabel('create') : ''} ${this.state.pluginConfig.label}: ${item[this.state.propertyMap.ConceptName] ? item[this.state.propertyMap.ConceptName] : ''}`

        if (this.state.pluginConfig.types && !item[this.state.propertyMap.ConceptImTypeFull]) {
            api.ui.showDialog(
                ConceptSelectTypeComponent,
                {
                    item,
                    propertyMap: this.state.propertyMap,
                    config: this.state.pluginConfig,
                    typeSelected: this.editItem.bind(this)
                },
                {
                    title,
                    primary: false,
                    secondary: this.getLabel('cancel'),
                }
            )
        } else {
            api.ui.showDialog(
                ConceptDialogComponent,
                {
                    item,
                    propertyMap: this.state.propertyMap,
                    config: this.state.pluginConfig,
                    save: (item && item.create) ? this.addConceptToArticle.bind(this) : this.updateArticleConcept.bind(this),
                },
                {
                    title,
                    primary: this.getLabel('save'),
                    secondary: this.getLabel('cancel'),
                }
            )
        }
    }

    render($$) {
        let search
        const config = this.state.pluginConfig || {}
        const { label, enableHierarchy, placeholderText, singleValue, editable, subtypes } = config
        const { propertyMap } = this.state
        const { conceptType, types } = this.state || {}
        const header = $$('h2')
            .append(`${label} (${this.state.existingItems.length})`)
            .addClass('concept-header')

        const list = $$(ConceptListComponent, {
            propertyMap,
            editItem: this.editItem.bind(this),
            removeItem: this.removeArticleConcept.bind(this),
            existingItems: this.state.existingItems,
            working: this.state.working,
            enableHierarchy,
            editable,
        }).ref('conceptListComponent')

        if (!singleValue || !this.state.existingItems.length) {
            search = $$(ConceptSearchComponent, {
                propertyMap,
                placeholderText,
                conceptTypes: types.length ? types : conceptType,
                subtypes,
                editable,
                enableHierarchy,
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
