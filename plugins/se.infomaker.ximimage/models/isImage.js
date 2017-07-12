export default (uri, api) => {

    // Load allowed filextension from config file
    let fileExtensionsFromConfig = api.getConfigValue('se.infomaker.ximimage', 'imageFileExtension')

    //If no extension specified in config use the default extension, specified in constructor
    if (!fileExtensionsFromConfig) {
        fileExtensionsFromConfig = ['.jpg', '.jpeg', '.png', '.gif']
    }
    // Iterate given extension and return bool if found
    return fileExtensionsFromConfig.some((extension) => {
        return uri.indexOf(extension) > 0
    })

}
