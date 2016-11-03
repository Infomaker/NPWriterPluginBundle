import PublishFlowManager from './PublishFlowManager'
import './scss/publishflow.scss'

const {Component} = substance
const {api, moment} = writer
const pluginId = 'se.infomaker.publishflow'

class PublishFlowComponent extends Component {
    constructor(...args) {
        super(...args)

        api.events.on(pluginId, 'document:changed', () => {
            this.props.popover.setButtonText(
                this.getLabel('Save *')
            )
        })

        api.events.on(pluginId, 'document:saved', () => {
            this._onDocumentSaved()
        })
    }

    dispose() {
        api.events.off(pluginId, 'document:changed')
        api.events.off(pluginId, 'document:saved')
    }

    getInitialState() {
        let status = api.newsItem.getPubStatus()
        this.publishFlowMgr = new PublishFlowManager(pluginId, api)

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

                var specEl = $$('p').append([
                    this.getLabel('From') + ': ',
                    $$('strong').append(
                        moment(this.state.pubStart.value).format('YYYY-MM-DD HH:mm')
                    )
                ])

                var toObj = moment(this.state.pubStop)
                if (toObj.isValid()) {
                    specEl.append([
                        this.getLabel('To') + ': ',
                        $$('strong').append(
                            moment(this.state.pubStop.value).format('YYYY-MM-DD HH:mm')
                        )
                    ])
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
            // FIXME: Must be able to reset to previous state
            this.publishFlowMgr.setToDraft()
            this.defaultAction()
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
            // FIXME: Must be able to reset to previous state
            this.publishFlowMgr.setToDone()
            this.defaultAction()
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
                    this.getLabel('Schedule for publish...')
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
                        .ref('pfc-lbl-withheld-from'),
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
                        .ref('pfc-lbl-withheld-to'),
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
                                // FIXME: Must be able to reset to previous state
                                try {
                                    this.publishFlowMgr.setToWithheld(
                                        this.refs['pfc-lbl-withheld-from'].val(),
                                        this.refs['pfc-lbl-withheld-to'].val()
                                    )
                                    this.defaultAction()
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
            // FIXME: Must be able to reset to previous state
            this.publishFlowMgr.setToUsable()
            this.defaultAction()
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
            this.publishFlowMgr.setToCanceled()
            this.defaultAction()
        })
    }

    defaultAction() {
        this.props.popover.disable()
        this.props.popover.setIcon('fa-refresh fa-spin fa-fw')

        api.newsItem.save()
    }

    _onDocumentSaved() {
        this.props.popover.setButtonText(
            this.getLabel('Save')
        )

        this.props.popover.setIcon('fa-ellipsis-h')
        this.props.popover.enable()

        this.extendState({
            status: api.newsItem.getPubStatus(),
            pubStart: api.newsItem.getPubStart(),
            pubStop: api.newsItem.getPubStop()
        })

        this._updateStatus()
    }

    _updateStatus() {
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
