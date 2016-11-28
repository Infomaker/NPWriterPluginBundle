import XimpdfComponent from './XimpdfComponent'
import XimpdfConverter from './XimpdfConverter'
import Ximpdf from './Ximpdf'
import XimpdfFileNode from './XimpdfFileNode'
import InsertPdfsTool from './InsertPdfsTool'
import InsertPdfsCommand from './InsertPdfsCommand'
import DropPdfFile from './DropPdfFile'
import DropPdfUri from './DropPdfUri'
import XimpdfMacro from './XimpdfMacro'

export default {
    name: 'ximpdf',
    id: 'se.infomaker.ximpdf',
    configure: function (config) {
        config.addNode(Ximpdf)
        config.addComponent(Ximpdf.type, XimpdfComponent)
        config.addConverter('newsml', XimpdfConverter)
        config.addContentMenuTopTool('insert-pdfs', InsertPdfsTool)
        config.addCommand('insert-pdfs', InsertPdfsCommand)
        config.addNode(XimpdfFileNode)
        config.addDragAndDrop(DropPdfFile)
        config.addDragAndDrop(DropPdfUri)
        config.addMacro(XimpdfMacro)
    }
}
