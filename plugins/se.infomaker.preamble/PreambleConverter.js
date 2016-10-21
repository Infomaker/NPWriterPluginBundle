export default {
    type: "preamble",
    tagName: "element",

    matchElement: function (el) {
        return el.is('element[type="preamble"]');
    },

    import: function (el, node, converter) {
        console.log("Import Preamble");
        node.content = converter.annotatedText(el, [node.id, 'content']);
    },

    export: function (node, el, converter) {
        console.log("Ecport preablem");
        return el.attr('type', 'preamble').attr('class', 'helloPreamble')
            .append(converter.annotatedText([node.id, 'content']));
    }
};

