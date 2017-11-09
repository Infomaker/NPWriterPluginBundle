import {Component} from 'substance'
import PaginationComponent from './PaginationComponent'

/**
 * props.totalHits
 * props.limit
 * props.start
 */
class ImageListComponent extends Component {

    render($$) {
        if (this.props.totalHits > 0) {
            return $$('div').addClass('image-list-container')
                .append(
                    $$('div').addClass('image-list').append(
                        this.props.items.map((item) => {
                            return $$('div').addClass('image-thumb')
                                .append(
                                    $$('img', {
                                        src: item.thumbnail
                                    }).attr('alt', item.Caption)
                                )
                        })
                    ),
                    $$(PaginationComponent, {
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