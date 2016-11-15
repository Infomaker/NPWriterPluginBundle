import {Component} from 'substance'
import ContentSearchComponent from './ContentSearchComponent'

class ContentRelationsMainComponent extends Component {

    render($$) {
        var el = $$('div').ref('relationsContainer').addClass('authors').append($$('h2').append(this.getLabel('ContentRelations')));

        el.append($$(ContentSearchComponent));

        return el;
    }
}


export default ContentRelationsMainComponent