import {Component, Button} from "substance";
import {api} from "writer";
import JobImagesListComponent from "./JobImagesListComponent";
import NPGateway from "./NPGateway";
import NPFetcher from "./NPFetcher";
import Auth from "./Auth";
import LoginComponent from "./LoginComponent";


class JobComponent extends Component {

    constructor(...args) {
        super(...args)

        // Only necessary to login to Newspilot if Newspilot
        // article is coupled with Writer article
        if (this.isConnectedArticle()) {
            if (Auth.isLoggedIn()) {
                this.initGateway()
            }
        }

        this.handleActions({
            'login:success': this.initGateway,
        });
    }

    isConnectedArticle() {
        if (this.getExternalSystemId()) {
            return !this.state.articleId.startsWith('__temp')
        } else {
            return this.state.articleId > 0
        }
    }

    getArticleIdFromNewsitem() {
        if (this.getExternalSystemId()) {
            return api.newsItem.getIdForArticle()
        } else {
            return api.newsItem.getNewspilotArticleId()
        }

    }

    getInitialState() {
        const articleId = this.getArticleIdFromNewsitem()

        return {
            articleId: articleId ? articleId : 0,
            jobImages: []
        }
    }

    _onDragStart(e) {
        e.stopPropagation()
    }

    updateModel(data) {
        this.extendState({jobImages: data})
    }

    dispose() {
        if (this.gateway) {
            this.gateway.disconnect()
        }
    }

    initGateway() {
        // Sanity check
        if (this.state.articleId === 0) {
            return
        }

        const newspilotHostName = this.getNewspilotHostName()
        const externalSystemId = this.getExternalSystemId()

        NPFetcher.getArticle(newspilotHostName, this.state.articleId, externalSystemId)
            .then((article) => {
                let {user, password} = Auth.getCredentials()
                this.gateway = new NPGateway(
                    newspilotHostName, user, password, article.jobId, this.updateModel.bind(this)
                )
                this.extendState({error: undefined})
            })
            .catch((e) => {
                this.extendState({error: e})
            })
    }

    reconnect() {
        try {
            this.dispose()
        } catch (e) {

        }

        this.initGateway()
    }

    getNewspilotLoginUrl() {
        return NPFetcher.getNewspilotServer(this.getNewspilotHostName()) + '/newspilot/rest/users/me'
    }

    getNewspilotHostName() {
        return api.getConfigValue('se.infomaker.newspilot.job', 'newspilotHostName')
    }

    getExternalSystemId() {
        return api.getConfigValue('se.infomaker.newspilot.job', 'externalSystemId')
    }

    render($$) {
        const el = $$('div').addClass('npjob')

        if (this.isConnectedArticle() && !this.state.error) {
            if (!Auth.isLoggedIn()) {
                el.append($$(LoginComponent, {server: this.getNewspilotLoginUrl()}))
                return el;
            }

            const imageList = $$(JobImagesListComponent, {
                jobImages: this.state.jobImages
            }).ref('imageList')

            el.append($$('h2').append(this.getLabel('Images')))
            el.append(imageList)

        } else if (this.state.error && this.state.error.status === 404) {
            el.append($$('h2').append(this.getLabel('Article not linked with Newspilot')))
        }

        if (this.state.error && this.state.error.message) {
            el.append(
                $$('div').addClass('job-panel').append([
                    $$('div').addClass('job-panel-heading').append(this.getLabel('An error has occurred')),
                    $$('div').addClass('job-panel-body').append(this.state.error.message),
                    $$(Button, {icon: 'reload'}).addClass('job-refresh').on('click', this.reconnect)
                ])
            )
        }

        return el;
    }
}

export default JobComponent