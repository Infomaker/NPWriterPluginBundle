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
        if (this.state.articleId > 0) {
            if (Auth.isLoggedIn()) {
                this.initGateway()
            }
        }

        this.handleActions({
            'login:success': this.initGateway,
        });
    }

    getInitialState() {
        const articleId = api.newsItem.getNewspilotArticleId()

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

        const newspilotServer = this.getNewspilotServer()

        const newspilotHost = this.extractDomain(newspilotServer)

        NPFetcher.getArticle(newspilotServer, this.state.articleId)
            .then((article) => {
                let {user, password} = Auth.getCredentials()
                this.gateway = new NPGateway(
                    newspilotHost, user, password, article.jobId, this.updateModel.bind(this)
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
        return this.getNewspilotServer() + '/newspilot/'
    }

    getNewspilotServer() {
        return api.getConfigValue('se.infomaker.newspilot.job', 'newspilotServer')
    }

    extractDomain(url) {
        let domain;

        // Find & remove protocol (http, ftp, etc.) and get domain
        if (url.indexOf("://") > -1) {
            domain = url.split('/')[2];
        }
        else {
            domain = url.split('/')[0];
        }

        // Find & remove port number
        domain = domain.split(':')[0];

        return domain;
    }

    render($$) {

        const el = $$('div').addClass('npjob')

        if (this.state.articleId > 0) {
            if (!Auth.isLoggedIn()) {
                el.append($$(LoginComponent, {server: this.getNewspilotLoginUrl()}))
                return el;
            }

            const imageList = $$(JobImagesListComponent, {
                jobImages: this.state.jobImages
            }).ref('imageList')

            el.append($$('h2').append(this.getLabel('Images')))
            el.append(imageList)

        } else {
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