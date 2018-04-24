import {registerPlugin} from 'writer'
import ArticleLanguagePackage from './ArticleLanguagePackage'

export default () => {
    if (registerPlugin) {
        registerPlugin(ArticleLanguagePackage)
    } else {
        console.error('Register method not yet available')
    }
}
