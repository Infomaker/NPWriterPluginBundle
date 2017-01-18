import {Component} from 'substance'
import JobImageItem from './JobImageItem'

class JobImagesListComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    render($$) {
        const jobImages = this.props.jobImages

        const imageList = $$('ul').addClass('job__item-list')

        const imageElements = jobImages.map((image) => {
            return $$(JobImageItem, {jobImage: image})
        }, this)

        imageList.append(imageElements)

        return imageList
    }

}

export default JobImagesListComponent

