var jxon = require('jxon/index');
var isArray = require('lodash/isArray');


function PreviewGenerator() {

}

PreviewGenerator.prototype.getPreviewTextForVersion = function (version, withTime, length) {
    var parser = new window.DOMParser();
    var xml = parser.parseFromString(version.src, "application/xml");
    var jsonFormat = jxon.build(xml);
    var group = jsonFormat.newsItem.contentSet.inlineXML.idf.group;
    if (isArray(group)) {
        group = jsonFormat.newsItem.contentSet.inlineXML.idf.group.filter(function (group) {
            return group['@type'] === 'body';
        }.bind(this))[0];
    }

    let previewText = '';

    if (group && group.element) {
        var elements = group.element;
        if (!isArray(elements)) {
            elements = [group.element];
        }

        elements.forEach((element) => {
            if(element.keyValue) {
                previewText += " " + element.keyValue;
            }
        });

    }


    if(length && previewText.length > length) {
        previewText = previewText.substr(0, length);
    }
    if(withTime) {
        previewText += " - " + version.time;
    }
    return previewText;
};

module.exports = PreviewGenerator;