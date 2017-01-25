import NewspilotComm from "newspilot-js-client";
import {idGenerator} from "writer";

export default class NPGateway {

    constructor(host, username, password, jobId, callback) {
        // 13980

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

                this.comm.addQuery(request.quid, request.quid, request.query)
            })
            .catch((e) => console.log("Error", e))
    }

    queryUpdates(query, events) {

        let server = this.server
        const newData = events.map((item) => {
            return JSON.parse(
                getTemplate(server)(
                    {data: item.currentValues, config: {server: server, urlEndpoint: 'https://services.dev.np.infomaker.io'}})
            )
        });

        this.callback(newData)
    }


    disconnect() {
        if (this.comm) {
            console.log("Disconnecting from Newspilot")
            this.comm.disconnect()
        }
    }

}

function getTemplate() {
    return (item) => `{
            "name":     "${item.data.name}",
            "url":      "${getUrl(item)}",
            "thumbUrl":    "${getUrl(item)}",
            "previewUrl": "${getUrl(item)}",
            "created":  "${item.data.created}",
            "proposedCaption": "${item.data.name}"
        }`
}


function getUrl(item) {

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

