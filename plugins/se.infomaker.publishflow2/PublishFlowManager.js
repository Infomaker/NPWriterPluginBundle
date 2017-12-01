const {api, moment} = writer
class PublishFlowConfiguration {
    constructor(pluginId) {
        this.pluginId = pluginId

        this.workflowStates = api.getConfigValue(pluginId, 'workflow')
    }

    getWorkflowStateDefinition(pubStatus) {

        return this.workflowStates.find((elem) => {
            return elem.pubStatus === pubStatus
        })

    }


    nextMatcher(nextDef, pubStatus, hasPublishedVersion) {
        if (!nextDef.preCondition) {
            return true;
        }

        if (!hasPublishedVersion && hasPublishedVersion !== false) {
            throw new Error("hasPublishedVersion is not set in article")
        }

        const condition = nextDef.preCondition

        if (condition.pubStatus === pubStatus && condition.hasPublishedVersion === hasPublishedVersion) {
            return true;
        }

        if (condition.pubStatus === pubStatus && !condition.hasPublishedVersion) {
            return true
        }

        if (condition.hasPublishedVersion === hasPublishedVersion && !condition.pubStatus) {
            return true
        }

        return false;

    }

    // TODO rename to getAllowedTransitions
    getAllowedTransitionChoices(pubStatus, hasPublishedVersion) {
        // TODO Iterate over all states and find pubStatus values in config and match with current pubStatus, condition

        const workflowState = this.getWorkflowStateDefinition()

        if (!workflowState) {
            return []
        }

        workflowState.next.find((nextDef) => {

        })



        if (this.workflowStates[pubStatus]) {
            return this.workflowStates[pubStatus].allowed
        }

        return []
    }

    executeAction(qcode, pubStart, pubStop) {
        const action = this.getWorkflowStateDefinition(qcode)
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
            action = this.getWorkflowStateDefinition(qcode)
        }
        else {
            // Use current action definition
            action = this.getWorkflowStateDefinition(api.newsItem.getPubStatus().qcode)
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
            action = this.getWorkflowStateDefinition(qcode)
        }
        else {
            // Use current action definition
            action = this.getWorkflowStateDefinition(api.newsItem.getPubStatus().qcode)
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
