import {Component, FontAwesomeIcon} from 'substance'
import MenuTabAddButton from './MenuTabAddButton'

class TeaserContainerMenu extends Component {

    render($$) {

        const teasers = this.props.node.nodes.map((teaserNodeId) => {
            const teaserNode = this.context.api.doc.get(teaserNodeId)
            return this.getMenuItem($$, teaserNode)
        })


        teasers.push(this.getAddButton($$))

        return $$('ul').addClass('teaser-menu').append(teasers)
    }

    getAddButton($$) {
        return $$(MenuTabAddButton, {
            items: this.props.teaserTypes,
            add: this.props.addTeaser
        })
    }

    getMenuItem($$, teaserNode) {
        const item = $$('li')
        const title = $$('span').addClass('title').append(teaserNode.label)
        const icon = $$(FontAwesomeIcon, {icon: 'fa-trash'})

        item.append([title, icon])

        item.on('click', () => {
            this.props.removeTeaser(teaserNode)
        })

        return item
    }

}

export default TeaserContainerMenu