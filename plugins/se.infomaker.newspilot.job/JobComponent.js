import {Component} from 'substance'
import JobImagesListComponent from './JobImagesListComponent'

class JobComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    getInitialState() {
        return {
            jobImages: [
                "image1",
                "image2",
                "image3"
            ]
        }
    }

    _onDragStart(e) {
        e.stopPropagation()
    }

    render($$) {
        const el = $$('div').addClass('jobimages')

        const dummyLink = $$('a')
            .attr('href', 'https://cdn.pixabay.com/photo/2017/01/06/20/43/soap-bubble-1958841_640.jpg')
            .attr('draggable', true)
            .on('click', function (evt) {
                evt.stopPropagation();
            })
            .on('dragstart', this._onDragStart, this)
            .append("Hello image")


        const imageList = $$(JobImagesListComponent, {
            jobImages: this.state.jobImages
        }).ref('imageList')

        el.append($$('h2').append(this.getLabel('Newspilot job images loaded!')))
        el.append(imageList)
        el.append(dummyLink)

        return el;
    }
}

export default JobComponent