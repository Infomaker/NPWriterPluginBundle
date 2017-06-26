import TextstyleComponent from '../TextstyleComponent'

class HeadlineComponent extends TextstyleComponent {
    render($$) {
        return super.render($$, {
            textClassName: 'sc-headline',
            labelClassName: 'sc-headline-label',
            shortLabel: this.getLabel('headline.short'),
            longLabel: this.getLabel('headline')
        })
    }
}

export default HeadlineComponent
