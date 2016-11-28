import {Component} from 'substance'
import ArticleItem from './ArticleItem'

class VersionSelectorDialog extends Component {
    render($$) {
        const el = $$('div').addClass('restore-history-dialog');
        const unsavedArticles = this.props.unsavedArticles;

        el.append($$('p').append(this.getLabel(this.props.descriptionText)))
        let versions = unsavedArticles.map((article) => {
            return $$(ArticleItem, {article: article, applyVersion: this.applyVersion.bind(this)})
        });

        el.append(versions)
        return el;
    }

    applyVersion(version, article) {
        this.props.applyVersion(version, article)
    }


    onClose(status) {
        if ('cancel' === status) {
            return true;
        }

        return true;
    }

}
export default VersionSelectorDialog