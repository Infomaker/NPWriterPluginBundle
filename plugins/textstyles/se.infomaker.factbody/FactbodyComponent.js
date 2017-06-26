import TextstyleComponent from '../TextstyleComponent'

class FactbodyComponent extends TextstyleComponent {
    render($$) {
        return super.render($$, {
            textClassName: 'sc-fact-body',
            labelClassName: '',
            shortLabel: this.getLabel('factbody.short'),
            longLabel: this.getLabel('factbody')
        })
    }
}

export default FactbodyComponent
