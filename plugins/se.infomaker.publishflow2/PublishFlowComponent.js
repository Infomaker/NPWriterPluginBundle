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
            if (!this.saveInProgress) {
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
        api.events.off(pluginId, event.DOCUMENT_SAVE_FAILED)
        api.events.off(pluginId, event.USERACTION_CANCEL_SAVE)
        api.events.off(pluginId, event.USERACTION_SAVE)
        api.events.off(pluginId, event.USERACTION_LOCK)
        api.events.off(pluginId, event.USERACTION_UNLOCK)
        this._clearSaveTimeout();
    }

    getInitialState() {
        this.publishFlowMgr = new PublishFlowManager(pluginId)

        return {
            status: api.newsItem.getPubStatus(),
            unsavedChanges: false,
            pubStart: api.newsItem.getPubStart(),
            pubStop: api.newsItem.getPubStop(),
            hasPublishedVersion: api.newsItem.getHasPublishedVersion(),
            previousState: null
        }
    }

    didMount() {
        this.renderPopover()

        if (!api.browser.isSupported()) {
            this.props.popover.disable()
        }
    }

    render($$) {
        return $$('div')
            .addClass('sc-np-publishflow')
            .append(this.renderBody($$))
    }

    renderBody($$) {
        let el = $$('div').addClass('sc-np-publish-body')

        el.append(this.renderCurrentStatus($$))

        el.append(this.renderScheduling($$))

        el.append(this.renderTransitions($$))

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
        const statusDef = this.publishFlowMgr.getStateDefinitionByPubStatus(this.state.status.qcode)

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

        return [
            $$('h2').append(
                this.getLabel(statusDef.title)
            ),
            $$('p').append(
                this.getLabel(statusDef.description)
            )
        ]
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
            const stateDef = this.publishFlowMgr.getStateDefinitionByPubStatus(this.state.status.qcode)
            if (typeof stateDef.actions === 'object') {
                if (stateDef.actions.pubStart === 'required') {
                    pubStartdateAttribs.required = true
                    pubStarttimeAttribs.required = true
                }

                if (stateDef.actions.pubStop === 'required') {
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
        catch (ex) {
            api.ui.showMessageDialog(
                [{
                    type: 'error',
                    message: ex.message
                }],
                () => {
                }
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
        catch (ex) {
            api.ui.showMessageDialog(
                [{
                    type: 'error',
                    message: ex.message
                }],
                () => {
                }
            )
        }
    }

    /**
     * Render all allowed transitions for the current state
     *
     * @param {VirtualElement} $$
     * @return {VirtualObject}
     */
    renderTransitions($$) {
        let actionsEl = $$('div')
            .addClass('sc-np-publish-actions')

        this.publishFlowMgr.getTransitions(this.state.status.qcode, this.state.hasPublishedVersion)
            .forEach(transition => {
                actionsEl.append(this.renderTransition($$, transition))
            })

        return actionsEl
    }

    /**
     * Render transition which is defined in config file.
     * @param {VirtualElement} $$
     * @param {string} transition The transition, in the configuration, to render
     * @return {VirtualObject}
     */
    renderTransition($$, transition) {

        return $$('a')
            .append([
                $$('i')
                    .addClass('fa ' + transition.icon)
                    .css('color', (transition.color ? transition.color : '#888888')),
                $$('span').append(
                    this.getLabel(transition.title)
                )
            ])
            .on('click', () => {
                this._save(() => {
                    try {
                        this.publishFlowMgr.executeTransition(
                            transition.nextState,
                            this.refs['pfc-lbl-withheld-fromdate'].val() + 'T' + this.refs['pfc-lbl-withheld-fromtime'].val(),
                            this.refs['pfc-lbl-withheld-todate'].val() + 'T' + this.refs['pfc-lbl-withheld-totime'].val(),
                            this.state.status.qcode,
                            this.state.hasPublishedVersion
                        )
                    }
                    catch (ex) {
                        api.ui.showMessageDialog(
                            [{
                                type: 'error',
                                message: this.getLabel(ex.message)
                            }],
                            () => {
                            }
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
            hasPublishedVersion: api.newsItem.getHasPublishedVersion(),
            unsavedChanges: false,
            pubStart: api.newsItem.getPubStart(),
            pubStop: api.newsItem.getPubStop(),
            previousState: null
        })

        api.article.copy();
        this.renderPopover()
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
                pubStop: api.newsItem.getPubStop(),
                hasPublishedVersion: api.newsItem.getHasPublishedVersion()
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
            this.renderPopover()
            return
        }

        api.newsItem.setPubStatus(pluginId, this.state.previousState.pubStatus)

        api.newsItem.setHasPublishedVersion(pluginId, this.state.previousState.hasPublishedVersion)

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
            hasPublishedVersion: api.newsItem.getHasPublishedVersion(),
            previousState: null,
            unsavedChanges: true
        })

        this.renderPopover()
    }

    /**
     * When document is marked unsaved
     */
    _onDocumentChanged() {
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
            hasPublishedVersion: api.newsItem.getHasPublishedVersion(),
            unsavedChanges: false
        })

        this.renderPopover()
    }

    /**
     * Update UI
     */
    // TODO can we call this in render function?
    renderPopover() {
        const stateDef = this.publishFlowMgr.getStateDefinitionByPubStatus(this.state.status.qcode)

        this.props.popover.setButtonText(
            stateDef.saveActionLabel + (this.state.unsavedChanges ? ' *' : '')
        )

        // TODO Visualize pubStatus and hasPublishedVersion according to Joacim

        let status = {title:stateDef.title}

        if (this.state.hasPublishedVersion) {
            status.text = `${this.getLabel('Published')} ${moment(this.state.pubStart.value).fromNow()}`

        }

        this.props.popover.setStatusText(
            status
        )
    }

}

export default PublishFlowComponent
