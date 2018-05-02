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

        this.context.editorSession.onUpdate(this._onUpdate.bind(this))
    }

    dispose() {
        this.context.editorSession.off(this)
    }

    /**
     * @param {EditorSession} change
     * @private
     */
    _onUpdate(change) {
        if (change.hasLanguageChanged()) {
            api.events.languageChanged()
        }
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
        const languageCode = option ? option.code : this.defaultLanguage
        const direction = option ? option.direction : 'ltr'

        this.setEditorLanguage(languageCode, direction)
        this.setArticleLanguage(languageCode, direction)
    }

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

    setArticleLanguage(languageCode, direction) {
        const [type, subtype] = languageCode.split('_')
        const xmlLanguageCode = `${type}-${subtype}`

        api.newsItem.setLanguage(this.pluginId, xmlLanguageCode, direction)
    }

    get defaultLanguage() {
        return api.configurator.getLocale()
    }

    get pluginId() {
        return 'se.infomaker.articlelanguage'
    }

    get languageOptions() {
        return api.getConfigValue(this.pluginId, 'languages', [])
    }
}

export default MainComponent
