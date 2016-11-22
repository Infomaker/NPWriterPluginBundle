import {Component} from 'substance'
import ArticleItem from './ArticleItem'

class VersionSelectorDialog extends Component {
    render($$) {
        var el = $$('div').addClass('restore-history-dialog');
        var unsavedArticles = this.props.unsavedArticles;

        el.append($$('p').append(this.getLabel(this.props.descriptionText)))
        let versions = unsavedArticles.map((article) => {
            return $$(ArticleItem, {article: article, applyVersion: this.applyVersion.bind(this)})
        });

        el.append(versions)
        return el;
    }

    applyVersion(version, article) {

        this.props.applyVersion(version, article)
        // let newProps = Object.assign(this.context.api.refs.writer, {temporaryId: article.id})
        // this.context.api.writer.temporaryArticleID = article.id
        // this.context.api.writer.documentIsUnsaved()
        // this.context.api.newsItem.setSource(version.src, null, true)

        // this.send('close')
        // this.parent.parent.remove();
    }


    onClose(status) {
        if ('cancel' === status) {
            return true;
        }

        return true;
    }

}
export default VersionSelectorDialog