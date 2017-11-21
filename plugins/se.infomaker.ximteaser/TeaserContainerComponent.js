import {Component} from 'substance'
import {api} from 'writer'
import dragStateDataExtractor from './dragStateDataExtractor'
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
        }, this)
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    addTeaser({type}) {
        const node = this.props.node
        this.selectContainer()

        const newTeaserNodeId = this.context.commandManager.executeCommand('ximteaser.insert-teaser', {type: type, teaserContainerNode: node})
        this.extendState({
            activeTeaserId: newTeaserNodeId
        })
    }

    removeTeaser(teaserNode) {
        const node = this.props.node

        // Set selection to container node to avoid odd behavior if any child FieldEditorComponent is selected
        // during teaser removal
        this.selectContainer()

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

    selectContainer() {
        const comp = this.getParent()
        comp.extendState({mode: 'selected', unblocked: true})
        comp.selectNode()
    }

    selectTeaser(teaserNode) {
        this.extendState({
            activeTeaserId: teaserNode.id
        })
    }

    render($$) {
        const availableTeaserTypes = this.context.api.getConfigValue('se.infomaker.ximteaser', 'types', [])
        if(availableTeaserTypes.length === 0) {
            return $$('span').append('No types defined for se.infomaker.ximteaser')
        }

        const el = $$('div').addClass('im-blocknode__container')

        el.append($$(TeaserContainerMenu, {
            node: this.props.node,
            activeTeaserId: this.state.activeTeaserId,
            availableTeaserTypes,
            selectContainer: this.selectContainer.bind(this),
            removeTeaser: this.removeTeaser.bind(this),
            addTeaser: this.addTeaser.bind(this),
            selectTeaser: this.selectTeaser.bind(this)
        }).ref('menu'))

        const currentTeaserNode = this._getActiveTeaserNode()
        if(currentTeaserNode) {
            const teaser = $$(TeaserComponent, {
                node: currentTeaserNode,
                isolatedNodeState: this.props.isolatedNodeState,
                selectContainer: this.selectContainer.bind(this)
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
        const label = currentTeaserNode.imageFile ? 'teaser-replace-image-or-article' : 'teaser-add-image-or-article'

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
        const dragData = dragStateDataExtractor.extract(dragState)
        let command

        if (dragData.type === 'article') {
            const {name, uuid} = dragData.uriData
            console.info('Article dropped!', { uuid, name })
            command = 'ximteaser.insert-article'
        } else {
            command = 'ximteaser.insert-image'
        }

        api.editorSession.executeCommand(command, {
            tx,
            context: {node: this._getActiveTeaserNode()},
            data: dragData
        })
    }

    _getActiveTeaserNode() {
        return this.context.doc.get(this.state.activeTeaserId)
    }
}

export default TeaserContainerComponent
