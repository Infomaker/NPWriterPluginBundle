import {Component} from 'substance'

class ImageGalleryComponent extends Component {
    render($$) {
        return $$('div').addClass('im-blocknode__container im-image-gallery')
    }
}

export default ImageGalleryComponent
