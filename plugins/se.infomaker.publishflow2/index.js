import PublishFlowPackage from './PublishFlowPackage'
const {registerPlugin} = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(PublishFlowPackage)
    }
    else {
        console.info("Register method not yet available");
    }
}
