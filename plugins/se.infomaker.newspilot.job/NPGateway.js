import NewspilotComm from "newspilot-js-client";
import {idGenerator, api} from "writer";

export default class NPGateway {

    constructor(host, username, password, jobId, callback) {
        this.callback = callback

        this.server = `${host}:8080`

        this.comm = new NewspilotComm(host, username, password, this.queryUpdates.bind(this))
        this.comm.connect()
            .then(() => {
                console.log('Connected to Newspilot');
                const request = {
                    quid: idGenerator(),
                    query: getQuery(jobId)
                };

                this.query = this.comm.addQuery(request.quid, request.quid, request.query)
                this.nodeMap = new Map();
            })
            .catch((e) => console.log("Error", e))
    }

    queryUpdates(query, events) {
        let imageProxyHost = api.getConfigValue(
            'se.infomaker.newspilot.job',
            'imageProxyHost'
        )

        let server = this.server

        for (let event of events) {
            switch (event.eventType) {
                case "CREATE":
                case "CHANGE":
                    this.nodeMap.set(event.id, getNode(event.currentValues, imageProxyHost))
                    break
                case "REMOVE":
                    this.nodeMap.delete(event.id)
                    break
                default:
                    console.log("Unknown event type", event.eventType)
            }
        }

        this.callback([...this.nodeMap.values()])
    }


    disconnect() {
        if (this.comm) {
            console.log("Disconnecting from Newspilot")
            this.comm.disconnect()
        }
    }

}

function getNode(currentValues, imageProxyHost) {
    return JSON.parse(
        getTemplate()(
            {
                data: currentValues,
                config: {urlEndpoint: imageProxyHost}
            }
        )
    )
}


function getTemplate() {
    return (item) => `{
            "name":     "${item.data.name}",
            "url":      "${getUrl(item)}",
            "thumbUrl":    "${getThumb(item)}",
            "previewUrl": "${getPreview(item)}",
            "created":  "${item.data.created}",
            "proposedCaption": "${item.data.name}"
        }`
}


function getThumb(item) {
    return `${item.config.urlEndpoint}/newspilot/thumb?id=${item.data.id}&type=24`
}

function getPreview(item) {
    return `${item.config.urlEndpoint}/newspilot/preview?id=${item.data.id}&type=24`
}

function getUrl(item) {
    // TODO: Check if storelocation is 0, if so construct url that points to 'data' and 'majorType'...
    return encodeURI(`${item.config.urlEndpoint}/${item.data.storelocation_id}/${item.data.storepath}`)
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

