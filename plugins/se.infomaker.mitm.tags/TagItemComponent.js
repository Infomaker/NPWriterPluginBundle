import {Component, FontAwesomeIcon as Icon} from 'substance'
import {jxon, lodash as _} from 'writer'
import Config from './config/Config'
import TagInfoComponent from './TagInfoComponent'
import TagEditCompanyComponent from './TagEditCompanyComponent'
import TagEditPersonComponent from './TagEditPersonComponent'
import TagEditTopicComponent from './TagEditTopicComponent'

class TagsItemComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'mmtags'
    }


    /**
     * Get itemMetaExtension property in itemMeta section.
     * @param type
     * @returns {*}
     */
    getItemMetaExtPropertyByType(type) {
        if (_.isArray(this.state.loadedTag.itemMeta.itemMetaExtProperty)) {
            return _.find(this.state.loadedTag.itemMeta.itemMetaExtProperty, function (itemMeta) {
                return itemMeta['@type'] === type;
            })
        } else if (_.isObject(this.state.loadedTag.itemMeta.itemMetaExtProperty)) {
            if (this.state.loadedTag.itemMeta.itemMetaExtProperty['@type'] === type) {
                return this.state.loadedTag.itemMeta.itemMetaExtProperty;
            }
        }
    }

    loadTag() {
        this.context.api.router.getConceptItem(this.props.tag.uuid, this.props.tag.type)
            .then(xml => {
                const conceptXML = xml.querySelector('conceptItem'),
                    conceptItemJSON = jxon.build(conceptXML)

                this.extendState({
                    loadedTag: conceptItemJSON,
                    isLoaded: true
                })

                //Add tagType to loaded tag
                this.state.loadedTag.type = this.getItemMetaExtPropertyByType('imext:type');
            })
            .catch(() => {
                this.extendState({
                    isLoaded: true,
                    couldNotLoad: true
                })
            })
    }


    render($$) {
        const tag = this.props.tag,
            tagItem = $$('li').addClass('tag-list__item').ref('tagItem'),
            displayNameEl = $$('span')

        let displayName

        displayNameEl.attr('title', TagsItemComponent.getNameForTag(tag));

        if (!this.state.isLoaded) {
            this.loadTag()
        } else {
            if (this.state.couldNotLoad) {
                displayNameEl.addClass('tag-item__title tag-item__title--no-avatar tag-item__title--notexisting')
                    .append(tag.title)
                    .attr('title', this.getLabel('mmtags-could_not_load_uuid') + tag.uuid)
                displayName = tag.title
            } else {
                displayName = this.state.loadedTag.concept.name
                displayNameEl.addClass('tag-item__title tag-item__title--no-avatar').append(displayName)
                this.updateTagItemName(displayNameEl, this.state.loadedTag)

                displayNameEl.on('click', () => {
                    // $(ev.target).tooltip('hide');
                    if (Config.isTagEditable(tag)) {
                        this.editTag(displayName)
                    } else {
                        this.showTag(displayName)
                    }
                })
            }

            displayNameEl.attr('data-toggle', 'tooltip')
                .attr('data-placement', 'bottom')
                .attr('data-trigger', 'manual')

            // TODO Tooltip
            // displayNameEl.on('mouseenter', this.toggleTooltip)
            // displayNameEl.on('mouseout', this.hideTooltip)

            tagItem.append(displayNameEl)

            const deleteButton = $$('span').append($$(Icon, {icon: 'fa-times'})
                .addClass('tag-icon tag-icon--delete')
                .attr('title', this.getLabel('mmtags-Remove_from_article')))
                .on('click', () => {
                    this.removeTag(tag)
                })

            tagItem.append(deleteButton)
            const iconComponent = this.getIconForTag($$, tag)
            if (iconComponent) {
                tagItem.append(iconComponent)
            }
        }
        return tagItem
    }


    showTag(title) {
        this.context.api.ui.showDialog(TagInfoComponent,
            {
                tag: this.state.loadedTag,
                close: this.closeFromDialog.bind(this),
                couldNotLoad: this.state.couldNotLoad
            },
            {
                secondary: false,
                title: title,
                global: true
            })
    }

    /**
     * Shows a edit component in dialoag
     * @param title
     */
    editTag(title) {
        let tagEdit;

        switch (this.state.loadedTag.type['@value']) {
            case 'x-im/organisation':
                tagEdit = TagEditCompanyComponent
                break;
            case 'x-im/person':
                tagEdit = TagEditPersonComponent
                break;
            case 'x-im/topic':
                tagEdit = TagEditTopicComponent
                break;
            default:
                break;
        }

        this.context.api.ui.showDialog(tagEdit,
            {
                tag: this.state.loadedTag,
                close: this.closeFromDialog.bind(this),
                couldNotLoad: this.state.couldNotLoad
            },
            {
                primary: this.getLabel('mmtags-save'),
                title: this.getLabel('mmtags-edit') + " " + title,
                global: true
            })
    }

    /**
     * Called when edit and info dialog is closed
     */
    closeFromDialog() {
        this.loadTag() // Reload new changes
        this.props.reload()
    }

    /**
     * Remove tag after fading item away
     * @param tag
     */
    removeTag(tag) {
        this.props.removeTag(tag);
    }

    getIconForTag($$, tag) {
        if (!tag.type) {
            return this.getDefaultIconForTag($$);
        }

        const tagConfig = Config.types[tag.type];
        if (tagConfig) {
            return $$(Icon, {icon: tagConfig.icon}).addClass('tag-icon');
        } else {
            this.getDefaultIconForTag($$);
        }
    }

    static getNameForTag(tag) {
        if (!tag.type) {
            return undefined;
        }
        const tagConfig = Config.types[tag.type];
        if (tagConfig) {
            return tagConfig.name;
        }
    }

    updateTagItemName(tagItem, loadedTag) {
        if (loadedTag.concept && loadedTag.concept.definition) {
            const definition = _.isArray(loadedTag.concept.definition) ? loadedTag.concept.definition : [loadedTag.concept.definition];
            for (let i = 0; i < definition.length; i++) {
                const item = definition[i];
                if (item["@role"] === "drol:short") {
                    if (item["keyValue"] && item["keyValue"].length > 0) {
                        tagItem.attr('title', item["keyValue"]);
                        break;
                    }
                }
            }
        }
    }

    getDefaultIconForTag($$) {
        return $$(Icon, {icon: 'fa-tag'}).addClass('tag-icon')
    }

// TODO Tooltip
// toggleTooltip = function (ev) {
//     $(ev.target).tooltip('toggle');
//     ev.target.timeout = window.setTimeout(function () {
//         this.hideTooltip(ev)
//     }.bind(this), 3000)
// };
//
// hideTooltip = function (ev) {
//     if (ev.target.timeout) {
//         window.clearTimeout(ev.target.timeout);
//         ev.target.timeout = undefined;
//     }
//     $(ev.target).tooltip('hide');
// };

}


export default TagsItemComponent