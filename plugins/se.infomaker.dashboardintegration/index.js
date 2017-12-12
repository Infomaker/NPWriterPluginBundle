import DashboardIntegrationPackage from './DashboardIntegrationPackage'
import {registerPlugin} from 'writer'

export default () => {
    if (registerPlugin) {
        registerPlugin(DashboardIntegrationPackage)
    } else {
        console.error("Register method not yet available");
    }
}
