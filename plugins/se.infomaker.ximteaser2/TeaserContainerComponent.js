import {Component} from 'substance'
import TeaserContainerMenu from './TeaserContainerMenu'
import TeaserComponent from './TeaserComponent'

class TeaserContainerComponent extends Component {

    getInitialState() {
        return {
            activeTeaserId: this.props.node.nodes[0]
        }
    }

    didMount() {

        // If teaser container is removed we need to make sure that child nodes also is deleted
        this.context.editorSession.onRender('document', (change, info, editorSession) => {
            if (info.action === 'delete' && change.deleted[this.props.node.id]) {
                editorSession.transaction((tx) => {
                    this.props.node.nodes.forEach((teaserNodeId) => {
                        tx.delete(teaserNodeId)
                    })
                })
            }

            this.props.node.nodes.forEach(childNodeId => {
                if (change.isAffected(childNodeId)) {
                    this.rerender()
                }
            })
            if (change.isAffected(this.props.node.id)) {
                this.rerender()
            }
        }, this)
    }


    addTeaser({type}) {
        const res = this.context.editorSession.executeCommand('insertTeaser', {type: type, teaserContainerNode: this.props.node})
    }

    removeTeaser(teaserNode) {
        const node = this.props.node
        this.context.editorSession.transaction(tx => {
            tx.set([node.id, 'nodes'], node.nodes.filter(childNode => {
                return childNode !== teaserNode.id
            }))
            tx.delete(teaserNode.id)
        })

        // If we remove the active teaser we set current teaser to the first one
        if(teaserNode.id === this.state.activeTeaserId) {
            this.setState({
                activeTeaserId: this.props.node.nodes[0]
            })
        } else {
            this.rerender()
        }

    }

    selectTeaser(teaserNode) {
        this.setState({
            activeTeaserId: teaserNode.id
        })
    }

    render($$) {

        const el = $$('div').addClass('im-blocknode__container')

        el.append($$(TeaserContainerMenu, {
            node: this.props.node,
            activeTeaserId: this.state.activeTeaserId,
            availableTeaserTypes: this.context.api.getConfigValue('se.infomaker.ximteaser2', 'types', []),
            removeTeaser: this.removeTeaser.bind(this),
            addTeaser: this.addTeaser.bind(this),
            selectTeaser: this.selectTeaser.bind(this)
        }).ref('menu'))

        const currentTeaserNode = this.context.doc.get(this.state.activeTeaserId)
        if(currentTeaserNode) {
            const teaser = $$(TeaserComponent, {node: this.context.doc.get(this.state.activeTeaserId)}).ref('currentTeaser')
            el.append(teaser)
        }

        return el
    }

}

export default TeaserContainerComponent