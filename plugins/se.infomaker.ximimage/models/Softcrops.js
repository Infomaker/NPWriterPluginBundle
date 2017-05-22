class Softcrops {
    constructor(api) {
        this.api = api
    }

    /**
     * Parse links element for softcrop link elements
     *
     * @param {object} linksEl
     * @return {Array}
     */
    importSoftcropLinks(linksEl) {
        if (!linksEl || linksEl.length <= 0) {
            return []
        }

        let crops = []

        linksEl.children.forEach(function(link) {
            if (link.attr('type') !== 'x-im/crop') {
                return
            }

            let parsed = link.attr('uri').match(/im:\/\/crop\/(.*)/)
            if(!Array.isArray(parsed) || parsed.length !== 2) {
                return
            }

            let [x, y, w, h] = parsed[1].split('/')
            crops.push({
                name: link.attr('title'),
                x: x,
                y: y,
                width: w,
                height: h
            })
        })

        return crops
    }

    /**
     * Append softcrop link elements based on crop data
     *
     * @param {object} $$
     * @param {object} Links element to append link elements to
     * @param {Array} Array of soft crops
     */
    exportSoftcropLinks($$, linksEl, crops) {
        // <link rel="crop" type="x-im/crop" title="16:9" uri="im://crop/0.07865168539325842/0.0899/0.8426966292134831/0.9899" />
        for (var i in crops) { // eslint-disable-line
            let crop = crops[i]
            let uri = 'im://crop/' + crop.x + '/' + crop.y + '/' + crop.width + '/' + crop.height

            linksEl.append(
                $$('link')
                    .attr({
                        rel: 'crop',
                        type: 'x-im/crop',
                        title: crop.name,
                        uri: uri
                    })
            )
        }
    }
}

export default Softcrops
