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

        this.addItem = this.addItem.bind(this)
        this.editItem = this.editItem.bind(this)
        this.removeArticleConcept = this.removeArticleConcept.bind(this)
        this.addConceptToArticle = this.addConceptToArticle.bind(this)
        this.updateArticleConcept = this.updateArticleConcept.bind(this)
        this.itemExists = this.itemExists.bind(this)
    }

    didMount() {
        ConceptService.on(
            this.state.conceptType,
            ConceptService.operations.ADD,
            this.addItem
        )

        if (this.state.types) {
            this.state.types.forEach(type => ConceptService.on(type, ConceptService.operations.ADD, this.addItem))
        }

        api.events.on(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED, async (e) => {
            const types = this.state.types || []
            const eventName = e.name || ''
            const cleanEventName = eventName.replace('-', '').replace('/', '')
            const associatedWith = (this.state.pluginConfig.associatedWith || '').replace('-', '').replace('/', '')
            const matchingType = types.map(type => type.replace('-', '').replace('/', '')).find(type => (type === eventName || type === cleanEventName))

            if (eventName.length) {
                if (e.data.action === 'delete' && (associatedWith.length && associatedWith === eventName)) {
                    const eventUUID = e.data.node.uuid
                    this.state.existingItems.forEach(existingItem => {
                        const itemAssociatedWith = existingItem[this.state.propertyMap.ConceptAssociatedWith]

                        // if no multi-value (just one associated-with) and its a match, we remove the item
                        if (itemAssociatedWith === eventUUID) {
                            ConceptService.removeArticleConceptItem(existingItem)
                        }

                        // if we have multiple associated-with we need to check 'em all to look for a match
                        if (Array.isArray(itemAssociatedWith)) {
                            let associationExists = false

                            itemAssociatedWith.forEach(itemAssociatedWithUuid => {
                                if (ConceptService.getArticleConceptByUUID(itemAssociatedWithUuid)) {
                                    associationExists = true
                                }
                            })

                            if (!associationExists) {
                                ConceptService.removeArticleConceptItem(existingItem)
                            }
                        }
                    })
                } else if (e.data.action === 'delete-all' && (associatedWith.length && associatedWith === eventName)) {
                    ConceptService.removeAllArticleLinksOfType(this.state.conceptType)
                } else if (eventName === this.state.name || cleanEventName === this.state.name || matchingType) {
                    this.reloadArticleConcepts()
                } else if (associatedWith.length && associatedWith === eventName) {
                    const { pluginConfig } = this.state
                    const associatedLinks = ConceptService.getArticleConceptsByType(pluginConfig.associatedWith)

                    this.extendState({ associatedLinks })
                }
            }
        })

        api.events.on(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED_EXTERNAL, (e) => {
            if (e.data.key === 'itemMetaLink') {
                if (this.state.conceptType === e.data.value.type) {
                    this.reloadArticleConcepts()
                }
            }
        })
    }


    dispose() {
        ConceptService.off(this.state.conceptType, ConceptService.operations.ADD, this.addItem)

        if (this.state.types) {
            this.state.types.forEach(type => ConceptService.off(type, ConceptService.operations.ADD, this.addItem))
        }

        api.events.off(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED)
        api.events.off(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED_EXTERNAL)
    }

    reloadArticleConcepts() {
        const { pluginConfig } = this.state
        const existingItems = ConceptService.getArticleConceptsByType(this.state.conceptType, this.state.types, this.state.subtypes)
        const associatedLinks = pluginConfig.associatedWith ? ConceptService.getArticleConceptsByType(pluginConfig.associatedWith) : false

        this.extendState({ existingItems, associatedLinks })
    }

    getInitialState() {
        const pluginConfig = this.props.pluginConfigObject.pluginConfigObject.data
        const conceptType = pluginConfig.name
        const name = conceptType.replace('-', '').replace('/', '')
        const types = Object.keys(pluginConfig.types || {})
        const subtypes = pluginConfig.subtypes
        const existingItems = ConceptService.getArticleConceptsByType(conceptType, types, subtypes)
        const propertyMap = ConceptService.getPropertyMap()
        const associatedLinks = pluginConfig.associatedWith ? ConceptService.getArticleConceptsByType(pluginConfig.associatedWith) : false

        return {
            name,
            pluginConfig,
            types,
            subtypes,
            existingItems,
            conceptType,
            propertyMap,
            associatedLinks
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
                this.extendState({ 'working': false })
            } else {
                api.ui.showNotification(
                    this.state.name,
                    this.getLabel('Conceptitem exists'),
                    this.getLabel('The Concept is already used'))
            }
        } else {
            if ((this.state.pluginConfig.createable !== undefined && this.state.pluginConfig.createable) || this.state.pluginConfig.editable) {
                const conceptType = item[[this.state.propertyMap.ConceptImTypeFull]] ? item[this.state.propertyMap.ConceptImTypeFull] :
                    this.state.types.length ? null : this.state.conceptType

                this.editItem({
                    ...item,
                    [this.state.propertyMap.ConceptImTypeFull]: conceptType
                })
            }
        }
    }

    itemExists(item) {
        const existingItem = this.state.existingItems.find(i => i.uuid === item.uuid)

        return (existingItem !== undefined)
    }

    editItem(item) {
        const title = `${item.create ? this.getLabel('create') : ''} ${this.state.pluginConfig.label}: ${item[this.state.propertyMap.ConceptName] ? item[this.state.propertyMap.ConceptName] : ''}`

        if (this.state.pluginConfig.types && !item[this.state.propertyMap.ConceptImTypeFull]) {
            api.ui.showDialog(
                ConceptSelectTypeComponent,
                {
                    item,
                    propertyMap: this.state.propertyMap,
                    config: this.state.pluginConfig,
                    typeSelected: this.editItem
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
                    save: (item && item.create) ? this.addConceptToArticle : this.updateArticleConcept,
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
        const { singleValue, pluginConfig, associatedLinks } = this.state

        return (singleValue && this.state.existingItems.length) ? true :
            (pluginConfig.associatedWith && (!associatedLinks || !associatedLinks.length)) ? true : false
    }

    render($$) {
        let search
        const config = this.state.pluginConfig || {}
        const { label, enableHierarchy, placeholderText, singleValue, creatable, editable, subtypes, associatedWith, icon } = config
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
            icon,
        }).ref(`conceptListComponent-${this.state.name}`)

        if (!singleValue || !this.state.existingItems.length) {
            search = $$(ConceptSearchComponent, {
                propertyMap,
                placeholderText,
                conceptTypes: types.length ? types : conceptType,
                subtypes,
                creatable: (creatable !== undefined) ? creatable : editable,
                enableHierarchy,
                disabled: this.shouldBeDisabled(),
                addItem: this.addItem,
                itemExists: this.itemExists,
                associatedWith,
                icon,
            }).ref(`conceptSearchComponent-${this.state.name}`)
        }

        const el = $$('div', { class: `concept-main-component ${conceptType}` }, [
            header,
            list,
            search
        ]).ref(`conceptMainComponent-${this.state.name}`)

        return el
    }
}

export default ConceptMainComponent
