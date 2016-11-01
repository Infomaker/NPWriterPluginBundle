import PublishFlowConfiguration from './PublishFlowConfiguration'
import './scss/publishflow.scss'

const {Component} = substance
const {api, moment} = writer
const pluginId = 'se.infomaker.publishflow'

class PublishFlowComponent extends Component {
    constructor(...args) {
        super(...args)

        api.events.on(pluginId, 'document:changed', () => {
            this.props.setButtonText(
                this.getLabel('Save *')
            )
        })

        api.events.on(pluginId, 'document:saved', () => {
            this._onDocumentSaved()
        })
    }

    getInitialState() {
        let status = api.newsItem.getPubStatus()
        this.config = new PublishFlowConfiguration()

        return {
            status: status,
            pubStart: api.newsItem.getPubStart(),
            pubStop: api.newsItem.getPubStop(),
            allowed: this.config.getAllowedActions(status.qcode)
        }
    }

    didMount() {
        this.props.setButtonText(
            this.getLabel('Save')
        )

        this._updateStatus()

        if (!api.browser.isSupported()) {
            this.props.disable()
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
                        this.getLabel('Publish article?')
                    ),
                    $$('p').append(
                        this.getLabel('Article is currently schedule to be published') +
                        ' ' +
                        moment(this.state.pubStart).fromNow()
                    )
                ])
                break

            case 'stat:usable':
                el.append([
                    $$('h2').append(
                        this.getLabel('Republish article?')
                    ),
                    $$('p').append(
                        this.getLabel('Article was published') +
                        ' ' +
                        moment(this.state.pubStart).fromNow()
                    )
                ])
                break

            case 'stat:canceled':
                el.append([
                    $$('h2').append(
                        this.getLabel('Republish article?')
                    ),
                    $$('p').append(
                        this.getLabel('Article was canceled') +
                        ' ' +
                        moment(this.state.pubStop).fromNow()
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
                )
        )
        return el
    }

    renderAllowedActions($$) {
        let actionsEl = $$('div')
            .addClass('sc-np-publish-actions')

        this.config.getAllowedActions(this.state.status.qcode).forEach(action => {
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
            // FIXME: Refactor this code to a separate function
            // FIXME: Must be able to reset to previous state
            api.newsItem.removePubStart(pluginId)
            api.newsItem.removePubStop(pluginId)
            api.newsItem.setPubstatus(
                pluginId,
                {
                    qcode: 'imext:draft'
                }
            )
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
            // FIXME: Refactor this code to a separate function
            // FIXME: Must be able to reset to previous state
            api.newsItem.removePubStart(pluginId)
            api.newsItem.removePubStop(pluginId)
            api.newsItem.setPubstatus(
                pluginId,
                {
                    qcode: 'imext:done'
                }
            )
            this.defaultAction()
        })

    }

    renderActionWithheld($$) {
        return $$('a').append([
            $$('i').addClass('fa fa-clock-o'),
            $$('span').append(
                this.getLabel('Schedule for publish...')
            )
        ])
    }

    renderActionUsable($$) {
        let label = this.getLabel('Publish article')

        if (this.state.status.qcode === 'stat:usable') {
            label = this.getLabel('Republish article')
        }

        return $$('a').append([
            $$('i').addClass('fa fa-send'),
            $$('span').append(label)
        ])
    }

    renderActionCanceled($$) {
        return $$('a').append([
            $$('span').append(
                $$('i').addClass('fa fa-ban'),
                this.getLabel('Unpublish article')
            )
        ])
    }

    defaultAction() {
        this.props.disable()
        this.props.setIcon('fa-refresh fa-spin fa-fw')

        api.newsItem.save()
    }

    _onDocumentSaved() {
        this.props.setButtonText(
            this.getLabel('Save')
        )

        this.props.setIcon('fa-ellipsis-h')
        this.props.enable()

        this.extendState({
            status: api.newsItem.getPubStatus(),
            pubStart: api.newsItem.getPubStart(),
            pubStop: api.newsItem.getPubStop()
        })

        this._updateStatus()
    }

    _updateStatus() {
        if (this.state.status.qcode === 'stat:usable') {
            this.props.setStatusText(
                this.getLabel(this.state.status.qcode) +
                " " +
                moment(this.state.pubStart).fromNow()
            )
        }
        else if (this.state.status.qcode === 'stat:withheld') {
            this.props.setStatusText(
                this.getLabel(this.state.status.qcode) +
                " " +
                moment(this.state.pubStart).fromNow()
            )
        }
        else {
            this.props.setStatusText(
                this.getLabel(this.state.status.qcode)
            )
        }
    }
}

export default PublishFlowComponent
