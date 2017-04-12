import './scss/contentrelations.scss'

import ContentRelationsPckage from './ContentrelationsPackage'
const { registerPlugin } = writer

(() => {
    if (registerPlugin) {
        registerPlugin(ContentRelationsPckage)
    } else {
        console.info("Register method not yet available");
    }
})()
