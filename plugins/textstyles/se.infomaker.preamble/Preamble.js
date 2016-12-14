import './scss/preamble.scss'

import PreamblePackage from './PreamblePackage'

const { registerPlugin } = writer


export default () => {
    if (registerPlugin) {
        registerPlugin(PreamblePackage)
    } else {
        console.error("Could not register plugin");
    }

}


