import TextstyleComponent from '../TextstyleComponent'

class ParagraphComponent extends TextstyleComponent {
    render($$) {
        return super.render($$, {
            textClassName: 'sc-paragraph',
            labelClassName: '',
            shortLabel: this.getLabel('paragraph.short'),
            longLabel: this.getLabel('paragraph')
        })
    }
}

export default ParagraphComponent
