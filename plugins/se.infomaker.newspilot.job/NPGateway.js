import NewspilotComm from "newspilot-js-client";
import {idGenerator, api} from "writer";

export default class NPGateway {

    constructor(host, username, password, jobId, callback, storeLocationConfig) {
        this.callback = callback
        this.storeLocationConfig = storeLocationConfig
        this.comm = new NewspilotComm(host, username, password, this.queryUpdates.bind(this))
        this.comm.connect()
            .then(() => {
                const request = {
                    quid: idGenerator(),
                    query: getQuery(jobId)
                };

                this.query = this.comm.addQuery(request.quid, request.quid, request.query)
                this.nodeMap = new Map();
            })
            .catch((e) => console.error("Error", e))
    }

    queryUpdates(query, events) {
        let imageProxyServer = api.getConfigValue('se.infomaker.newspilot.job', 'imageProxyServer')

        for (let event of events) {
            switch (event.eventType) {
                case "CREATE":
                case "CHANGE":
                    this.nodeMap.set(event.id, getNode(event.currentValues, imageProxyServer, this.storeLocationConfig))
                    break
                case "REMOVE":
                    this.nodeMap.delete(event.id)
                    break
                default:
                // console.log("Unknown event type", event.eventType)
            }
        }

        this.callback([...this.nodeMap.values()])
    }


    disconnect() {
        if (this.comm) {
            this.comm.disconnect()
        }
    }

}

function getNode(currentValues, imageProxyServer, storeLocationConfig) {
    return getTemplate({
        data: currentValues,
        config: {urlEndpoint: imageProxyServer}
    }, storeLocationConfig)
}


function getTemplate(item, storeLocationConfig) {
    return {
        name: item.data.name,
        url: getUrl(item, storeLocationConfig),
        thumbUrl: getThumb(item),
        previewUrl: getPreview(item),
        created: getSafeItemStringValue(item.data.created_date),
        photographer: getSafeItemStringValue(item.data.image_author_name),
        proposedCaption: getSafeItemStringValue(item.data.caption_proposed)
    }
}

function getSafeItemStringValue(value) {
    return value ? value : ''
}

function getSafeItemIntegerValue(value) {
    return value ? value : 0
}


function getThumb(item) {
    return getWriterProxyUrl(`${item.config.urlEndpoint}/newspilot/thumb?id=${item.data.id}&type=24`)
}

function getPreview(item) {
    return getWriterProxyUrl(`${item.config.urlEndpoint}/newspilot/preview?id=${item.data.id}&type=24`)
}

function getWriterProxyUrl(url) {
    return `${api.router.getEndpoint()}/api/resourceproxy?url=${encodeURIComponent(url)}`
}

/**
 * Generate dropLink
 *
 * @param {object} article ArticleModel instance
 */
function getDroplinkForItem(image) {
    const data = {
        imType: 'image',
        uuid: image.guid[0],
        name: image.name[0]
    }
    const dropData = encodeURIComponent(JSON.stringify(data))

    return `x-im-entity://x-im/image?data=${dropData}`
}


function getUrl(item, storeLocationConfig) {

    if (getSafeItemIntegerValue(item.data.storelocation_id) > 0 && getSafeItemStringValue(item.data.storepath) !== '') {

        // Handle case where store location is configured as editorial open content
        if (storeLocationConfig && storeLocationConfig[String(item.data.storelocation_id)]) {
            let config = storeLocationConfig[item.data.storelocation_id]
            if (config.type === 'editorial-opencontent') {
                return getDroplinkForItem(item.data)
            }
        }

        return encodeURI(`${item.config.urlEndpoint}/${item.data.storelocation_id}/${item.data.storepath}`)
    } else {
        // last query parameter is a dummy in order for the image plugin to pick the drop up
        return `${item.config.urlEndpoint}/newspilot/data?id=${item.data.id}&majorType=24&extension=.jpg`
    }
}

function getQuery(jobId) {
    return `
        <query type="Image" version="1.1">
          <structure>
            <entity type="Image"/>
          </structure>
          <base-query>
            <and>
              <many-to-one field="image.id" type="Image">
                <eq field="job.id" type="ImageLink" value="${jobId}"/>
              </many-to-one>
            </and>
          </base-query>
        </query>`
}

