import TextstyleComponent from '../TextstyleComponent'

class BlockquoteComponent extends TextstyleComponent {
    render($$) {
        return super.render($$, {
            textClassName: 'sc-blockquote',
            labelClassName: '',
            shortLabel: this.getLabel('blockquote.short'),
            longLabel: this.getLabel('blockquote')
        })
    }
}

export default BlockquoteComponent
