import {Component} from 'substance'
import {UIPagination} from 'writer'
import ArchiveImageComponent from './ArchiveImageComponent'
import ImageMetaPopup from './ImageMetaPopup'

/**
 * @class ImageListComponent
 *

 * @property {Object}   props
 * @property {Array}    props.items         Result set which should render
 * @property {Function} props.onPageChange  Callback from paginator component when page is changed
 * @property {Integer}  props.totalHits     Total number of hits returned by search
 * @property {Integer}  props.limit
 * @property {Integer}  props.start
 */
class ImageListComponent extends Component {

    render($$) {
        if (this.props.totalHits > 0) {
            return $$('div').addClass('image-list-container')
                .append(
                    $$('div').addClass('image-list').append(
                        [
                            ...this.props.items.map((item) => {
                                return $$(ArchiveImageComponent, {
                                    item,
                                    onClick: ({item, position}) => {
                                        const imageMetaPopup = this.refs.imageMetaPopup
                                        const updatedProps = {}
                                        if (imageMetaPopup.props.imageItem && imageMetaPopup.props.imageItem.uuid === item.uuid) {
                                            updatedProps.imageItem = null
                                        } else {
                                            updatedProps.imageItem = item
                                            updatedProps.position = position
                                        }

                                        imageMetaPopup.extendProps(updatedProps)
                                    }
                                })
                            }),
                            $$(ImageMetaPopup, {
                                imageItem: null,
                                position: 0
                            }).ref('imageMetaPopup')
                        ]
                    ),
                    $$(UIPagination, {
                        currentPage: Math.ceil((this.props.start / this.props.limit) + 1),
                        totalPages: Math.ceil(this.props.totalHits / this.props.limit),
                        onPageChange: this.props.onPageChange
                    })
                )
        } else {
            return $$('span')
        }
    }

}

export default ImageListComponent