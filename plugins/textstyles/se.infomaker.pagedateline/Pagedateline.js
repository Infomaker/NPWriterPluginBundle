import './scss/pagedateline.scss'

import PagedatelinePackage from './PagedatelinePackage'

const {registerPlugin} = writer


export default () => {
    if (registerPlugin) {
        registerPlugin(PagedatelinePackage)
    } else {
        console.error("Could not register plugin");
    }
}


