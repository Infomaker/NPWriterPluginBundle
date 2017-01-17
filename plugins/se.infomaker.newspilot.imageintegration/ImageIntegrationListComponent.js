import {Component} from 'substance'

class ImageIntegrationListComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    render($$) {
        const jobImages = this.props.jobImages
        const imageList = $$('ul').addClass('integrationimages-list')

        const imageElements = jobImages.map((image) => {
            const imageItem = $$('li').addClass('integrationimages-list__item').ref('imageItem')
            const displayNameElement = $$('span').append(image)

            imageItem.append(displayNameElement)

            return imageItem
        }, this)

        imageList.append(imageElements)

        return imageList
    }

}

export default ImageIntegrationListComponent

