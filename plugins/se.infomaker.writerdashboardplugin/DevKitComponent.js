import { Component } from 'substance'
import { api, event } from 'writer'

const BASE_CLASS = 'se-infomaker-writer-dashboard-plugin'

class DevKitComponent extends Component {

    dispose() {
        window.removeEventListener('keydown', this.handleKeyDown)
        window.removeEventListener('keyup', this.handleKeyUp)
    }

    constructor(...args) {
        super(...args)

        this.handleReceivedData = this.handleReceivedData.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)

        window.onmessage = this.handleReceivedData
        window.addEventListener('keydown', this.handleKeyDown)
        window.addEventListener('keyup', this.handleKeyUp)

        this.identifier = 'se.infomaker.Writer'
    }

    getInitialState() {
        return {
            connected: false,
            user: null,
            temporaryUUID: api.newsItem.getTemporaryId(),
            identifier: 'se.infomaker.Writer',
            uuid: api.newsItem.getIdForArticle() ? api.newsItem.getIdForArticle() : api.newsItem.getTemporaryId()
        }
    }

    didMount() {
        api.events.on('DW Plugin', event.DOCUMENT_CHANGED, event => {
            this.handleSendData({
                identifier: this.state.identifier,
                uuid: this.state.uuid,
                title: this.getArticleTitle(),
                event: event
            })
        })
        
        api.events.on('DW Plugin', event.DOCUMENT_SAVED, event => {
            this.handleSendData({
                identifier: this.state.identifier,
                uuid: this.state.uuid,
                title: this.getArticleTitle(),
                temporaryUUID: this.state.temporaryUUID,
                event: event
            })
        })

        api.events.on('DW Plugin', event.DOCUMENT_SAVE_FAILED, event => {
            this.handleSendData({
                identifier: this.state.identifier,
                uuid: this.state.uuid,
                title: this.getArticleTitle(),
                event: event
            })
        })
        
        this.handleSendData({
            identifier: this.state.identifier,
            uuid: this.state.uuid,
            title: this.getArticleTitle()
        })
    }

    handleSendData(data) {
        if (window !== window.parent) {
            window.top.postMessage(data, '*')
        }
    }

    handleReceivedData(event) {
        if (event.data.identifier === this.state.identifier) {
            // console.log('Write-Plugin ::::', event.data)

            this.extendState({
                connected: true,
                user: event.data.user
            })

            api.newsItem.addSimpleAuthor('DW Plugin', `${event.data.user.name} | ${event.data.user.organization}`)
        }
    }

    getArticleTitle() {
        const documentNodes = api.document.getDocumentNodes()
        const nodeTypeToUseForTitle = [
            'headline',
            'preamble',
            'paragraph'
        ]

        let title = 'Newspilot Writer'

        nodeTypeToUseForTitle.some(nodeType => {
            const docNode = documentNodes.find(node => {
                return node.type === nodeType ? node : false
            })

            if (docNode) {
                title = docNode.content.substr(0, 100)
                return true
            } else {
                return false
            }
        })
        
        return title
    }

    handleKeyDown(event) {
        const keyboardEvent = {
            eventType: 'key:down',
            keyCode: event.keyCode
        }

        this.handleSendData({
            identifier: this.state.identifier,
            keyboardEvent
        })
    }

    handleKeyUp(event) {
        const keyboardEvent = {
            eventType: 'key:up',
            keyCode: event.keyCode
        }

        this.handleSendData({
            identifier: this.state.identifier,
            keyboardEvent
        })
    }

    render($$) {
        // const { connected, user } = this.state

        // const wrapper = $$('div').addClass(`${BASE_CLASS}-wrapper`)

        // wrapper.append($$('h2').append(this.getLabel('Dashboard')).addClass(`${BASE_CLASS}-wrapper-title`))
        
        // if (connected) {
        //     wrapper.append($$('p').append(`username: ${user.name}`))
        //     wrapper.append($$('p').append(`organization: ${user.organization}`))
        // } else {
        //     wrapper.append($$('p').append('not connected'))
        // }

        // return wrapper

        return $$('div').addClass(`${BASE_CLASS}-wrapper`)
    }
}
export default DevKitComponent