export default {

    type: 'ximteaser',
    tagName: 'object',

    matchElement: function (el, converter) {

        const {api} = converter.context
        const teaserTypes = api.getConfigValue('se.infomaker.ximteaser2', 'types')
        return teaserTypes.some(({type}) => {
            return type === el.attr('type')
        })

    },

    import: (el, node, converter) => {
        const {api} = converter.context
        
        const nodeId = el.attr('id')
        node.title = el.attr('title') ? el.attr('title') : ''
        node.dataType = el.attr('type')

        const teaserTypes = api.getConfigValue('se.infomaker.ximteaser2', 'types')
        const teaserType = teaserTypes.find((teaser) => {
            return teaser.type === node.dataType
        })
        node.label = teaserType ? teaserType.label : 'Teaser'
    },

    export: (node, el, converter) => {

    }
}