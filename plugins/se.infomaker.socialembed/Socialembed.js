const { BlockNode } = substance

class SocialembedNode extends BlockNode {}

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
