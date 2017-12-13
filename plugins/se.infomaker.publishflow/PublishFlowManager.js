const {api, moment} = writer

/**
 * Reads workflow configurations and executes transition actions defined in them
 */
class PublishFlowManager {
    constructor(pluginId) {
        this.pluginId = pluginId

        this.workflowStates = api.getConfigValue(pluginId, 'workflow')
    }

    /**
     * Gets a workflow state for a specific pubStatus qcode
     * @param {string} pubStatus The qcode for the publication status
     * @return {T|number|*|{ID, TAG, NAME, CLASS}}
     */
    getStateDefinitionByPubStatus(pubStatus) {

        const objectKeys = Object.keys(this.workflowStates);

        const key = objectKeys.find((e) => {
            return this.workflowStates[e].pubStatus === pubStatus
        })

        if (key) {
            return this.workflowStates[key]
        }

        return null;

        // return this.workflowStates.find((elem) => {
        //     return elem.pubStatus === pubStatus
        // })

    }

    getStateDefinitionByName(name) {
        return this.workflowStates[name]
    }

    /**
     * Checks whether a provided transition definition matches a configured preCondition.
     * @param {object} transitionDef Transition definition which may include a preCondition
     * @param {string} pubStatus Value to check if matches precondition
     * @param {boolean} hasPublishedVersion Value to check if matches precondition
     * @return {boolean} True if no preCondition was configured, or preCondition matches provided values
     */
    isAllowed(transitionDef, pubStatus, hasPublishedVersion) {
        if (!transitionDef.preCondition) {
            return true;
        }

        if (!hasPublishedVersion && hasPublishedVersion !== false) {
            throw new Error("hasPublishedVersion is not set in article")
        }

        const condition = transitionDef.preCondition

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

    /**
     * Get list of transitions for specified qcode and hasPublishedVersion combination
     * @param {string} pubStatus The qcode for the pubStatus
     * @param {boolean} hasPublishedVersion The value of hasPublishedVersion
     * @return {Array} Transitions that matches the parameters
     */
    getTransitions(pubStatus, hasPublishedVersion) {

        const stateDef = this.getStateDefinitionByPubStatus(pubStatus)

        if (!stateDef) {
            return []
        }

        return stateDef.transitions.filter((transition) => {
            return this.isAllowed(transition, pubStatus, hasPublishedVersion)
        });

    }

    /**
     * Gets the actions defined in the state that is being addressed by nextStateKey.
     *
     * First pubStart and pubStop is verified to exist, if the action definition has the value 'required' configured for the field.
     *
     * If verification fails, an error is thrown and the state change fails.
     *
     * Second step is to execute the defined actions in the state.
     *
     * @param {string} nextStateKey The state key defined in the config file
     * @param {string} pubStart A date in ISO 8601 format. Used in verification
     * @param {string} pubStop A date in ISO 8601 format. Used in verification
     */
    executeTransition(nextStateKey, pubStart, pubStop) {
        const nextStateDef = this.getStateDefinitionByName(nextStateKey)
        if (nextStateDef === null) {
            throw new Error(`Cannot find state ${nextStateKey}`)
        }

        let actions = nextStateDef.actions

        if (actions === undefined) {
            return;
        }

        if (!Array.isArray(actions)) {
            actions = [actions]
        }

        actions.forEach((action) => {
            switch (action.pubStart) {
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
                    this.setPubStart(null)
                    break
            }

            switch (action.pubStop) {
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
                    this.setPubStop(null)
                    break
            }

            if (action.pubStatus !== undefined) {
                this.setPubStatus(action.pubStatus)
            }

            if (action.hasPublishedVersion !== undefined) {
                this.setHasPublishedVersion(action.hasPublishedVersion)
            }
        })

    }

    /**
     * Setter
     * @param {boolean} value
     */
    setHasPublishedVersion(value) {
        api.newsItem.setHasPublishedVersion(this.pluginId, value)
    }

    /**
     * Setter
     * @param {string} qcode The qcode value of the pubStatus
     */
    setPubStatus(qcode) {
        api.newsItem.setPubStatus(
            this.pluginId,
            {
                qcode: qcode
            }
        )
    }

    /**
     * Setter
     * @param {string} value ISO 8601 formatted time
     */
    setPubStart(value) {
        if (value === null) {
            api.newsItem.removePubStart()
        }
        else {
            api.newsItem.setPubStart(
                this.pluginId,
                {
                    value: this.getFormattedTime(value)
                }
            )
        }
    }

    /**
     * Setter
     * @param {string} value ISO 8601 formatted time
     */
    setPubStop(value) {
        if (value === null) {
            api.newsItem.removePubStop()
        }
        else {
            api.newsItem.setPubStop(
                this.pluginId,
                {
                    value: this.getFormattedTime(value)
                }
            )
        }
    }

    /**
     * Verifies that the provided value is a valid ISO 8601 formatted timestamp.
     * @param value
     */
    getFormattedTime(value) {

        if (value === null) {
            return null;
        }

        const obj = moment(value)

        if (!obj.isValid()) {
            throw new Error('Invalid datetime for pubStop')
        }

        return obj.format('YYYY-MM-DDTHH:mm:ssZ')
    }
}

export default PublishFlowManager
