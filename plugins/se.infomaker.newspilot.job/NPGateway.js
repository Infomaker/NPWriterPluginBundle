import NewspilotComm from "newspilot-js-client";
import {idGenerator, api} from "writer";

export default class NPGateway {

    constructor(host, username, password, jobId, callback) {
        this.callback = callback
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
                    this.nodeMap.set(event.id, getNode(event.currentValues, imageProxyServer))
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

function getNode(currentValues, imageProxyServer) {
    return getTemplate({
        data: currentValues,
        config: {urlEndpoint: imageProxyServer}
    })
}


function getTemplate(item) {
    return {
        name: item.data.name,
        url: getUrl(item),
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
    return `${api.router.getEndpoint()}/api/resourceproxy?${encodeURIComponent(url)}`
}

function getUrl(item) {
    if (getSafeItemIntegerValue(item.data.storelocation_id) > 0) {
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

