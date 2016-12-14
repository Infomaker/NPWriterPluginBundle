'use strict';

import TagEditBase from './TagEditBaseComponent'

class TagInfoComponent extends TagEditBase {

    constructor(...args) {
        super(...args)
    }

    render($$) {
        const el = $$('div').addClass('tag-edit-base')

        const shortDescription = this.getConceptDefinition('drol:short')

        if(shortDescription) {
            const shortDescEl = $$('p').append(shortDescription.keyValue)
            el.append(shortDescEl)
        }


        const longDescription = this.getConceptDefinition('drol:long')
        if(longDescription) {
            const longDescEl = $$('p').append(longDescription.keyValue)
            el.append(longDescEl)
        }

        return el
    }

    onClose() {

    }

}

export default TagInfoComponent