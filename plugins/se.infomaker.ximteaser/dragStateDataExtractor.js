import {api} from 'writer'

export default {

    /**
     * Extracts type of DragEvent, and data which is needed for
     * the command 'ximteaser.insert-image'
     *
     * @param {DragEvent} dragState
     * @returns {{type: String, file:File|nodeId:String|uri:String,uriData:Object|url:String}}
     */
    extract(dragState) {
        return this._extractData(dragState)
    },

    extractMultiple(dragState) {
        const multiple = true
        return this._extractData(dragState, multiple)
    },

    /**
     * 
     * 
     * @param {any} dragState 
     * @param {any} multiple 
     */
    _extractData(dragState, multiple) {
        const result = {}
        if (this._isFileDropOrUpload(dragState.data)) {
            result.type = 'file'
            if (multiple) {
                result.files = dragState.data.files
            } else {
                result.file = dragState.data.files[0]
            }
        } else if (dragState.nodeDrag && dragState.sourceSelection) {
            result.type = 'node'
            result.nodeId = dragState.sourceSelection.nodeId
        } else if (this._isUriDrop(dragState.data)) {
            const uri = dragState.data.uris[0]
            result.type = 'uri'
            result.uri = uri
            result.uriData = this._getDataFromURL(uri)
        } else if (this._isUrlDrop(dragState.data)) {
            const url = dragState.data.uris[0]
            if (this._isImage(url)) {
                result.type = 'url'
                result.url = url
            }
        }

        return result
    },

    _isImage(uri) {
        // Load allowed filextension from config file
        const fileExtensionsFromConfig = api.getConfigValue('se.infomaker.ximimage', 'imageFileExtension', ['jpeg', 'jpg', 'gif', 'png'])
        return fileExtensionsFromConfig.some((extension) => uri.includes(extension))
    },

    _getDataFromURL(url) {
        const queryParamKey = 'data='
        const dataPosition = url.indexOf(queryParamKey)
        if (dataPosition > -1) {
            let encodedData = url.substr(dataPosition + queryParamKey.length, url.length)
            return JSON.parse(decodeURIComponent(encodedData))
        } else {
            return false
        }
    },

    _isFileDropOrUpload(dragData) {
        return dragData.files && dragData.files.length > 0
    },

    _isUrlDrop(dragData) {
        return dragData.uris && dragData.uris.length > 0 && /^https?:\/\//.test(dragData.uris[0])
    },

    _isUriDrop(dragData) {
        return dragData.uris && dragData.uris.length > 0 && dragData.uris[0].includes('x-im-entity://x-im/image')
    }
}