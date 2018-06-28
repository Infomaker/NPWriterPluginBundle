import {TextmanipulationPackage} from './TextmanipulationPackage'
const {registerPlugin} = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(TextmanipulationPackage)
    } else {
        console.info("Register method not yet available");
    }
}
