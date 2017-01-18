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

        const listItemLink = $$('a')
            .attr('href', jobImage.url)
            .attr('draggable', true)
            .on('click', function (evt) {
                evt.stopPropagation()
            })
            .on('dragstart', this._onDragStart, this)

        const listItem = $$('li').addClass('image')
        const label = $$('span').addClass('title').append(jobImage.name)
        const icon = $$('img').attr('src', jobImage.url).addClass('image-icon')

        listItem.append([icon, label])
        listItemLink.append(listItem)

        return listItemLink
    }

    _onDragStart(e) {
        e.stopPropagation()
    }
}

export default JobImageItem
