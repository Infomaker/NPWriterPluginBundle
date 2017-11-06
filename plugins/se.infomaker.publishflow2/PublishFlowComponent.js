import PublishFlowManager from './PublishFlowManager'
import './scss/publishflow.scss'

const {Component} = substance
const {api, moment, event} = writer
const pluginId = 'se.infomaker.publishflow2'
const TIMEOUT = 30000

class PublishFlowComponent extends Component {
    constructor(...args) {
        super(...args)

        api.events.on(pluginId, event.DOCUMENT_CHANGED, () => {
            this._onDocumentChanged()
        })

        api.events.on(pluginId, event.DOCUMENT_SAVED, () => {
            this._onDocumentSaved()
        })

        api.events.on(pluginId, event.DOCUMENT_SAVE_FAILED, () => {
            this._onDocumentSaveFailed()
        })

        api.events.on(pluginId, event.USERACTION_CANCEL_SAVE, () => {
            this._onDocumentSaveFailed()
        })

        api.events.on(pluginId, event.USERACTION_SAVE, () => {
            if(!this.saveInProgress) {
                this.saveInProgress = true
                this.defaultAction()
            }
        })

        api.events.on(pluginId, event.USERACTION_LOCK, () => {
            this.locked = true
            this.props.popover.disable()
        })

        api.events.on(pluginId, event.USERACTION_UNLOCK, () => {
            this.locked = false
            this.props.popover.enable()
        })
    }

    dispose() {
        api.events.off(pluginId, event.DOCUMENT_CHANGED)
        api.events.off(pluginId, event.DOCUMENT_SAVED)
        api.events.off(pluginId, event.USERACTION_CANCEL_SAVE)
        api.events.off(pluginId, event.DOCUMENT_SAVE_FAILED)
        api.events.off(pluginId, event.USERACTION_SAVE)
        this._clearSaveTimeout();
    }

    getInitialState() {
        let status = api.newsItem.getPubStatus()
        this.publishFlowMgr = new PublishFlowManager(pluginId)

        return {
            status: status,
            unsavedChanges: false,
            pubStart: api.newsItem.getPubStart(),
            pubStop: api.newsItem.getPubStop(),
            allowed: this.publishFlowMgr.getAllowedActions(status.qcode)
        }
    }

    didMount() {
        this._updateStatus(true, false)

        if (!api.browser.isSupported()) {
            this.props.popover.disable()
        }
    }

    render($$) {
        var el = $$('div')
            .addClass('sc-np-publishflow')
            .append(this.renderBody($$))

        return el
    }

    renderBody($$) {
        let el = $$('div').addClass('sc-np-publish-body')

        el.append(this.renderCurrentStatus($$))

        el.append(this.renderScheduling($$))

        el.append(this.renderAllowedActions($$))

        el.append(
            $$('div')
                .addClass('sc-np-other-actions')
                .append([
                    $$('button')
                        .attr({
                            title: this.getLabel('Create a new article')
                        })
                        .addClass('sc-np-btn btn-secondary btn-icon')
                        .append(
                            $$('i').addClass('fa fa-file-o')
                        )
                        .css({
                            'float': 'left',
                            'margin-right': '10px'
                        })
                        .on('click', () => {
                            this._clearArticle()
                        }),
                    $$('button')
                        .attr({
                            title: this.getLabel('Create a new copy of this article')
                        })
                        .addClass('sc-np-btn btn-secondary btn-icon')
                        .css({
                            'float': 'left'
                        })
                        .append(
                            $$('i').addClass('fa fa-copy')
                        )
                        .on('click', () => {
                            this._duplicateArticle()
                        })
                ])
        )
        return el
    }

    renderCurrentStatus($$) {
        const statusDef = this.publishFlowMgr.getActionDefinition(this.state.status.qcode)

        if (statusDef === null) {
            return [
                $$('h2').append(
                    this.getLabel('Unknown state')
                ),
                $$('p').append(
                    this.getLabel('This article has an unknown, unsupported, status')
                )
            ]
        }

        const currentStatus = [
            $$('h2').append(
                this.getLabel(statusDef.actionName)
            ),
            $$('p').append(
                this.getLabel(statusDef.statusDescription)
            )
        ]

        return currentStatus
    }

    /**
     * Render pubStart and pubStop fields
     *
     * @param {object}
     * @return {object}
     */
    renderScheduling($$) {
        let fromDateVal = '',
            fromTimeVal = '',
            toDateVal = '',
            toTimeVal = ''

        if (this.state.pubStart) {
            fromDateVal = moment(this.state.pubStart.value).format('YYYY-MM-DD')
            fromTimeVal = moment(this.state.pubStart.value).format('HH:mm')
        }

        if (this.state.pubStop) {
            toDateVal = moment(this.state.pubStop.value).format('YYYY-MM-DD')
            toTimeVal = moment(this.state.pubStop.value).format('HH:mm')
        }

        let el = $$('div')
            .addClass('sc-np-publish-action-section')

        let pubStartdateAttribs = {
            id: 'pfc-lbl-withheld-fromdate',
            type: 'date'
        }

        let pubStarttimeAttribs = {
            id: 'pfc-lbl-withheld-fromtime',
            type: 'time'
        }

        let pubStopdateAttribs = {
            id: 'pfc-lbl-withheld-todate',
            type: 'date'
        }

        let pubStoptimeAttribs = {
            id: 'pfc-lbl-withheld-totime',
            type: 'time'
        }

        if (this.state.status.qcode === 'stat:usable') {
            pubStartdateAttribs.disabled = true
            pubStarttimeAttribs.disabled = true
        }

        if (this.state.status.qcode === 'stat:withheld') {
            const action = this.publishFlowMgr.getActionDefinition(api.newsItem.getPubStatus().qcode)
            if (typeof action.actions === 'object') {
                if (action.actions.pubStart === 'required') {
                    pubStartdateAttribs.required = true
                    pubStarttimeAttribs.required = true
                }

                if (action.actions.pubStop === 'required') {
                    pubStopdateAttribs.required = true
                    pubStoptimeAttribs.required = true
                }
            }
        }

        el.append(
            $$('div')
                .addClass('sc-np-publish-action-section-content sc-np-date-time')
                .append([
                    $$('label')
                        .attr('for', 'pfc-lbl-withheld-from')
                        .append(
                            this.getLabel('Publish from')
                        ),
                    $$('div').append([
                        $$('input')
                            .attr(pubStartdateAttribs)
                            .addClass('form-control')
                            .ref('pfc-lbl-withheld-fromdate')
                            .val(fromDateVal)
                            .on('change', () => {
                                this._setPubStart()
                            }),
                        $$('input')
                            .attr(pubStarttimeAttribs)
                            .addClass('form-control')
                            .ref('pfc-lbl-withheld-fromtime')
                            .val(fromTimeVal)
                            .on('change', () => {
                                this._setPubStart()
                            })
                    ]),
                    $$('label')
                        .attr('for', 'pfc-lbl-withheld-to')
                        .append(
                            this.getLabel('Publish to')
                        ),
                    $$('div').append([
                        $$('input')
                            .attr(pubStopdateAttribs)
                            .addClass('form-control')
                            .ref('pfc-lbl-withheld-todate')
                            .val(toDateVal)
                            .on('change', () => {
                                this._setPubStop()
                            }),
                        $$('input')
                            .attr(pubStoptimeAttribs)
                            .addClass('form-control')
                            .ref('pfc-lbl-withheld-totime')
                            .val(toTimeVal)
                            .on('change', () => {
                                this._setPubStop()
                            })
                    ])
                ])
        )

        return el
    }

    _setPubStart() {
        let date = this.refs['pfc-lbl-withheld-fromdate'].val(),
            time = this.refs['pfc-lbl-withheld-fromtime'].val(),
            dateTime = null

        if (date !== "" && time !== "") {
            dateTime = date + "T" + time
        }
        else if (date !== "" && time === "") {
            dateTime = date + "T00:00"
        }

        if (this.state.pubStart === dateTime) {
            return
        }

        try {
            this.publishFlowMgr.setPubStart(dateTime)
            this.extendState({pubStart: api.newsItem.getPubStart()})
            this._onDocumentChanged() // Have to do this to make sure we get our own change
        }
        catch(ex) {
            api.ui.showMessageDialog(
                [{
                    type: 'error',
                    message: ex.message
                }],
                () => {}
            )
        }
    }

    _setPubStop() {
        let date = this.refs['pfc-lbl-withheld-todate'].val(),
            time = this.refs['pfc-lbl-withheld-totime'].val(),
            dateTime = null

        if (date !== "" && time !== "") {
            dateTime = date + "T" + time
        }
        else if (date !== "" && time === "") {
            dateTime = date + "T00:00"
        }

        if (this.state.pubStop === dateTime) {
            return
        }

        try {
            this.publishFlowMgr.setPubStop(dateTime)
            this.extendState({pubStop: api.newsItem.getPubStop()})
            this._onDocumentChanged() // Have to do this to make sure we get our own change
        }
        catch(ex) {
            api.ui.showMessageDialog(
                [{
                    type: 'error',
                    message: ex.message
                }],
                () => {}
            )
        }
    }

    /**
     * Render all allowed actions for the current status
     *
     * @param {object}
     * @return {object}
     */
    renderAllowedActions($$) {
        let actionsEl = $$('div')
            .addClass('sc-np-publish-actions')

        this.publishFlowMgr.getAllowedActions(this.state.status.qcode).forEach(qcode => {
            actionsEl.append(this.renderGenericAction($$, qcode))
        })

        return actionsEl
    }

    /**
     * Render a generic action button in the action list. If actionLabel and
     * actionIcon contains an array this indicates that the second label/icon
     * should be used for when the current status is the same as the wanted
     * action. I e When you want to have a label "republish" instead of
     * "publish" for the what is essentially the same action.
     *
     * @todo Fetch pubStart/pubStop values for action === 'set'
     *
     * @param {object}
     * @param {string} The qcode for the action to render
     * @return {object}
     */
    renderGenericAction($$, qcode) {
        const action = this.publishFlowMgr.getActionDefinition(qcode)
        if (action === null) {
            return
        }

        // Which label should be used
        let actionLabel = ''
        if (!Array.isArray(action.actionLabel)) {
            actionLabel = action.actionLabel
        }
        else if (qcode !== this.state.status.qcode) {
            actionLabel = action.actionLabel[0]
        }
        else {
            actionLabel = action.actionLabel[1]
        }

        // Which icon should be used
        let icon = ''
        if (!Array.isArray(action.icon)) {
            icon = action.icon
        }
        else if (qcode !== this.state.status.qcode) {
            icon = action.icon[0]
        }
        else {
            icon = action.icon[1]
        }

        // Render element
        return $$('a').append([
            $$('i')
                .addClass('fa ' + icon)
                .css('color', (action.color ? action.color : '#888888')),
            $$('span').append(
                this.getLabel(actionLabel)
            )
        ])
        .on('click', () => {
            this._save(() => {
                try {
                    this.publishFlowMgr.executeAction(
                        qcode,
                        this.refs['pfc-lbl-withheld-fromdate'].val() + 'T' + this.refs['pfc-lbl-withheld-fromtime'].val(),
                        this.refs['pfc-lbl-withheld-todate'].val() + 'T' + this.refs['pfc-lbl-withheld-totime'].val()
                    )
                }
                catch(ex) {
                    api.ui.showMessageDialog(
                        [{
                            type: 'error',
                            message: this.getLabel(ex.message)
                        }],
                        () => {}
                    )

                    return false
                }
            })
        })
    }

    /**
     * Default action called by default action in toolbar/popover
     */
    defaultAction() {
        if (!this.locked) {
            this._initSaveTimeout()
            api.newsItem.save()
            this.props.popover.disable()
            this.props.popover.setIcon('fa-refresh fa-spin fa-fw')
        }
    }

    _failTimeout() {
        this._onDocumentSaveFailed();
        api.ui.showNotification(
            'invalidate',
            api.getLabel("Whoops, the save operation timed out"),
            api.getLabel("Please try again")
        );
    }

    _initSaveTimeout() {
        this._clearSaveTimeout();
        this._saveTimeout = setTimeout(this._failTimeout.bind(this), TIMEOUT)
    }

    _clearSaveTimeout() {
        if (this._saveTimeout) {
            clearTimeout(this._saveTimeout)
            this._saveTimeout = undefined;
        }
    }

    /**
     * Request creation of new article
     */
    _clearArticle() {
        const url = api.router.getEndpoint()

        if (this.state.unsavedChanges) {
            api.ui.showMessageDialog(
                [{
                    type: 'warning',
                    message: this.getLabel('Article contains unsaved changes. Continue without saving?')
                }],
                () => {
                    window.location.replace(url)
                }
            )
        }
        else {
            window.location.replace(url)
        }

    }

    /**
     * Request creation of a new article based on the content of the current article
     */
    _duplicateArticle() {
        if (this.state.unsavedChanges) {
            api.ui.showMessageDialog(
                [{
                    type: 'warning',
                    message: this.getLabel('Article contains unsaved changes. Continue without saving?')
                }],
                () => {
                    this._createDuplicate()
                }
            )
            return
        }

        this._createDuplicate()
    }

    /**
     * Execute creation of a new article copy
     */
    _createDuplicate() {
        this.publishFlowMgr.setPubStatus('imext:draft')

        this.extendState({
            status: api.newsItem.getPubStatus(),
            unsavedChanges: false,
            pubStart: api.newsItem.getPubStart(),
            pubStop: api.newsItem.getPubStop(),
            allowed: this.publishFlowMgr.getAllowedActions(status.qcode),
            previousState: null
        })

        api.article.copy();
        this._updateStatus(true, true)
        this.props.popover.close()
    }

    /**
     * Save current status and handle status change and save
     */
    _save(beforeSaveFunc) {
        this._saveState()

        if (beforeSaveFunc) {
            if (false === beforeSaveFunc()) {
                return
            }
        }

        this.defaultAction()
    }

    /**
     * Save the state so that we can restore it if a save fails
     */
    _saveState() {
        this.extendState({
            previousState: {
                pubStatus: api.newsItem.getPubStatus(),
                pubStart: api.newsItem.getPubStart(),
                pubStop: api.newsItem.getPubStop()
            }
        })
    }

    /**
     * When save fails, restore previous state and update UI
     */
    _onDocumentSaveFailed() {
        this._clearSaveTimeout()
        this.saveInProgress = false

        this.props.popover.setIcon('fa-ellipsis-h')
        this.props.popover.enable()

        if (!this.state.previousState) {
            this._updateStatus(false)
            return
        }

        api.newsItem.setPubStatus(pluginId, this.state.previousState.pubStatus)

        if (this.state.previousState.pubStart) {
            api.newsItem.setPubStart(pluginId, this.state.previousState.pubStart)
        }
        else {
            api.newsItem.removePubStart(pluginId)
        }

        if (this.state.previousState.pubStop) {
            api.newsItem.setPubStop(pluginId, this.state.previousState.pubStop)
        }
        else {
            api.newsItem.removePubStop(pluginId)
        }

        this.extendState({
            status: api.newsItem.getPubStatus(),
            pubStart: api.newsItem.getPubStart(),
            pubStop: api.newsItem.getPubStop(),
            previousState: null,
            unsavedChanges: true
        })

        this._updateStatus(true)
    }

    /**
     * When document is marked unsaved
     */
    _onDocumentChanged() {
        this._updateButton(true)

        this.extendState({
            unsavedChanges: true
        })
    }

    /**
     * When saved, update state and UI
     */
    _onDocumentSaved() {
        this._clearSaveTimeout()
        this.saveInProgress = false

        this.props.popover.setIcon('fa-ellipsis-h')
        this.props.popover.enable()

        this.extendState({
            status: api.newsItem.getPubStatus(),
            pubStart: api.newsItem.getPubStart(),
            pubStop: api.newsItem.getPubStop(),
            unsavedChanges: false
        })

        this._updateStatus(true)
    }

    /**
     * Update UI
     */
    _updateStatus(updateButtonSavedLabel, unsavedChanges) {
        const statusDef = this.publishFlowMgr.getActionDefinition(this.state.status.qcode)

        if (updateButtonSavedLabel) {
            this._updateButton(unsavedChanges)
        }

        if (this.state.status.qcode === 'stat:usable') {
            this.props.popover.setStatusText(
                statusDef.statusTitle +
                " " +
                moment(this.state.pubStart.value).fromNow()
            )
        }
        else if (this.state.status.qcode === 'stat:withheld') {
            this.props.popover.setStatusText(
                statusDef.statusTitle +
                " " +
                moment(this.state.pubStart.value).fromNow()
            )
        }
        else {
            this.props.popover.setStatusText(
                statusDef.statusTitle
            )
        }
    }

    _updateButton(unsavedChanges) {
        let caption = (this.state.status.qcode === 'stat:usable') ? 'Update' : 'Save'
        if (unsavedChanges) {
            caption += ' *'
        }

        this.props.popover.setButtonText(
            this.getLabel(caption)
        )
    }
}

export default PublishFlowComponent
