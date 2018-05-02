import {api} from 'writer'
import {Component} from 'substance'

import UIOptions from './OptionsComponent'

/**
 * @class MainComponent
 */
class MainComponent extends Component {

    constructor(...args) {
        super(...args)
        this.onLanguageClick = this.onLanguageClick.bind(this)
    }

    render($$) {
        return $$('div').addClass('im-articlelanguage').append(
            $$('h2').append(this.getLabel('Article Language')),
            $$(UIOptions, {
                multiValue: false,
                identifier: 'code',
                options: this.languageOptions,
                selectedOptions: [this.state.articleLanguage],
                onClick: this.onLanguageClick
            })
        )
    }

    onLanguageClick(selectedOptions) {
        const [option] = selectedOptions

        console.log(option)
    }

    get languageOptions() {
        return api.getConfigValue('se.infomaker.articlelanguage', 'languages', [])
    }
}

export default MainComponent
