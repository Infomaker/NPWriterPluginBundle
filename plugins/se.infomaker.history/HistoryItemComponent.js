import {Component} from 'substance'
import {moment} from 'writer'

class HistoryItemComponent extends Component {

    render($$) {
        var version = this.props.version;

        var icon, className, title;

        if(this.context.api.newsItemArticle.firstElementChild.outerHTML === version.src) {
            icon = 'fa fa-check';
            title = this.getLabel('Identical with the current version');
            className = 'identical'
        }
        else {
            icon = 'fa fa-hashtag'
            className = 'not-identical'
        }

        var outer = $$('div')
            .addClass('history-version-item light ' + className)
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
