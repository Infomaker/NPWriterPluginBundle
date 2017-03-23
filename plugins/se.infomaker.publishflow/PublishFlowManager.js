const {api, moment} = writer
class PublishFlowConfiguration {
    constructor(pluginId) {
        this.pluginId = pluginId

        this.status = api.getConfigValue('se.infomaker.publishflow', 'workflow')
    }

    getActionDefinition(qcode) {
        if (!this.status[qcode]) {
            return null
        }

        return this.status[qcode]
    }

    getAllowedActions(status) {
        if (this.status[status]) {
            return this.status[status].allowed
        }

        return []
    }


    // setToWithheld(from, to) {
    //     let fromObj = moment(from),
    //         toObj = moment(to)
    //
    //     if (!fromObj.isValid()) {
    //         throw new Error('Invalid from date and time')
    //     }
    //
    //     this.setStatus(
    //         'stat:withheld',
    //         {value: fromObj.format('YYYY-MM-DDTHH:mm:ssZ')},
    //         !toObj.isValid() ? null : {value: toObj.format('YYYY-MM-DDTHH:mm:ssZ')}
    //     )
    // }
    //
    // setToUsable() {
    //     this.setStatus(
    //         'stat:usable',
    //         {value: moment().format('YYYY-MM-DDTHH:mm:ssZ')},
    //         null
    //     )
    // }

    executeAction(qcode, pubStart, pubStop) {
        const action = this.getActionDefinition(qcode)
        if (action === null) {
            return
        }

        this.setPubStatus(qcode)

        if (typeof action.actions !== 'object') {
            return
        }

        switch(action.actions.pubStart) {
            case 'set':
                this.setPubStart(pubStart)
                break

            case 'update':
                this.setPubStart(moment().format('YYYY-MM-DDTHH:mm:ssZ'))
                break

            case 'clear':
                this.setPubStart(null)
                break
        }

        switch(action.actions.pubStart) {
            case 'set':
                this.setPubStop(pubStop)
                break

            case 'update':
                this.setPubStop(moment().format('YYYY-MM-DDTHH:mm:ssZ'))
                break

            case 'clear':
                this.setPubStop(null)
                break
        }
    }

    setPubStatus(qcode) {
        api.newsItem.setPubStatus(
            this.pluginId,
            {
                qcode: qcode
            }
        )
    }

    setPubStart(value) {
        if (value === null) {
            api.newsItem.removePubStart(this.pluginId)
            return
        }

        const obj = moment(value)

        if (!obj.isValid()) {
            throw new Error('Invalid datetime for pubStart')
        }

        api.newsItem.setPubStart(
            this.pluginId,
            {
                value: obj.format('YYYY-MM-DDTHH:mm:ssZ')
            }
        )
    }

    setPubStop(value) {
        if (value === null) {
            api.newsItem.removePubStop(this.pluginId)
            return
        }

        const obj = moment(value)

        if (!obj.isValid()) {
            throw new Error('Invalid datetime for pubStop')
        }

        api.newsItem.setPubStop(
            this.pluginId,
            {
                value: obj.format('YYYY-MM-DDTHH:mm:ssZ')
            }
        )
    }
}

export default PublishFlowConfiguration
