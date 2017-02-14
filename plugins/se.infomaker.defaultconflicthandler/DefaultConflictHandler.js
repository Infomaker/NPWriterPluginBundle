import './scss/conflicthandler.scss'
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
            $$(FontAwesomeIcon, {icon: 'fa-wrench'}),
            $$('a').on('click', () => this.resolveConflict()).append(this.getLabel('conflicthandler-linktext'))
        ])

        return el;
    }

    resolveConflict() {
        api.newsItem.invalidate()
        api.history.deleteHistory(this.props.uuid)
        api.article.openInNewWindow(this.props.uuid)
    }

    onClose() {

    }

}

export default DefaultConflictHandler
