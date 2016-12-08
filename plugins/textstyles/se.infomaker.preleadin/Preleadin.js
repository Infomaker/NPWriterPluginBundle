import './scss/preleadin.scss'

import PreleadinPackage from './PreleadinPackage'

const {registerPlugin} = writer


export default () => {
    if (registerPlugin) {
        registerPlugin(PreleadinPackage)
    } else {
        console.error("Could not register plugin");
    }
}