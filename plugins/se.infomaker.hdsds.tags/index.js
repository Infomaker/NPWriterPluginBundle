import './scss/tags.scss'

import TagsPackage from './TagsPackage'
const { registerPlugin } = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(TagsPackage)
    } else {
        console.info("Register method not yet available");
    }
}
