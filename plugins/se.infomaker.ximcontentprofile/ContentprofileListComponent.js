import {Component} from 'substance'
import ContentprofileItemComponent from './ContentprofileItemComponent'

class ContentprofileListComponent extends Component {

    constructor(...args) {
        super(...args)
        this.name = 'ximcontentprofile'
    }

    render($$) {
        const existingContentProfiles = this.props.existingContentProfiles
        const contentProfilesList = $$('ul').addClass('tag-list')

        existingContentProfiles.forEach((contentProfile) => {
            // TODO: Watch this reference for memory leaks
            contentProfilesList.append($$(ContentprofileItemComponent, {
                contentProfile: contentProfile,
                openContentProfile: this.props.openContentProfile.bind(this),
                removeContentProfile: this.deleteContentProfileAndReference.bind(this)
            }).ref(contentProfile.uuid));
        });

        return contentProfilesList;
    }

    deleteContentProfileAndReference(contentProfile) {
        this.refs[contentProfile.uuid].remove()
        delete this.refs[contentProfile.uuid];
        this.props.removeContentProfile(contentProfile);
    }
}

export default ContentprofileListComponent