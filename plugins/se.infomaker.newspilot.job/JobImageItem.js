import {Component, FontAwesomeIcon} from 'substance'

class JobImageItem extends Component {

    getInitialState() {
        // TODO:
    }

    didMount() {
        // TODO:
    }

    render($$) {
        const jobImage = this.props.jobImage

        const listItem = $$('li')
            .addClass('image')
            .attr('draggable', true)
            .on('dragstart', this._onDragStart, this)

        const label = $$('span').addClass('title').append(jobImage.name)

        const icon = $$('img').attr('src', jobImage.url).addClass('image-icon')

        listItem.append([icon, label])

        return listItem
    }

    _onDragStart(e) {
        // TODO:
        console.error('Drag and drop not implemented yet!')
        // e.stopPropagation()
        // e.dataTransfer.setData('text/uri-list', this.dropLink)
    }
}

export default JobImageItem
