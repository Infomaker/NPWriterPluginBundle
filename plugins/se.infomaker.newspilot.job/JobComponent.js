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
                    url: "http://vignette3.wikia.nocookie.net/lovecraft/images/9/9a/HickmanCthulhu.jpg"
                },
                {
                    name: "Cthulhu C.jpg",
                    url: "http://img05.deviantart.net/067d/i/2014/177/6/2/cthulhu_by_glooh-d7o0g9p.jpg"
                }
            ]
        }
    }

    _onDragStart(e) {
        e.stopPropagation()
    }

    render($$) {
        const el = $$('div').addClass('jobimages')

        const imageList = $$(JobImagesListComponent, {
            jobImages: this.state.jobImages
        }).ref('imageList')

        el.append($$('h2').append(this.getLabel('Bilder')))
        el.append(imageList)

        return el;
    }
}

export default JobComponent