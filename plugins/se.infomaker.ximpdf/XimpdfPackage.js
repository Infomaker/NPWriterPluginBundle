import XimpdfComponent from './XimpdfComponent'
import XimpdfConverter from './XimpdfConverter'
import Ximpdf from './Ximpdf'
import XimpdfFileNode from './XimpdfFileNode'
//import InsertPdfsTool from './InsertPdfsTool'
import InsertPdfsCommand from './InsertPdfsCommand'
import DropPdfFile from './DropPdfFile'
//import DropImageUri from './DropImageUri'

export default {
    name: 'ximpdf',
    id: 'se.infomaker.ximpdf',
    configure: function (config) {
        config.addNode(Ximpdf)
        config.addComponent(Ximpdf.type, XimpdfComponent)
        config.addConverter('newsml', XimpdfConverter)
        // TODO
        // config.addContentMenuTopTool('insert-pdfs', InsertPdfsTool)
        config.addCommand('insert-pdfs', InsertPdfsCommand)

        config.addNode(XimpdfFileNode)

        // TODO: duplicate?
        // config.addConverter('newsml', XimpdfConverter)
        config.addDragAndDrop(DropPdfFile)
        // TODO:
        // config.addDragAndDrop(DropImageUri)

        // TODO
        // config.addIcon('image', { 'fontawesome': 'fa-image' })
        // config.addIcon('crop', { 'fontawesome': 'fa-crop' })
        // config.addIcon('upload', { 'fontawesome': 'fa-upload' })
    }
}
