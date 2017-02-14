import './scss/_metadata.scss'
import HeaderEditorNode from './HeaderEditorNode'
import HeaderEditorComponent from './HeaderEditorComponent'
import HeaderEditorConverter from './HeaderEditorConverter'


export default {
    id: 'se.infomaker.headereditor',
    name: 'headereditor',
    configure: (config) => {

        config.addNode(HeaderEditorNode)
        config.addConverter('newsml', HeaderEditorConverter)
        config.addTextEditComponent(HeaderEditorNode.type, HeaderEditorComponent, {display:'top'})

        config.addLabel('leadin', {
            en: 'Leadin',
            sv: 'Ingress'
        })

    }
}

