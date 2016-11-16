import {Component} from 'substance'
import {api} from 'writer'
class SearchResultItem extends Component {

    didMount() {
        this.el.on('dragstart', this._onDragStart, this)
        // this.el.on('dragend', this._onDragEnd, this)
        // this.el.on('drop', this._onDrop, this)
    }

    _onDragStart(e) {
        e.stopPropagation()
        let data = {
            item: this.props.item
        }
        let dropData = window.btoa(JSON.stringify(data))
        e.dataTransfer.setData('text/uri-list', 'http://contentrelations?data='+dropData);
    }

    render($$) {

        return $$('li').attr('draggable', true).append(this.props.item.name).ref('item')
    }
}
export default SearchResultItem