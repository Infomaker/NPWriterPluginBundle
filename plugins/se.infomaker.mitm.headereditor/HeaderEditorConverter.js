module.exports = {
    type: 'headereditor',
    tagName: 'group',

    matchElement: function (el) {
        return el.is('group[type="header"]');
    },

    findElementForType: function (el, type) {
        return el.find('element[type="' + type + '"]');
    },

    getDefaultFields: function () {
        return ['headline', 'leadin'];
    },

    import: function (el, node, converter) {
        var oldPreserveValue;

        oldPreserveValue = converter.state.preserveWhitespace;
        converter.state.preserveWhitespace = true;

        node.id = 'headereditor';

        var api = converter.context.api
        var headerFields = api.getConfigValue('se.infomaker.mitm.headereditor', 'elements') || this.getDefaultFields();

        headerFields.forEach((field) => {
            var element = this.findElementForType(el, field);
            if (element) {
                node[field] = converter.annotatedText(element, ['headereditor', field]);
            }
        });

        converter.state.preserveWhitespace = oldPreserveValue;
    },

    export: function (node, el, converter) {
        var $$ = converter.$$
        el.attr('type', 'header')

        var api = converter.context.api
        var headerFields = api.getConfigValue('se.infomaker.mitm.headereditor', 'elements') || this.getDefaultFields()

        var elements = headerFields.map(function (field) {
            if (node.hasOwnProperty(field)) {
                return $$('element')
                    .attr('type', field)
                    .attr('id', 'group-header-'+field)
                    .append(
                        converter.annotatedText([node.id, field])
                    )
            } else {
                console.log("Field " + field + " not supported")
                return null
            }
        })

        console.log("elements", elements);

        el.append(elements);
    }

};
