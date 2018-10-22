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
        this.reloadArticleConcepts = this.reloadArticleConcepts.bind(this)
        this.removeArticleConcept = this.removeArticleConcept.bind(this)
        this.addConceptToArticle = this.addConceptToArticle.bind(this)
        this.updateArticleConcept = this.updateArticleConcept.bind(this)
        this.itemExists = this.itemExists.bind(this)
    }

    didMount() {
        const { conceptType } = this.state
        const { operations } = ConceptService

        ConceptService.on(conceptType, operations.ADD, this.addItem)
        ConceptService.on(conceptType, operations.ADDED, this.reloadArticleConcepts)
        ConceptService.on(conceptType, operations.UPDATE, this.editItem)
        ConceptService.on(conceptType, operations.UPDATED, this.reloadArticleConcepts)
        ConceptService.on(conceptType, operations.REMOVED, this.reloadArticleConcepts)

        if (this.state.types) {
            this.state.types.forEach(type => {
                ConceptService.on(type, operations.ADD, this.addItem)
                ConceptService.on(type, operations.ADDED, this.reloadArticleConcepts)
                ConceptService.on(type, operations.UPDATE, this.editItem)
                ConceptService.on(type, operations.UPDATED, this.reloadArticleConcepts)
                ConceptService.on(type, operations.REMOVED, this.reloadArticleConcepts)
            })
        }

        api.events.on(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED, async (e) => {
            const eventName = e.name || ''
            const associatedWith = (this.state.pluginConfig.associatedWith || '').replace('-', '').replace('/', '')

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
        const { conceptType } = this.state
        const { operations } = ConceptService

        ConceptService.off(conceptType, operations.ADD, this.addItem)
        ConceptService.off(conceptType, operations.ADDED, this.reloadArticleConcepts)
        ConceptService.off(conceptType, operations.UPDATE, this.editItem)
        ConceptService.off(conceptType, operations.UPDATED, this.reloadArticleConcepts)
        ConceptService.off(conceptType, operations.REMOVED, this.reloadArticleConcepts)

        if (this.state.types) {
            this.state.types.forEach(type => {
                ConceptService.off(type, operations.ADD, this.addItem)
                ConceptService.off(type, operations.ADDED, this.reloadArticleConcepts)
                ConceptService.off(type, operations.UPDATE, this.editItem)
                ConceptService.off(type, operations.UPDATED, this.reloadArticleConcepts)
                ConceptService.off(type, operations.REMOVED, this.reloadArticleConcepts)
            })
        }

        api.events.off(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED)
        api.events.off(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED_EXTERNAL)
    }

    /**
     * reload concepts from article
     *
     * @param {object} updatedConcept optional object that triggered document changed event, defaults to null
     */
    reloadArticleConcepts(updatedConcept = null) {
        const { pluginConfig } = this.state
        const existingItems = ConceptService.getArticleConceptsByType(this.state.conceptType, this.state.types, this.state.subtypes)
        const associatedLinks = pluginConfig.associatedWith ? ConceptService.getArticleConceptsByType(pluginConfig.associatedWith) : false

        this.extendState({ associatedLinks })

        this.decorateExistingItemsWithRemoteMeta(existingItems, updatedConcept)
    }

    getInitialState() {
        const pluginConfig = this.props.pluginConfigObject.pluginConfigObject.data
        const conceptType = pluginConfig.name
        const name = conceptType.replace('-', '').replace('/', '')
        const types = Object.keys(pluginConfig.types || {})
        const subtypes = pluginConfig.subtypes
        const articleConcepts = ConceptService.getArticleConceptsByType(conceptType, types, subtypes)
        const propertyMap = ConceptService.getPropertyMap()
        const associatedLinks = pluginConfig.associatedWith ? ConceptService.getArticleConceptsByType(pluginConfig.associatedWith) : false
        const existingItems = []

        this.decorateExistingItemsWithRemoteMeta(articleConcepts)

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

    /**
     * Fetch additional data from OC for each concept
     * Will check if item already has been decorated before fetch
     *
     * @param {array} existingItems array with concepts from the article
     * @param {object} updatedConcept optional object that triggered document changed event, defaults to null
     */
    async decorateExistingItemsWithRemoteMeta(existingItems, updatedConcept) {
        const decoratedItems = await Promise.all(existingItems.map(async (item) => {
            const existingItem = this.state ?
                this.state.existingItems.find(({ uuid }) => uuid === item.uuid) :
                false

            if ((updatedConcept && existingItem) && updatedConcept.uuid === existingItem.uuid) {
                existingItem.isEnhanced = false
            }

            if (existingItem && existingItem.isEnhanced) {
                item = existingItem
            } else {
                item = await ConceptService.fetchConceptItemProperties(item)
                item.isEnhanced = true
            }

            return item
        }))

        this.extendState({ existingItems: decoratedItems })
    }

    /**
     * Will fetch concept XML and parse properties specified in remote concept config
     *
     * @param {object} item conceptItem to add
     */
    async addConceptToArticle(item) {
        item = await (new ConceptItemModel(
            item,
            this.state.pluginConfig,
            this.state.propertyMap)
        ).extractConceptArticleData(item)

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

    /**
     * Add concept to the article
     * If called with an object without uuid it will try to create the concept
     *
     * @param {object} item conceptItem
     */
    async addItem(item) {
        if (item && item.uuid) {
            if (!this.itemExists(item)) {
                this.extendState({ 'working': true })
                await this.addConceptToArticle(item)
                this.extendState({ 'working': false })
            } else {
                api.ui.showNotification(
                    this.state.name,
                    this.getLabel('Concept item exists'),
                    this.getLabel('This Concept is already used'))
            }
        } else {
            if (this.state.pluginConfig.createable || this.state.pluginConfig.editable) {
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
        const title = `${item.create ? this.getLabel('Create') : ''} ${this.state.pluginConfig.label}: ${item[this.state.propertyMap.ConceptName] ? item[this.state.propertyMap.ConceptName] : ''}`

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
                    secondary: this.getLabel('Cancel'),
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
                    primary: this.getLabel('Save'),
                    secondary: this.getLabel('Cancel'),
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
        const header = $$('h2', { class: 'concept-header' }, [
            `${label} (${this.state.existingItems.length})`
        ])
        const list = $$(ConceptListComponent, {
            propertyMap,
            editItem: this.editItem,
            removeItem: this.removeArticleConcept,
            existingItems: this.state.existingItems,
            working: this.state.working,
            enableHierarchy,
            editable,
            icon,
            types: config.types
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
                types: config.types
            }).ref(`conceptSearchComponent-${this.state.name}`)
        }

        return $$('div', { class: `concept-main-component ${conceptType}` }, [
            header,
            list,
            search
        ]).ref(`conceptMainComponent-${this.state.name}`)
    }
}

export default ConceptMainComponent
