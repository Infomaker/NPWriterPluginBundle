import {registerPlugin} from 'writer'

import HtmlembedNode from './HtmlembedNode'
import HtmlembedConverter from './HtmlembedConverter'
import HtmlembedComponent from './HtmlembedComponent'

import HtmlembedTool from './HtmlembedTool'
import HtmlembedCommand from './HtmlembedCommand'

import HtmlembedEditTool from './HtmlembedEditTool'
import HtmlembedEditCommand from './HtmlembedEditCommand'

const htmlEmbedPackage = {
    id: 'se.infomaker.htmlembed',
    name: 'htmlembed',
    configure: (config) => {

    }
}

export default () => {
    registerPlugin(htmlEmbedPackage)
}
