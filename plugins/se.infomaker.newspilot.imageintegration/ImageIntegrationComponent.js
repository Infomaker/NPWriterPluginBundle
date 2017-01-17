import {Component} from 'substance'
import ImageIntegrationListComponent from './ImageIntegrationListComponent'

class ImageIntegrationComponent extends Component {

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

        const imageList = $$(ImageIntegrationListComponent, {
            jobImages: this.state.jobImages
        }).ref('imageList')

        el.append($$('h2').append(this.getLabel('Newspilot job images loaded!')))
        el.append(imageList)

        return el;
    }
}

export default ImageIntegrationComponent