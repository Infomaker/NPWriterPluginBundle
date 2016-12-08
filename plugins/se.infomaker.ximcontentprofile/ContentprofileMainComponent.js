import {Component} from 'substance'
import {api, jxon} from 'writer'
import ContentprofileListComponent from './ContentprofileListComponent'
import ContentprofileDetailComponent from './ContentprofileDetailComponent'
import ContentprofileTemplate from './template/contentprofile'

class ContentprofileMainComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'ximcontentprofile'
    }

    getInitialState() {
        return {
            existingContentProfiles: api.newsItem.getContentProfiles()
        };
    }

    reloadContentProfiles() {
        this.extendState({
            existingContentProfiles: api.newsItem.getContentProfiles()
        })
    }

    render($$) {
        const el = $$('div').ref('contentProfileContainer')
            .addClass('contentProfiles')
            .append($$('h2')
                .append(this.getLabel('Content profile tags')))

        const contentProfileSearchUrl = api.router.getEndpoint()

        const ContentProfileSearchComponent = this.context.componentRegistry.get('form-search')

        const searchComponent = $$(ContentProfileSearchComponent, {
            existingItems: this.state.existingContentProfiles,
            searchUrl: contentProfileSearchUrl + '/api/search/concepts/contentprofiles?q=',
            onSelect: this.addContentProfile.bind(this),
            onCreate: this.saveContentProfile.bind(this),
            createAllowed: true,
            placeholderText: this.getLabel('Search content profile tags')
        }).ref('contentProfileSearchComponent')

        var existingContentProfilesList = $$(ContentprofileListComponent, {
            existingContentProfiles: this.state.existingContentProfiles,
            openContentProfile: this.openContentProfile.bind(this),
            removeContentProfile: this.removeContentProfile.bind(this)
        }).ref('existingContentProfileList');

        el.append(existingContentProfilesList);
        el.append(searchComponent);

        return el;
    }

    removeContentProfile(contentProfile) {
        try {
            api.newsItem.removeLinkByUUID(this.name, contentProfile.uuid)
            this.reloadContentProfiles()
        } catch (e) {
            console.error(e);
        }
    }

    addContentProfile(item) {
        try {
            let contentProfile = {
                title: item.name[0],
                uuid: item.uuid
            }

            api.newsItem.addConceptProfile(this.name, contentProfile)

            this.reloadContentProfiles();
        } catch (e) {
            console.error(e);
        }
    }

    saveContentProfile(item) {
        const parser = new DOMParser();
        const contentProfileXML = parser.parseFromString(ContentprofileTemplate.contentprofile, 'text/xml').firstChild

        var contentProfile = jxon.build(contentProfileXML)
        contentProfile.concept.name = item.inputValue

        this._open(contentProfile, false)
    }

    openContentProfile(item) {
        this._open(item, true)
    }

    _open(item, exists) {
        var editable = true

        var properties = {
            exists: exists,
            contentProfile: item,
            reload: this.reloadContentProfiles.bind(this),
            editable: editable
        };

        api.ui.showDialog(ContentprofileDetailComponent, properties,
            {
                title: this.getLabel('Content profile') + " " + item.concept.name,
                global: true,
                primary: editable ? this.getLabel('Save') : this.getLabel('Close'),
                secondary: editable ? this.getLabel('Cancel') : false
            }
        )
    }
}

export default ContentprofileMainComponent