import {registerPlugin} from 'writer'
import ImageGalleryPackage from './ImageGalleryPackage'

export default () => {
    if (registerPlugin) {
        registerPlugin(ImageGalleryPackage)
    }
}
