import TextstyleComponent from '../TextstyleComponent'

class PreleadinComponent extends TextstyleComponent {
    render($$) {
        return super.render($$, {
            textClassName: 'sc-preleadin',
            labelClassName: '',
            shortLabel: this.getLabel('preleadin.short'),
            longLabel: this.getLabel('preleadin')
        })
    }
}

export default PreleadinComponent
