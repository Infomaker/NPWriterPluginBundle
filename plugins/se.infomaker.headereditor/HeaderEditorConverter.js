module.exports = {
    type: 'headereditor',
    tagName: 'group',

    matchElement: function (el) {
        const headlineElement = el.find('group[type="header"] > element[type="headline"]')
        const leadinElement = el.find('group[type="header"] > element[type="leadin"]')

        if(headlineElement || leadinElement) {
            return true
        }
    },

    findElementForType: function (el, type) {
        return el.find('element[type="' + type + '"]');
    },

    getDefaultFields: function () {
        return ['headline', 'leadin'];
    },

    import: function (el, node, converter) {
        let oldPreserveValue;

        oldPreserveValue = converter.state.preserveWhitespace;
        converter.state.preserveWhitespace = true;

        node.id = 'headereditor';

        const api = converter.context.api
        const headerFields = api.getConfigValue('se.infomaker.headereditor', 'elements') || this.getDefaultFields();

        headerFields.forEach((field) => {
            var element = this.findElementForType(el, field);
            if (element) {
                node[field] = converter.annotatedText(element, ['headereditor', field]);
            }
        });

        converter.state.preserveWhitespace = oldPreserveValue;
    },

    export: function (node, el, converter) {
        const $$ = converter.$$
        el.attr('type', 'header')

        const api = converter.context.api
        const headerFields = api.getConfigValue('se.infomaker.headereditor', 'elements') || this.getDefaultFields()

        const elements = headerFields.map(function (field) {
            if (node.hasOwnProperty(field)) {
                return $$('element')
                    .attr('type', field)
                    .attr('id', 'group-header-'+field)
                    .append(
                        converter.annotatedText([node.id, field])
                    )
            } else {
                console.error("Field " + field + " not supported")
                return null
            }
        })
        el.append(elements);
    }

};
