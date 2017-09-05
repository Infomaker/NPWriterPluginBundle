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

        const teaserNodes = this.props.node.nodes.map(teaserNodeId => {
            const teaserNode = this.context.api.doc.get(teaserNodeId)
            return teaserNode.dataType
        })

        const items = this.props.availableTeaserTypes.filter(({type}) => {
            return teaserNodes.includes(type) === false
        })

        return $$(MenuTabAddButton, {
            items: items,
            add: this.props.addTeaser
        })
    }

    getConfigForTeaserType(dataType) {
        return this.props.availableTeaserTypes.find(teaserType => {
            return teaserType.type === dataType
        })
    }

    getMenuItem($$, teaserNode) {
        const item = $$('li')

        const teaserConfig = this.getConfigForTeaserType(teaserNode.dataType)

        const typeIcon = $$(FontAwesomeIcon, {icon: teaserConfig.icon})
        const title = $$('span').addClass('title').append(teaserConfig.label)
        const icon = $$(FontAwesomeIcon, {icon: 'fa-trash'})

        item.append([typeIcon, title, icon])

        icon.on('click', () => {
            this.props.removeTeaser(teaserNode)
        })

        return item
    }

}

export default TeaserContainerMenu