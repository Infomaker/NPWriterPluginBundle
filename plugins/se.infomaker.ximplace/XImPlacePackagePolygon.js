import './scss/location.scss'
import ximPlacePackageConfigure from './XimPlacePackageConfigure'

const id = "se.infomaker.ximplace-polygon"
export default {
    id: id,
    name: "ximplace",
    configure: ximPlacePackageConfigure(id)
}