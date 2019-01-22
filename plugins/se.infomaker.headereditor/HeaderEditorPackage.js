
import './scss/_metadata.scss'
import HeaderEditorNode from './HeaderEditorNode'
import HeaderEditorComponent from './HeaderEditorComponent'
import HeaderEditorConverter from './HeaderEditorConverter'
import {registerPlugin} from 'writer'


const HeaderEditorPackage = {
    id: 'se.infomaker.headereditor',
    name: 'headereditor',
    version: '{{version}}',
    configure: (config) => {

        config.addNode(HeaderEditorNode)
        config.addConverter(HeaderEditorConverter)
        config.addTextEditComponent(HeaderEditorNode.type, HeaderEditorComponent, {display:'top'})

        config.addLabel('leadin', {
            en: 'Leadin',
            sv: 'Ingress'
        })

    }
}

export default () => {
    if (registerPlugin) {
        registerPlugin(HeaderEditorPackage)
    } else {
        console.info("Register method not yet available");
    }
}

