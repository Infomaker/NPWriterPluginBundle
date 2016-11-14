import './scss/dateline.scss'

import DatelinePackage from './DatelinePackage'

const {registerPlugin} = writer


export default () => {
    if (registerPlugin) {
        registerPlugin(DatelinePackage)
    } else {
        console.error("Could not register plugin");
    }
}


