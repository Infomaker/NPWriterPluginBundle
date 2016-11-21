import {Component} from 'substance'

class ContentRelationsComponent extends Component {

    render($$) {

        var el = $$('div').addClass('x-im-contentrelations-content')

        let link = $$('a').append(this.props.node.label)
            .attr('href', "#" + this.props.node.uuid)
            .attr('target', '_blank')
            .on('click', function (evt) {
                evt.stopPropagation();
            })

        el.append(link)
        el.addClass('x-im-contentrelations')
        el.attr('contentEditable', false);
        return el
    }
}
export default ContentRelationsComponent