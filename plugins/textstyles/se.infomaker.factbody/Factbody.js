import './scss/factbody.scss'

import FactbodyPackage from './FactbodyPackage'

const { registerPlugin } = writer


export default () => {
    if (registerPlugin) {
        registerPlugin(FactbodyPackage)
    } else {
        console.error("Could not register plugin");
    }

}


