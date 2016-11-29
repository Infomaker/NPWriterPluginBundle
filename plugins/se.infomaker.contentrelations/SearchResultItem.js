import {Component, FontAwesomeIcon} from 'substance'
import {api} from 'writer'

// ContentRelationsCommand.generateDroplinkForArticle = function (name, uuid) {
//     return "x-im-entity:x-im/article:" + uuid + "?title=" + name;
// };
//
// ContentRelationsCommand.generateDroplinkForImage = function (name, uuid) {
//     return "x-im-entity:x-im/image:" + uuid + "?title=" + name;
// };


class SearchResultItem extends Component {

    getInitialState() {
        return {
            imageLoaded: false,
            imageURL: ''
        }
    }

    getDroplinkForItem(item) {

        const imType = item.imType[0]
        const name = item.name[0]

        let data = {
            uuid: item.uuid,
            imType: imType,
            name: name
        }
        let dropData = window.btoa(JSON.stringify(data))

        switch (imType) {
            case 'article':
                return "x-im-entity:x-im/article?data="+dropData
            case 'image':
                return "x-im-entity:x-im/image?data="+dropData
            default:
                return "x-im-entity:x-im/article?data="+dropData
        }
    }

    didMount() {
        this.dropLink = this.getDroplinkForItem(this.props.item)
    }

    _onDragStart(e) {
        e.stopPropagation()
        console.log("drag", this.getDroplinkForItem(this.props.item));
        e.dataTransfer.setData('text/uri-list', this.dropLink)
    }

    render($$) {

        const item = this.props.item

        return this.getItem($$, item)
    }

    getItem($$, item) {
        const imType = item.imType ? item.imType[0] : 'article'

        switch(imType) {
            case 'article':
                return this.getArticleItem($$, item)
            case 'image':
                return this.getImageItem($$, item)
            default:

        }

    }

    getArticleItem($$, item) {

        const listItem = $$('li')
            .attr('draggable', true)
            .on('dragstart', this._onDragStart, this)

        const icon = $$(FontAwesomeIcon, {icon: 'fa-file-text-o'}).addClass('type-icon')
        const label = $$('span').addClass('title article').append(this.props.item.name)

        listItem.append([icon, label])
        return listItem
    }

    getImageItem($$, item) {


        const listItem = $$('li')
            .attr('draggable', true)
            .on('dragstart', this._onDragStart, this)

        let icon = $$(FontAwesomeIcon, {icon: 'fa-picture-o'})
        const label = $$('span').addClass('title image').append(item.name)

        if(this.state.imageLoaded) {
            icon = $$('img').attr('src', this.state.imageURL).addClass('image-icon')
        } else {
            this.fetchImageURLForUUID(item.uuid)
                .then(url => {
                    this.setState({
                        imageLoaded: true,
                        imageURL: url
                    })
                })
        }

        listItem.append([icon, label])
        return listItem
    }

    fetchImageURLForUUID(uuid) {
        return api.router.get('/api/binary/url/' + uuid+'/50?imType=x-im/image&width=50')

            .then(response => response.text())

            .catch((error) => {
                console.error(error);
            });
    }

}
export default SearchResultItem