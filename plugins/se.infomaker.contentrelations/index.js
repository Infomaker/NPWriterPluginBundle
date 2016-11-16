import './scss/contentrelations.scss'

import ContentRelationsPckage from './ContentrelationsPackage'
const { registerPlugin } = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(ContentRelationsPckage)
    } else {
        console.info("Register method not yet available");
    }
}
