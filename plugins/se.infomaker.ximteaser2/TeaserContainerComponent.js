import {Component} from 'substance'
import TeaserContainerMenu from './TeaserContainerMenu'

class TeaserContainerComponent extends Component {

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

            if(change.isAffected(this.props.node.id)) {
                this.rerender()
            }
        }, this)
    }


    addTeaser({type}) {
        this.context.editorSession.executeCommand('insertTeaser', {type: type, teaserContainerNode: this.props.node})
    }

    removeTeaser(teaserNode) {
        const node = this.props.node
        this.context.editorSession.transaction(tx => {
            tx.set([node.id, 'nodes'], node.nodes.filter(childNode => {
                return childNode !== teaserNode.id
            }))
            tx.delete(teaserNode.id)
        })
        this.rerender()
    }

    render($$) {

        const el = $$('div').addClass('im-blocknode__container')

        el.append($$(TeaserContainerMenu, {
            node: this.props.node,
            availableTeaserTypes: this.context.api.getConfigValue('se.infomaker.ximteaser2', 'types', []),
            removeTeaser: this.removeTeaser.bind(this),
            addTeaser: this.addTeaser.bind(this)
        }))


        return el
    }

}

export default TeaserContainerComponent