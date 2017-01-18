import {Component} from 'substance'
import JobImagesListComponent from './JobImagesListComponent'

class JobComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    getInitialState() {
        return {
            // TODO
            jobImages: [
                {
                    name: "Cthulhu A.jpg",
                    url: "http://vignette3.wikia.nocookie.net/lovecraft/images/6/67/Cthulhu.jpg/revision/latest/zoom-crop/width/240/height/240?cb=20140818055533"
                },
                {
                    name: "Cthulhu B.jpg",
                    url: "http://vignette3.wikia.nocookie.net/lovecraft/images/6/67/Cthulhu.jpg/revision/latest/zoom-crop/width/240/height/240?cb=20140818055533"
                },
                {
                    name: "Cthulhu B.jpg",
                    url: "http://vignette3.wikia.nocookie.net/lovecraft/images/6/67/Cthulhu.jpg/revision/latest/zoom-crop/width/240/height/240?cb=20140818055533"
                }
            ]
        }
    }

    render($$) {
        const el = $$('div').addClass('jobimages')

        const imageList = $$(JobImagesListComponent, {
            jobImages: this.state.jobImages
        }).ref('imageList')

        el.append($$('h2').append(this.getLabel('Bilder i Newspilot jobb')))
        el.append(imageList)

        return el;
    }
}

export default JobComponent