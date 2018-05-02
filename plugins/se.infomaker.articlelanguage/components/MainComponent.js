import {api} from 'writer'
import {Component} from 'substance'

import UIOptions from './OptionsComponent'

/**
 * @class MainComponent
 */
class MainComponent extends Component {

    getInitialState() {
        return {
            articleLanguage: ''
        }
    }

    constructor(...args) {
        super(...args)
        this.onLanguageClick = this.onLanguageClick.bind(this)
    }

    didMount() {
        const direction = api.editorSession.getTextDirection()
        const languageCode = api.newsItem.getLocale()
        this.setEditorLanguage(languageCode, direction)
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

    /**
     * @param languageCode
     * @param direction
     */
    setEditorLanguage(languageCode, direction = 'ltr') {
        api.editorSession.setLanguage(languageCode)
        api.editorSession.setTextDirection(direction)

        this.extendState({
            articleLanguage: languageCode
        })
    }

        console.log(option)
    }

    get languageOptions() {
        return api.getConfigValue('se.infomaker.articlelanguage', 'languages', [])
    }
}

export default MainComponent
