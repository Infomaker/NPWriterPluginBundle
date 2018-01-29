import ContentRelationsPackage from './ContentrelationsPackage'
const { registerPlugin } = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(ContentRelationsPackage)
    } else {
        console.info("Register method not yet available");
    }
}
