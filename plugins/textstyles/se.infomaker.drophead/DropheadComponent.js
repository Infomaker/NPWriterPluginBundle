import TextstyleComponent from '../TextstyleComponent'

class DropheadComponent extends TextstyleComponent {
    render($$) {
        return super.render($$, {
            textClassName: 'sc-drophead',
            labelClassName: 'sc-drophead-label',
            shortLabel: this.getLabel('drophead.short'),
            longLabel: this.getLabel('drophead')
        })
    }
}

export default DropheadComponent
