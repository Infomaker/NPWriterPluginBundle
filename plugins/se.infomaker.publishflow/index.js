import PublishFlowPackage from './PublishFlowPackage'
const {registerPlugin} = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(PublishFlowPackage)
    }
    else {
        console.log("Register method not yet available");
    }
}
