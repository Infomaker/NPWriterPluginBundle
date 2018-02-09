import ConceptPublicationChannelPackage from './ConceptPublicationChannelPackage'
import { registerPlugin } from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(ConceptPublicationChannelPackage)
    }
    else {
        console.info("Register method not yet available");
    }
}