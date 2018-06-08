import {api} from 'writer'
import {Component} from 'substance'

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
        const direction = api.newsItem.getTextDirection()
        const languageCode = api.newsItem.getLocale()
        this.setEditorLanguage(languageCode, direction)

        const current = this.languageOptions.find(option => {
            return option.code === languageCode
        })

        this.props.popover.setTitle(current && current.label ? current.label : languageCode)
    }

    render($$) {
        return $$('ul')
            .addClass('im-articlelanguage context-menu')
            .append(
                ...this.languageOptions.map(option => this.renderOption($$, option))
            )
    }

    renderOption($$, option) {
        return $$('li')
            .addClass(this.state.articleLanguage === option.code ? 'active' : '')
            .on('click', () => this.onLanguageClick(option))
            .append(`${option.label}`)
    }

    onLanguageClick(option) {
        const languageCode = option ? option.code : this.defaultLanguage
        const direction = option ? option.direction : 'ltr'

        this.setEditorLanguage(languageCode, direction)
        this.setArticleLanguage(languageCode, direction)
        this.props.popover.setTitle(option && option.label ? option.label : languageCode)
    }

    /**
     * Sets language for the editor interface, updates plugin's state
     *
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

    /**
     * Updates xml:lang-property in NewsML article
     *
     * @param languageCode
     * @param direction
     */
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
