import './scss/pagedateline.scss'
import {registerPlugin} from 'writer'
import PagedatelinePackage from './PagedatelinePackage'

(() => {
    if (registerPlugin) {
        registerPlugin(PagedatelinePackage)
    } else {
        console.error("Could not register plugin");
    }
})()


