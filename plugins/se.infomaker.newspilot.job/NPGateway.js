

class NPCommunication {

    template = values => `{
            "name" : "${values.item[`${values.nameProperty}`]}",
            "url"  : "${values.urlEndpoint}/${values.item[`${values.idProperty}`]}",
            "thumb": "${values.server}:${values.port}/newspilot/thumbs?id=${values.item[`${values.idProperty}`]}&type=24",
            "created": "${values.item[`${values.createdProperty}`]}",
            "proposedCaption": "${values.item[`${values.captionProperty}`]}"
        }`

    constructor(server, username, password, callback) {
        // 13980

        this.comm = new NewspilotComm("52.211.173.251", "infomaker", "newspilot", this.queryUpdates);
        comm.connect().then((data) => {
            console.log('connected', data);
            const request = {
                quid: idGenerator(),
                query: '<query type="Image" version="1.1"> <structure> <entity type="Image"/> </structure> <base-query> <and> <many-to-one field="image.id" type="Image"> <eq field="job.id" type="ImageLink" value="13980"/> </many-to-one> </and> </base-query> </query>'
            };

            comm.addQuery(request.quid, request.quid, request.query)

        })

    }

    getTemplate() {
        // TODO Put this template in config

    }

    disconnect() {
        if (this.comm) {
            // TODO disconnect
        }
    }

}