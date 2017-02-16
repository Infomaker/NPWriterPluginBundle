import "./scss/conflicthandler.scss";
import {Component, FontAwesomeIcon} from "substance";
import {api} from "writer";

class DefaultConflictHandler extends Component {

    constructor(...args) {
        super(...args)
    }

    render($$) {
        const el = $$('div').addClass('conflicthandler')

        el.append([
            $$('h2').append(this.getLabel('conflicthandler-header')),
            $$('p').append(this.getLabel('conflicthandler-description')),
            $$('a').on('click', () => this.resolveConflict()).append(
                $$('a')
                    .append([
                        this.getLabel('conflicthandler-commandtext'),
                        $$(FontAwesomeIcon, {icon: 'fa-wrench'})]
                    )
            )
        ])

        return el;
    }

    resolveConflict() {
        api.history.deleteHistory(this.props.uuid)
        api.article.openInNewWindow(this.props.uuid)
        this.props.api.newsItem.invalidate()
        if (typeof this.props.close === 'function') {
            this.props.close()
        }
    }

    onClose() {
        this.props.api.newsItem.invalidate()
    }

}

export default DefaultConflictHandler
