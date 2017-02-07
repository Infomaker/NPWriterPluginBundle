import {Component} from 'substance'
import ArticleItem from './ArticleItem'

class VersionSelectorDialog extends Component {
    getInitialState() {
        return {
            advanced: false
        }
    }

    render($$) {
        const el = $$('div')
            .addClass('restore-history-dialog')
            .append(
                $$('p').append(
                    this.props.descriptionText
                )
            )

        // if (this.props.existingArticle) {
        let toggleTitle = this.getLabel('Show advanced list of changes')
        if (this.state.advanced) {
            toggleTitle = this.getLabel('Hide advanced list of changes')
        }

        el.append(
            $$('a').append([
                toggleTitle,
                $$('i').addClass(this.state.advanced ? 'fa fa-arrow-circle-down' : 'fa fa-arrow-circle-right')
            ])
            .addClass(this.state.advanced ? 'advanced' : 'simple')
            .on('click', () => {
                this.extendState({
                    advanced: !this.state.advanced
                })
            })
        )
        // }

        // if (!this.props.existingArticle || (this.props.existingArticle && this.state.advanced)) {
        if (this.state.advanced) {
            let versions = this.props.unsavedArticles.map((article) => {
                return $$(ArticleItem, {article: article, applyVersion: this.applyVersion.bind(this)})
            })

            el.append(
                $$('div').append(versions)
            )
        }

        return el
    }

    applyVersion(version, article) {
        this.props.applyVersion(version, article)
    }

    onClose(status) {
        if ('cancel' === status) {
            return true
        }

        return true
    }

}
export default VersionSelectorDialog
