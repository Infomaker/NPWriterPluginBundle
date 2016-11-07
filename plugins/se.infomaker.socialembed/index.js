import './scss/socialembed.scss'

import SocialembedPackage from './SocialembedPackage'
const {registerPlugin} = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(SocialembedPackage)
    } else {
        console.info("Register method not yet available");
    }
}
