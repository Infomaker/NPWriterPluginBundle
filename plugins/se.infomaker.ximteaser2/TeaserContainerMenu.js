import {Component} from 'substance'

class TeaserContainerMenu extends Component {

    render($$) {

        const teasers = this.props.node.nodes.map((teaserNodeId) => {
            const teaserNode = this.context.api.doc.get(teaserNodeId)
            return $$('li').append(teaserNode.title)
        })

        return $$('ul').append(teasers)
    }

}

export default TeaserContainerMenu