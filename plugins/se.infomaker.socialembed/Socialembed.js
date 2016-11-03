const { BlockNode } = substance

class SocialembedNode extends BlockNode {

    /*
        Attempts to upload the file which is stored temporarily in this._previewFile
    */
    fetchPayload(cb, context) {
        context.fileClient.uploadFile(this.imageFiles, function(err, url) {
            if (err) return cb(err)
            // Contract with ResourceManager: result is used to set properties accordingly.
            cb(null, {url: url})
        })
    }

    /*
        Determines the payload that must be present
        in order to consider the resource resolved
    */
    hasPayload() {
        return Boolean(this.url)
    }

}

SocialembedNode.define({
    type: 'socialembed',
    dataType: 'string',
    url: 'string',
    uri: 'string',
    linkType: {type: 'string', default: ""},
    title: {type: 'string', optional: true},
    html: {type: 'string', optional: true}, // volatile
    author: {type: 'string', optional: true},
    socialChannel: {type: 'string', default: ""},
    socialChannelIcon: {type: 'string', default: ""}
})

export default SocialembedNode
