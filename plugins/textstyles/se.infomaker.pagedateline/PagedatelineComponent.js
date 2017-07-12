import TextstyleComponent from '../TextstyleComponent'

class PagedatelineComponent extends TextstyleComponent {

    render($$) {
        return super.render($$, {
            textClassName: 'sc-pagedateline',
            labelClassName: '',
            shortLabel: this.getLabel('pagedateline.short'),
            longLabel: this.getLabel('pagedateline')
        })
    }
}

export default PagedatelineComponent;
