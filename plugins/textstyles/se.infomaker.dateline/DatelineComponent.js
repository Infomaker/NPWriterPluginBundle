import TextstyleComponent from '../TextstyleComponent'

class DatelineComponent extends TextstyleComponent {
    render($$) {
        return super.render($$, {
            textClassName: 'sc-dateline',
            labelClassName: 'sc-dateline-label',
            shortLabel: this.getLabel('dateline.short'),
            longLabel: this.getLabel('dateline')
        })
    }
}

export default DatelineComponent
