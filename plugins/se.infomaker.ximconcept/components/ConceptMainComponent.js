import {Component} from "substance"
import { api, ConceptService, event } from 'writer'
import ConceptListComponent from './ConceptListComponent'
import ConceptSearchComponent from "./ConceptSearchComponent";
import ConceptDialogComponent from './ConceptDialogComponent'
import ConceptItemModel from '../models/ConceptItemModel'
import ConceptSelectTypeComponent from './ConceptSelectTypeComponent'

class ConceptMainComponent extends Component {

    constructor(...args) {
        super(...args)

        this.editItem = this.editItem.bind(this)
        this.removeArticleConcept = this.removeArticleConcept.bind(this)
        this.addItem = this.addItem.bind(this)
        this.itemExists = this.itemExists.bind(this)
    }

    didMount() {
        ConceptService.registerOperationHandler(
            this.state.conceptType,
            ConceptService.operations.ADD,
            this.addItem
        )

        if (this.state.types) {
            this.state.types.forEach(type => ConceptService.registerOperationHandler(type, ConceptService.operations.ADD, this.addItem))
        }

        api.events.on(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED, async (event) => {
            const types = this.state.types || []
            const eventName = event.name || ''
            const cleanEventName = eventName.replace('-', '').replace('/', '')
            const associatedWith = (this.state.pluginConfig.associatedWith || '').replace('-', '').replace('/', '')
            const matchingType = types.map(type => type.replace('-', '').replace('/', '')).find(type => (type === eventName || type === cleanEventName))

            if (eventName === this.state.name || cleanEventName === this.state.name || matchingType || eventName === associatedWith) {
                this.reloadArticleConcepts()
            }
        })
    }

    dispose() {
        ConceptService.removeOperationHandler(this.state.conceptType, ConceptService.operations.ADD, this.addItem)

        if (this.state.types) {
            this.state.types.forEach(type => ConceptService.removeOperationHandler(type, ConceptService.operations.ADD, this.addItem))
        }

        api.events.off(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED)
    }

    reloadArticleConcepts() {
        const { pluginConfig } = this.state
        this.extendState({
            existingItems: ConceptService.getArticleConceptsByType(this.state.conceptType, this.state.types, this.state.subtypes),
            associatedLinkes: pluginConfig.associatedWith ? ConceptService.getArticleConceptsByType(pluginConfig.associatedWith) : false
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
        const associatedLinkes = pluginConfig.associatedWith ? ConceptService.getArticleConceptsByType(pluginConfig.associatedWith) : false

        return {
            name,
            pluginConfig,
            types,
            subtypes,
            conceptType,
            existingItems,
            propertyMap,
            associatedLinkes
        }
    }

    async addConceptToArticle(item) {
        item = await (new ConceptItemModel(item, this.state.pluginConfig, this.state.propertyMap)).extractConceptArticleData(item)

        if (!item.errors) {
            ConceptService.addArticleConcept(item)
        } else {
            api.ui.showNotification(
                this.state.name,
                this.getLabel('Invalid Concept'),
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
                api.ui.showNotification(
                    this.state.name,
                    this.getLabel('Conceptitem exists'),
                    this.getLabel('The Concept is already used'))
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
                    cssClass: 'hide-overflow',
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
                    cssClass: 'hide-overflow',
                    primary: this.getLabel('save'),
                    secondary: this.getLabel('cancel'),
                }
            )
        }
    }

    shouldBeDisabled() {
        const { singleValue, pluginConfig, associatedLinkes } = this.state

        return (singleValue && this.state.existingItems.length) ? true :
            (pluginConfig.associatedWith && (!associatedLinkes || !associatedLinkes.length)) ? true : false
    }

    render($$) {
        let search
        const config = this.state.pluginConfig || {}
        const { label, enableHierarchy, placeholderText, singleValue, editable, subtypes, associatedWith } = config
        const { propertyMap } = this.state
        const { conceptType, types } = this.state || {}
        const header = $$('h2')
            .append(`${label} (${this.state.existingItems.length})`)
            .addClass('concept-header')

        const list = $$(ConceptListComponent, {
            propertyMap,
            editItem: this.editItem,
            removeItem: this.removeArticleConcept,
            existingItems: this.state.existingItems,
            working: this.state.working,
            enableHierarchy,
            editable,
        }).ref(`conceptListComponent-${this.state.name}`)

        if (!singleValue || !this.state.existingItems.length) {
            search = $$(ConceptSearchComponent, {
                propertyMap,
                placeholderText,
                conceptTypes: types.length ? types : conceptType,
                subtypes,
                editable,
                enableHierarchy,
                disabled: this.shouldBeDisabled(),
                addItem: this.addItem,
                itemExists: this.itemExists,
                associatedWith
            }).ref(`conceptSearchComponent-${this.state.name}`)
        }

        const el = $$('div')
            .addClass(`concept-main-component ${conceptType}`)
            .append(header)
            .append(list)
            .append(search)
            .ref(`conceptMainComponent-${this.state.name}`)

        return el
    }
}

export default ConceptMainComponent
