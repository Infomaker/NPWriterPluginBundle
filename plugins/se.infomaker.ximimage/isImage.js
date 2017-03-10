export default (uri, api) => {

    // Load allowed filextension from config file
    let fileExtensionsFromConfig = api.getConfigValue('se.infomaker.ximimage', 'imageFileExtension')

    // Iterate given extension and return bool if found
    return fileExtensionsFromConfig.some((extension) => {
        return uri.indexOf(extension) > 0
    })

}