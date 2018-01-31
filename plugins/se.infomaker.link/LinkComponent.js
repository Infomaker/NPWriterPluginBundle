import { AnnotationComponent } from 'substance'

/**
 * @typedef Component.LinkComponent.Props
 * @property {Node} node - The node
 */

/**
 * A clickable link component
 * @memberof Component
 *
 * @param {Component.LinkComponent.Props} props
 * @property {Component.LinkComponent.Props} props
 */
class LinkComponent extends AnnotationComponent {

    didMount(...args) {
        super.didMount(...args)

        let node = this.props.node
        this.context.editorSession.onRender('document', this.rerender, this, {
            path: [node.id, 'url']
        })
    }

    dispose(...args) {
        super.dispose(...args)

        this.context.editorSession.off(this)
    }

    render($$) { // eslint-disable-line
        let el = super.render($$)

        el.tagName = 'a'
        el.attr('href', this.props.node.url)

        let titleComps = [this.props.node.url]
        if (this.props.node.title) {
            titleComps.push(this.props.node.title)
        }

        return el.attr("title", titleComps.join(' | '))
    }

}

export default LinkComponent
