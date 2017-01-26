'use strict';
import {Component} from 'substance'
import {lodash as _} from 'writer'

var find = _.find
var isArray = _.isArray


class ConceptChannelInfoComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    getConceptDefinition(key) {
        if(!this.props.channel.concept.definition) {
            return null
        }

        // If it's not an array, just make it an array
        var definition = this.props.channel.concept.definition
        if(!isArray(definition)) {
            definition = [definition]
        }

        return find(definition, function (item) {
            return item['@role'] === key
        })
    }

    render($$) {
        var el = $$('div').addClass('tag-edit-base')

        var shortDescription = this.getConceptDefinition('drol:short')
        if(shortDescription) {
            el.append(
                $$('p').append(shortDescription.keyValue)
            )
        }


        var longDescription = this.getConceptDefinition('drol:long');
        if(longDescription) {
            el.append(
                $$('p').append(longDescription.keyValue)
            )
        }

        return el
    }

    onClose() {

    }

}

export default ConceptChannelInfoComponent
