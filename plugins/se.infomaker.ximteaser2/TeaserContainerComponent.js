import {Component} from 'substance'
import {api} from 'writer'
import TeaserContainerMenu from './TeaserContainerMenu'
import TeaserComponent from './TeaserComponent'

class TeaserContainerComponent extends Component {

    getInitialState() {
        return {
            activeTeaserId: this.props.node.nodes[0]
        }
    }

    dispose() {
        // Clean up any remaining Teaser Nodes
        this.context.editorSession.transaction((tx) => {
            this.props.node.nodes.forEach((teaserNodeId) => {
                tx.delete(teaserNodeId)
            })
        })
    }

    addTeaser({type}) {
        const newTeaserNodeId = this.context.commandManager.executeCommand('insertTeaser', {type: type, teaserContainerNode: this.props.node})
        this.extendState({
            activeTeaserId: newTeaserNodeId
        })
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
            this.extendState({
                activeTeaserId: this.props.node.nodes[0]
            })
        } else {
            this.rerender()
        }
    }

    selectTeaser(teaserNode) {
        this.extendState({
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

        const currentTeaserNode = this._getActiveTeaserNode()
        if(currentTeaserNode) {
            const teaser = $$(TeaserComponent, {
                node: currentTeaserNode,
                isolatedNodeState: this.props.isolatedNodeState
            }).ref('currentTeaser')
            el.append(teaser)
        }

        return el
    }

    /**
     * Hook into substance's dropzones package
     *
     * @see Dropzones._computeDropzones
     */
    getDropzoneSpecs() {
        const currentTeaserNode = this._getActiveTeaserNode()
        const label = currentTeaserNode.imageFile ? 'Replace Image' : 'Add Image'

        return [{
            component: this,
            message: this.getLabel(label),
            dropParams: {
                action: 'replace-image',
                nodeId: this.props.node.id,
            }
        }]
    }

    /**
     * Handles onDragEnd event registered in substance's DragManager
     *
     * @see DragManager
     * @param tx
     * @param dragState
     */
    handleDrop(tx, dragState) {
        api.editorSession.executeCommand('insertTeaserImage', {
            data: {
                activeTeaserId: this.state.activeTeaserId,
                imageEntity: dragState,
                tx
            },
            context: {node: this.props.node}
        })
    }

    _getActiveTeaserNode() {
        return this.context.doc.get(this.state.activeTeaserId)
    }

}

export default TeaserContainerComponent