import TextstyleComponent from '../TextstyleComponent'

class SubheadlineComponent extends TextstyleComponent {
    render($$) {
        return super.render($$, {
            textClassName: 'sc-subheadline',
            labelClassName: 'sc-subheadline-label',
            shortLabel: this.getLabel('subheadline.short'),
            longLabel: this.getLabel('subheadline')
        })
    }
}

export default SubheadlineComponent
