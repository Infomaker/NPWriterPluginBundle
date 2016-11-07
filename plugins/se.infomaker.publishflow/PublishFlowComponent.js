import PublishFlowManager from './PublishFlowManager'
import './scss/publishflow.scss'

const {Component} = substance
const {api, moment, event} = writer
const pluginId = 'se.infomaker.publishflow'

class PublishFlowComponent extends Component {
    constructor(...args) {
        super(...args)

        api.events.on(pluginId, event.DOCUMENT_CHANGED, () => {
            this.props.popover.setButtonText(
                this.getLabel('Save *')
            )
        })

        api.events.on(pluginId, event.DOCUMENT_SAVED, () => {
            this._onDocumentSaved()
        })

        api.events.on(pluginId, event.DOCUMENT_SAVE_FAILED, () => {
            this._onDocumentSaveFailed()
        })
    }

    dispose() {
        api.events.off(pluginId, 'document:changed')
        api.events.off(pluginId, 'document:saved')
    }

    getInitialState() {
        let status = api.newsItem.getPubStatus()
        this.publishFlowMgr = new PublishFlowManager(pluginId)

        return {
            status: status,
            pubStart: api.newsItem.getPubStart(),
            pubStop: api.newsItem.getPubStop(),
            allowed: this.publishFlowMgr.getAllowedActions(status.qcode)
        }
    }

    didMount() {
        this.props.popover.setButtonText(
            this.getLabel('Save')
        )

        this._updateStatus()

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
        let el = $$('div').addClass('sc-np-publish-body'),
            actions = this.renderAllowedActions($$)

        switch(this.state.status.qcode) {
            case 'imext:draft':
                el.append([
                    $$('h2').append(
                        this.getLabel('Publish article?')
                    ),
                    $$('p').append(
                        this.getLabel('This article is currently an unpublished draft')
                    )
                ])
                break

            case 'imext:done':
                el.append([
                    $$('h2').append(
                        this.getLabel('Publish article?')
                    ),
                    $$('p').append(
                        this.getLabel('Article is currently pending approval')
                    )
                ])
                break

            case 'stat:withheld':
                el.append([
                    $$('h2').append(
                        this.getLabel('Scheduled')
                    ),
                    $$('p').append(
                        this.getLabel('Article is scheduled to be published') +
                        ' ' +
                        moment(this.state.pubStart.value).fromNow()
                    )
                ])

                var specEl = $$('p').addClass('dates').append([
                    $$('span').append(
                        this.getLabel('From') + ': '
                    ),
                    $$('strong').append(
                        moment(this.state.pubStart.value).format('YYYY-MM-DD HH:mm')
                    )
                ])

                if (this.state.pubStop) {
                    let toObj = moment(this.state.pubStop.value)
                    if (toObj.isValid()) {
                        specEl.append([
                            $$('br'),
                            $$('span').append(
                                this.getLabel('To') + ': '
                            ),
                            $$('strong').append(
                                moment(this.state.pubStop.value).format('YYYY-MM-DD HH:mm')
                            )
                        ])
                    }
                }

                el.append(specEl)

                break

            case 'stat:usable':
                el.append([
                    $$('h2').append(
                        this.getLabel('Republish article?')
                    ),
                    $$('p').append(
                        this.getLabel('Article was published') +
                        ' ' +
                        moment(this.state.pubStart.value).fromNow()
                    )
                ])
                break

            case 'stat:canceled':
                el.append([
                    $$('h2').append(
                        this.getLabel('Publish article again?')
                    ),
                    $$('p').append(
                        this.getLabel('Article has been canceled and is no longer published')
                    )
                ])
                break

            default:
                el.append([
                    $$('h2').append(
                        this.getLabel('Unknown state')
                    ),
                    $$('p').append(
                        this.getLabel('This article has an unknown, unsupported, status')
                    )
                ])
                break
        }

        el.append(actions)
        el.append(
            $$('div')
                .css({'text-align': 'right'})
                .append(
                    $$('button')
                        .addClass('btn-secondary')
                        .append(
                            this.getLabel('Cancel')
                        )
                        .on('click', () => {
                            this.props.popover.close()
                        })
                )
        )
        return el
    }

    renderAllowedActions($$) {
        let actionsEl = $$('div')
            .addClass('sc-np-publish-actions')

        this.publishFlowMgr.getAllowedActions(this.state.status.qcode).forEach(action => {
            switch(action) {
                case 'imext:draft':
                    actionsEl.append(this.renderActionDraft($$))
                    break
                case 'imext:done':
                    actionsEl.append(this.renderActionDone($$))
                    break
                case 'stat:withheld':
                    actionsEl.append(this.renderActionWithheld($$))
                    break
                case 'stat:usable':
                    actionsEl.append(this.renderActionUsable($$))
                    break
                case 'stat:canceled':
                    actionsEl.append(this.renderActionCanceled($$))
                    break
            }
        })

        return actionsEl
    }

    renderActionDraft($$) {
        return $$('a').append([
            $$('i').addClass('fa fa-pencil'),
            $$('span').append(
                this.getLabel('Save as draft')
            )
        ])
        .on('click', () => {
            this._save(() => {
                this.publishFlowMgr.setToDraft()
            })
        })
    }

    renderActionDone($$) {
        return $$('a').append([
            $$('i').addClass('fa fa-check-circle-o'),
            $$('span').append(
                this.getLabel('Ready for approval')
            )
        ])
        .on('click', () => {
            this._save(() => {
                this.publishFlowMgr.setToDone()
            })
        })

    }

    renderActionWithheld($$) {
        let el = $$('div')
            .addClass('sc-np-publish-action-section')
            .ref('pfc-withheld')

        el.append(
            $$('a').append([
                $$('i').addClass('fa fa-clock-o'),
                $$('span').append(
                    this.getLabel('Schedule for publish')
                )
            ])
            .addClass('more')
            .on('click', () => {
                if (this.refs['pfc-withheld'].hasClass('active')) {
                    this.refs['pfc-withheld'].removeClass('active')
                }
                else {
                    this.refs['pfc-withheld'].addClass('active')
                }
            })
        )

        let fromVal = '',
            toVal = '';

        if (this.state.pubStart) {
            fromVal = moment(this.state.pubStart.value).format('YYYY-MM-DDTHH:mm')
        }

        if (this.state.pubStop) {
            toVal = moment(this.state.pubStop.value).format('YYYY-MM-DDTHH:mm')
        }

        el.append(
            $$('div')
                .addClass('sc-np-publish-action-section-content sc-np-date-time')
                .append([
                    $$('label')
                        .attr('for', 'pfc-lbl-withheld-from')
                        .append(
                            this.getLabel('From')
                        ),
                    $$('input')
                        .attr({
                            id: 'pfc-lbl-withheld-from',
                            type: 'datetime-local',
                            required: true
                        })
                        .addClass('form-control')
                        .ref('pfc-lbl-withheld-from')
                        .val(fromVal),
                    $$('label')
                        .attr('for', 'pfc-lbl-withheld-to')
                        .append(
                            this.getLabel('To')
                        ),
                    $$('input')
                        .attr({
                            id: 'pfc-lbl-withheld-to',
                            type: 'datetime-local'
                        })
                        .addClass('form-control')
                        .ref('pfc-lbl-withheld-to')
                        .val(toVal),
                    $$('div')
                        .addClass('sc-np-publish-action-section-content-actions')
                        .append(
                            $$('button')
                                .addClass('btn-secondary')
                                .append(
                                    this.getLabel('Save')
                                )
                            )
                            .on('click', () => {
                                try {
                                    var fromVal = this.refs['pfc-lbl-withheld-from'].val(),
                                        toVal = this.refs['pfc-lbl-withheld-to'].val()
                                    this._save(() => {
                                        this.publishFlowMgr.setToWithheld(
                                            fromVal,
                                            toVal
                                        )
                                    })
                                }
                                catch(ex) {
                                    this.refs['pfc-lbl-withheld-from'].addClass('imc-flash')
                                    window.setTimeout(() => {
                                        this.refs['pfc-lbl-withheld-from'].removeClass('imc-flash')
                                    }, 500)
                                    return false
                                }
                            })

                ])
        )

        return el
    }

    renderActionUsable($$) {
        let el = $$('a')

        if (this.state.status.qcode === 'stat:usable') {
            el.append([
                $$('i').addClass('fa fa-retweet'),
                $$('span').append(
                    this.getLabel('Republish article')
                )
            ])
        }
        else {
            el.append([
                $$('i').addClass('fa fa-send'),
                $$('span').append(
                    this.getLabel('Publish article')
                )
            ])
        }

        el.on('click', () => {
            this._save(() => {
                this.publishFlowMgr.setToUsable()
            })
        })

        return el
    }

    renderActionCanceled($$) {
        return $$('a').append([
            $$('span').append(
                $$('i').addClass('fa fa-ban'),
                this.getLabel('Unpublish article')
            )
        ])
        .on('click', () => {
            this._save(() => {
                this.publishFlowMgr.setToCanceled()
            })
        })
    }

    /**
     * Default action called by default action in toolbar/popover
     */
    defaultAction() {
        this.props.popover.disable()
        this.props.popover.setIcon('fa-refresh fa-spin fa-fw')

        api.newsItem.save()
    }

    /**
     * Save current status and handle status change and save
     */
    _save(beforeSaveFunc) {
        this._saveState()

        if (beforeSaveFunc) {
            beforeSaveFunc()
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
        this.props.popover.setIcon('fa-ellipsis-h')
        this.props.popover.enable()

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
            previousState: null
        })

        this._updateStatus(false)
    }

    /**
     * When saved, update state and UI
     */
    _onDocumentSaved() {
        this.props.popover.setIcon('fa-ellipsis-h')
        this.props.popover.enable()

        this.extendState({
            status: api.newsItem.getPubStatus(),
            pubStart: api.newsItem.getPubStart(),
            pubStop: api.newsItem.getPubStop()
        })

        this._updateStatus(true)
    }

    /**
     * Update UI
     */
    _updateStatus(updateButtonSavedLabel) {

        if (updateButtonSavedLabel) {
            this.props.popover.setButtonText(
                this.getLabel('Save')
            )
        }

        if (this.state.status.qcode === 'stat:usable') {
            this.props.popover.setStatusText(
                this.getLabel(this.state.status.qcode) +
                " " +
                moment(this.state.pubStart.value).fromNow()
            )
        }
        else if (this.state.status.qcode === 'stat:withheld') {
            this.props.popover.setStatusText(
                this.getLabel(this.state.status.qcode) +
                " " +
                moment(this.state.pubStart.value).fromNow()
            )
        }
        else {
            this.props.popover.setStatusText(
                this.getLabel(this.state.status.qcode)
            )
        }
    }
}

export default PublishFlowComponent
