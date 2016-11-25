
import './scss/_metadata.scss'
import HeaderEditorNode from './HeaderEditorNode'
import HeaderEditorComponent from './HeaderEditorComponent'
import HeaderEditorConverter from './HeaderEditorConverter'
import {registerPlugin} from 'writer'


const HeaderEditorPackage = {
    id: 'se.infomaker.mitm.headereditor',
    name: 'headereditor',
    configure: (config) => {

        config.addNode(HeaderEditorNode)
        config.addConverter('newsml', HeaderEditorConverter)
        config.addTextEditComponent(HeaderEditorNode.type, HeaderEditorComponent, {display:'top'})

    }
}

export default () => {
    if (registerPlugin) {
        registerPlugin(HeaderEditorPackage)
    } else {
        console.info("Register method not yet available");
    }
}

