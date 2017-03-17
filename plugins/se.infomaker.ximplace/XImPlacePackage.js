import './scss/location.scss'
import ximPlacePackageConfigure from './XimPlacePackageConfigure'
import './media/ximplace-create.png'
import './media/ximplace-edit.png'
import './media/ximplace-polygon-full.png'
import './media/ximplace-polygon-small.png'
import './media/ximplace-sidebar.png'
import PluginInformation from './PluginInfomation'


/**
 *
 * This package is used when using both positions and polygons in the same plugin
 *
 * If positions and polygons should be in separated plugins the XimPlacePackagePolygon
 * and XimPlacePackagePosition is used. Which package to load is specified in the
 * main index.js calling ximplace/index.js with paramaters, like XimPlace('position')
 *
 * The configure method is located in a separated file called XimPlacePackageconfigure
 * which is the same for all packages, except the id.
 *
 * The writer.json config file in the writer should load the two different plugins
 * with different id.
 *
 * se.infomaker.ximplace-polygon
 * se.infomaker.ximplace-position
 * se.infomaker.ximplace
 *
 */

const id = "se.infomaker.ximplace"
export default {
    id: id,
    name: "ximplace",
    version: '{{version}}',
    metadata: PluginInformation,
    configure: ximPlacePackageConfigure(id)
}