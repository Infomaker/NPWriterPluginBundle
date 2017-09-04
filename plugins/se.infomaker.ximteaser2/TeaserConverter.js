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

        const nodeId = el.attr('id')
        node.title = el.attr('title') ? el.attr('title') : ''
        node.dataType = el.attr('type')

    },

    export: (node, el, converter) => {

    }
}