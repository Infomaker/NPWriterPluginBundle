import './scss/publicationchannel.scss'

import PublicationChannel from './Publicationchannel'
const { registerPlugin } = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(PublicationChannel)
    } else {
        console.info("Register method not yet available");
    }
}
