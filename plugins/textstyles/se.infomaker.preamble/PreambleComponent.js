import TextstyleComponent from '../TextstyleComponent'

class PreambleComponent extends TextstyleComponent {
    render($$) {
        return super.render($$, {
            textClassName: 'sc-preamble',
            labelClassName: '',
            shortLabel: this.getLabel('preamble.short'),
            longLabel: this.getLabel('preamble')
        })
    }
}

export default PreambleComponent
