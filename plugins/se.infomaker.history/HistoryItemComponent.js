import {Component} from 'substance'
import {lodash, moment} from 'writer'

const isArray = lodash.isArray

class HistoryItemComponent extends Component {

    render($$) {
        var version = this.props.version;

        var icon, title;

        if(this.context.api.newsItemArticle.firstElementChild.outerHTML === version.src) {
            icon = 'fa fa-check';
            title = this.getLabel('Identical with the active version');
        }
        else {
            icon = 'fa fa-file-text-o';
        }

        var outer = $$('div')
            .addClass('history-version-item light')
            .append(
                $$('i').addClass(icon).attr('title', title)
            ).on('click', () => {
                this.props.applyVersion(version, this.props.article)
            });

        var inner = $$('div');

        inner.append(
            $$('span').append(moment(version.time).from())
        );

        if (version.action === 'saved') {
            inner.addClass('saved');
        }

        outer.append(inner);
        return outer;
    }

}
export default HistoryItemComponent

