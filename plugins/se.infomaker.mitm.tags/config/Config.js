export default {

    isTagEditable: function(tag) {
        return Boolean(this.types[tag.type].editable)
    },

    types: {
        "x-im/person": {
            icon: "fa-user",
            name: "Person",
            editable: true
        },
        "x-im/organisation": {
            icon: "fa-sitemap",
            name: "Organisation",
            editable: true
        },
        "x-im/topic": {
            icon: "fa-tags",
            name: "Channel",
            editable: true
        }

    }
}