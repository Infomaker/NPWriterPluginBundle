import TextstyleComponent from '../TextstyleComponent'

class MadmansrowComponent extends TextstyleComponent {
    render($$) {
        return super.render($$, {
            textClassName: 'sc-madmansrow',
            labelClassName: 'sc-madmansrow-label',
            shortLabel: this.getLabel('madmansrow.short'),
            longLabel: this.getLabel('madmansrow')
        })
    }
}

export default MadmansrowComponent
