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
        "x-im/channel": {
            icon: "fa-random",
            name: "Channel",
            editable: false
        },
        "x-cmbr/channel": {
            icon: "fa-random",
            name: "Channel",
            editable: false
        },
        "x-cmbr/category": {
            icon: "fa-tags",
            name: "Category",
            editable: false
        },
        "x-im/category": {
            icon: "fa-tags",
            name: "Category",
            editable: false
        }
    }
}