import loadIframelyScript from './loadIframelyScript';
import { api } from 'writer'
import IframelyNode from './IframelyNode'
import IframelyMacro from './IframelyMacro'
import IframelyComponent from './IframelyComponent'
import IframelyConverter from './IframelyConverter'
import IframelyDropHandler from './IframelyDropHandler'
import './scss/iframely.scss'

const IframelyPackage = {
    name: IframelyNode.type,
    id: `se.infomaker.${IframelyNode.type}`,
    version: '{{version}}',
    configure: function (config) {

        if (!api.getConfigValue('se.infomaker.iframely', 'apiKey')) {
            throw new Error('Iframely API key must be set in config')
        }

        config.addNode(IframelyNode)
        config.addComponent(IframelyNode.type, IframelyComponent)
        config.addConverter('newsml', IframelyConverter)

        // Interactions
        config.addMacro(IframelyMacro)
        config.addDropHandler(new IframelyDropHandler())

        // Labels
        config.addLabel('iframely-loading-message', {
            en: 'Loading content from Iframely',
            sv: 'Hämtar innehåll från Iframely'
        })

        config.addLabel('iframely-failed-to-fetch', {
            en: 'Could not fetch the specified URL',
            sv: 'URL:en kunde inte hämtas'
        })

        // Iframely requires their embed.js script to be loaded for their iframes to function properly
        // See: https://iframely.com/docs/omit-script
        loadIframelyScript()
    }
}

export default IframelyPackage
