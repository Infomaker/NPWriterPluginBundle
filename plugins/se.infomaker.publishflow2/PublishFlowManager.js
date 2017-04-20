const {api, moment} = writer
class PublishFlowConfiguration {
    constructor(pluginId) {
        this.pluginId = pluginId

        this.status = api.getConfigValue('se.infomaker.publishflow2', 'workflow')
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

    executeAction(qcode, pubStart, pubStop) {
        const action = this.getActionDefinition(qcode)
        if (action === null) {
            return
        }

        if (typeof action.actions === 'object') {
            switch(action.actions.pubStart) {
                case 'required':
                    if (!moment(pubStart).isValid()) {
                        throw new Error('A valid publication start time required for this status')
                    }
                    this.setPubStart(pubStart)
                    break

                case 'set':
                    this.setPubStart(moment().format('YYYY-MM-DDTHH:mm:ssZ'))
                    break

                case 'clear':
                    this.setPubStart(null, qcode)
                    break
            }

            switch(action.actions.pubStop) {
                case 'required':
                    if (!moment(pubStop).isValid()) {
                        throw new Error('A valid publication stop time required for this status')
                    }
                    this.setPubStop(pubStop)
                    break

                case 'set':
                    this.setPubStop(moment().format('YYYY-MM-DDTHH:mm:ssZ'))
                    break

                case 'clear':
                    this.setPubStop(null, qcode)
                    break
            }
        }

        this.setPubStatus(qcode)
    }

    setPubStatus(qcode) {
        api.newsItem.setPubStatus(
            this.pluginId,
            {
                qcode: qcode
            }
        )
    }

    setPubStart(value, qcode) {
        let action

        if (typeof qcode === 'string') {
            // Use next action definition
            action = this.getActionDefinition(qcode)
        }
        else {
            // Use current action definition
            action = this.getActionDefinition(api.newsItem.getPubStatus().qcode)
        }

        if (typeof action.actions === 'object' && action.actions.pubStart === 'required') {
            if (!moment(value).isValid()) {
                throw new Error('A valid publication start time required for this status')
            }
        }

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

    setPubStop(value, qcode) {
        let action

        if (typeof qcode === 'string') {
            // Use next action definition
            action = this.getActionDefinition(qcode)
        }
        else {
            // Use current action definition
            action = this.getActionDefinition(api.newsItem.getPubStatus().qcode)
        }

        if (typeof action.actions === 'object' && action.actions.pubStop === 'required') {
            if (!moment(value).isValid()) {
                throw new Error('A valid publication stop time required for this status')
            }
        }

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
