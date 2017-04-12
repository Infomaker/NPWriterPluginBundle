import {Component, FontAwesomeIcon} from 'substance'
import {jxon} from 'writer'

class ContentprofileItemComponent extends Component {
    constructor(...args) {
        super(...args)
        this.name = 'ximcontentprofile'
    }

    dispose() {
        super.dispose()
    }

    loadContentProfile() {
        var api = this.context.api;

        api.router.getConceptItem(this.props.contentProfile.uuid, this.props.contentProfile.type)
            .then(xml => {
                var conceptXML = xml.querySelector('conceptItem')
                try {
                    this.setState({
                        loadedContentProfile: jxon.build(conceptXML),
                        isLoaded: true
                    });
                } catch (e) {
                    this.setState({
                        isLoaded: true,
                        couldNotLoad: true
                    })
                }
            })
            .catch(() => {
                this.setState({
                    isLoaded: true,
                    couldNotLoad: true
                });
            })
    }

    render($$) {
        let contentProfile = this.props.contentProfile

        const contentProfileListItem = $$('li').addClass('tag-list__item')
        const displayNameElement = $$('span')

        if (!this.state.isLoaded) {
            displayNameElement.addClass('tag-item__title tag-item__title--loading')
                .append(contentProfile.title)

            this.loadContentProfile();
        } else {
            if (this.state.couldNotLoad) {
                displayNameElement.addClass('tag-item__title tag-item__title--no-avatar tag-item__title--notexisting')
                    .append(contentProfile.title)
                    .attr('title', this.getLabel('This item could not be loaded. UUID: ') + contentProfile.uuid)
            } else {
                displayNameElement.addClass('tag-item__title tag-item__title--no-avatar')
                    .append(this.state.loadedContentProfile.concept.name)

                displayNameElement.attr('title', contentProfile.title)

                this.updateTagItemName(displayNameElement, this.state.loadedContentProfile)

                displayNameElement.attr('data-toggle', 'tooltip')
                    .attr('data-placement', 'bottom')
                    .attr('data-trigger', 'manual')

                // Check if there's been an update
                if (this.state.loadedContentProfile.concept.name !== contentProfile.title) {
                    this.setState({
                        isLoaded: false
                    });
                }

                displayNameElement.on('click', function () {
                    this.props.openContentProfile(this.state.loadedContentProfile)
                }.bind(this))
            }

            contentProfileListItem.append(displayNameElement)

            const deleteButton = $$('span')
                .append($$(FontAwesomeIcon, {icon: 'fa-times'})
                    .addClass('tag-icon tag-icon--delete')
                    .attr('title', this.getLabel('Remove from article')))
                .on('click', function () {
                    this.removeContentProfile(contentProfile)
                }.bind(this))

            contentProfileListItem.append(deleteButton)

            const icon = 'fa-cogs'
            contentProfileListItem.append($$(FontAwesomeIcon, {icon: icon}).addClass('tag-icon'))
        }

        return contentProfileListItem
    }

    updateTagItemName(tagItem, loadedTag) {
        if (loadedTag && loadedTag.definition) {
            var definition = Array.isArray(loadedTag.definition) ? loadedTag.definition : [loadedTag.definition]

            for (var i = 0; i < definition.length; i++) {
                var item = definition[i]
                if (item["@role"] === "drol:short") {
                    if (item["keyValue"] && item["keyValue"].length > 0) {
                        tagItem.attr('title', item["keyValue"])
                        break;
                    }
                }
            }
        }
    }

    removeContentProfile(contentProfile) {
        this.props.removeContentProfile(contentProfile)
    }
}

export default ContentprofileItemComponent