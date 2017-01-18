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

    render($$) {
        const el = $$('div').addClass('jobimages')

        const imageList = $$(JobImagesListComponent, {
            jobImages: this.state.jobImages
        }).ref('imageList')

        el.append($$('h2').append(this.getLabel('Newspilot job images loaded!')))
        el.append(imageList)

        return el;
    }
}

export default JobComponent