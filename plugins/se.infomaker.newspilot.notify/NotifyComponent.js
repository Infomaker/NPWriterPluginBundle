import {Component} from "substance";
import {api} from "writer";

class NotifyComponent extends Component {

    execute() {
        return new Promise(resolve => {
            setTimeout(() => {
                this.publishArticle();
                resolve();
            }, 1000)
        })
    }

    /**
     * Constructor
     * @param args
     */
    constructor(...args) {
        super(...args);
        this.pluginId = 'se.infomaker.newspilot.notify';
    }

    publishArticle() {
        if (this.state.updateAfterPost) {
            this.extendState({updateAfterPost: false});
            return
        }
        let newsItemArticle = api.editorSession.saveHandler.getExportedDocument();

        let newsItemArticleId = api.newsItem.getGuid()

        this.makeRequest("GET", '/articles/exchanges/external/' + newsItemArticleId, null, "xml").then(response => {
            if (response.status === 404) {
                this.createNewspilotArticle(newsItemArticle)
            } else {
                let articleId = response.headers.get("location");
                this.updateNewspilotArticle(articleId, newsItemArticle)
            }
        })
    }

    createNewspilotArticle(newsItemArticle) {
        this.makeRequest("POST", '/articles/exchanges', newsItemArticle, "json")
            .then(response => {
                if (!response.ok) {
                    api.ui.showNotification('se.infomaker.newspilot.notify', api.getLabel('failed_to_create'), 'Status:' + response.status);
                    this.extendState({errorMessage: 'Got error http code:' + response.status});
                    return
                }
                this.extendState({errorMessage: null});
                this.extendState({eventSent: NotifyComponent.formatDate(new Date())});
                this.extendState({updateAfterPost: true});
            }).catch((e) => {
                let error = 'Could not update article ' + e;
                console.error(error);
                this.extendState({errorMessage: error});
                api.ui.showNotification('se.infomaker.newspilot.notify', api.getLabel('failed_to_update'), 'Info:' + e);
            });
    }

    updateNewspilotArticle(articleId, newsItemArticle){
        this.makeRequest("PUT", '/articles/exchanges/' + articleId, newsItemArticle, "json")
            .then(response => {
                if (response.status < 200 || response.status > 299) {
                    api.ui.showNotification('se.infomaker.newspilot.notify', api.getLabel('failed_to_update'), 'Status:' + response.status);
                    this.extendState({errorMessage: 'Got error http code:' + response.status});
                    return
                }
                this.extendState({errorMessage: null});
                this.extendState({eventSent: NotifyComponent.formatDate(new Date())});
            }).catch((e) => {
                let error = 'Could not update article ' + e;
                console.error(error);
                this.extendState({errorMessage: error});
                api.ui.showNotification('se.infomaker.newspilot.notify', api.getLabel('failed_to_update'), 'Info:' + e);
            })
    }

    static formatDate(date) {
        return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    }

    getIntegrationService() {
        return api.getConfigValue(this.pluginId, 'integrationService')
    }

    getIntegrationServiceApiKey() {
        return api.getConfigValue(this.pluginId, 'integrationService-apikey')
    }


    /**
     *
     * @returns
     */
    getInitialState() {
        return {
            //  articleId: articleId ? articleId : 0,
            eventSent: null,
            errorMessage: null,
            updateAfterPost: false
        }
    }

    ping() {
        this.makeRequest("GET", "/ping", null, "json").then(() => {
        })
    }

    makeRequest(method, url, body, type) {

        const headers = new Headers();
        headers.append("Accept", "application/" + type);
        headers.append("x-api-key", this.getIntegrationServiceApiKey());

        let myInit;
        if (body) {
            headers.append("Content-Type", "application/xml");
            myInit = {
                method: method,
                headers: headers,
                cache: 'default',
                body: body
            };
        }
        else {
            myInit = {
                method: method,
                headers: headers,
                mode: 'cors',
                cache: 'default'
            };
        }

        let integrationService = this.getIntegrationService();

        return fetch(integrationService + url, myInit)
                .then(res => {
                    return res;
                });
    }
}

export default NotifyComponent