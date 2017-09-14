import {Component, FontAwesomeIcon} from 'substance'
import MenuTabAddButton from './MenuTabAddButton'

class TeaserContainerMenu extends Component {

    render($$) {
        // Order teaser elements before rendering tab menu
        const sortedTeaserElements = this._getSortedTeaserNodes()
            .map((teaserNode) => this.getMenuItem($$, teaserNode))

        sortedTeaserElements.push(this.getAddButton($$))

        return $$('ul').addClass('teaser-menu').append(sortedTeaserElements)
    }

    getAddButton($$) {

        const teaserNodes = this._getTeaserNodes().map(({dataType}) => dataType)
        const items = this.props.availableTeaserTypes
            .filter(({type}) => teaserNodes.includes(type) === false)

        return $$(MenuTabAddButton, {
            items: items,
            add: this.props.addTeaser
        })
    }

    getMenuItem($$, teaserNode) {
        const item = $$('li')

        if(this.props.activeTeaserId === teaserNode.id) {
            item.addClass('active')
        }

        const teaserConfig = this._getConfigForTeaserType(teaserNode.dataType)
        const typeIcon = $$(FontAwesomeIcon, {icon: teaserConfig.icon})
        const title = $$('span').addClass('title').append(teaserConfig.label)
        const hasManyTeaserNodes = this.props.node.nodes.length > 1

        item.on('click', () => {
            this.props.selectTeaser(teaserNode)
        })

        item.append([typeIcon, title])

        // Only render remove button when there are many teasers
        if(hasManyTeaserNodes) {
            const removeTeaserIcon = $$(FontAwesomeIcon, {icon: 'fa-times'})
            removeTeaserIcon.on('click', (e) => {
                e.stopPropagation()
                this.props.removeTeaser(teaserNode)
            })
            item.append(removeTeaserIcon)
        }

        return item
    }

    /**
     * Gets config for specified dataType (e.g "x-im/teaser", "x-im/facebook-teaser")
     *
     * @param dataType
     * @private
     */
    _getConfigForTeaserType(dataType) {
        return this.props.availableTeaserTypes.find(teaserType => teaserType.type === dataType)
    }

    /**
     * Get a list of teaserNodes, sorted by the order
     * they appear in the config file. Top down -> Left to right
     *
     * @private
     */
    _getSortedTeaserNodes() {
        const typeConfigWeights = this.props.availableTeaserTypes.reduce((obj, {type}, currentIndex) => {
            obj[type] = currentIndex
            return obj
        }, {})

        return this._getTeaserNodes()
            .sort((teaserNodeA, teaserNodeB) => typeConfigWeights[teaserNodeA.dataType] > typeConfigWeights[teaserNodeB.dataType])
    }

    _getTeaserNodes() {
        return this.props.node.nodes
            .map((teaserNodeId) => this.context.api.doc.get(teaserNodeId));
    }

}

export default TeaserContainerMenu