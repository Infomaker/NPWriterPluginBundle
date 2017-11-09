import {Component} from 'substance'
import ImageListComponent from './ImageListComponent'
import SearchComponent from './SearchComponent'

class MainComponent extends Component {

    shouldRerender(newProps, newState) {
        return false
    }

    render($$) {

        return $$('div').addClass('im-archivesearch').append(
            $$(SearchComponent, {
                onResult: ({items, totalHits, limit, start}) => {
                    this.refs.imageList.extendProps({
                        items,
                        totalHits,
                        limit,
                        start
                    })
                },
                clearResult: () => {
                    this.refs.imageList.extendProps({
                        items: [],
                        totalHits: 0,
                        limit: 0,
                        start: 0,
                    })
                }
            }).ref('searchComponent'),
            $$(ImageListComponent, {
                items: [],
                totalHits: 0,
                limit: 0,
                start: 0,
                onPageChange: (pageNumber) => {
                    const pageIndex = pageNumber - 1
                    this.context.api.events.triggerEvent(null, 'archive:pageChange', {
                        pageIndex
                    })
                }
            }).ref('imageList')
        )
    }
}

export default MainComponent
