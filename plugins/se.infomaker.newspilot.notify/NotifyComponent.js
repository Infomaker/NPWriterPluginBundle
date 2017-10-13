import {Component} from "substance";
import {api} from "writer";

// const FIRST_MOUNT_KEY = 'firstMount';

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

        const articleId = this.getArticleId();

        if (articleId > 0) {
            this.makeRequest("PUT", '/articles/exchanges/' + articleId, newsItemArticle)
                .then(response => {
                    if (response.status < 200 || response.status > 299) {
                        api.ui.showNotification('se.infomaker.newspilot.notify', api.getLabel('failed_to_update'), 'Status:' + response.status);
                        if (response.status === 401) {
                            //TODO
                        }
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
        else {
            this.makeRequest("POST", '/articles/exchanges', newsItemArticle)
                .then(response => {
                    if (!response.ok) {
                        api.ui.showNotification('se.infomaker.newspilot.notify', api.getLabel('failed_to_create'), 'Status:' + response.status);
                        if (response.status === 401) {

                        }
                        this.extendState({errorMessage: 'Got error http code:' + response.status});
                        return
                    }
                    this.extendState({errorMessage: null});
                    let url = response.headers.get("location");
                    let newArticleId = url.substr(url.lastIndexOf("/") + 1);
                    this.setArticleId(newArticleId);
                    this.extendState({eventSent: NotifyComponent.formatDate(new Date())});
                    this.extendState({updateAfterPost: true});
                    api.newsItem.save();
                }).catch((e) => {
                    let error = 'Could not update article ' + e;
                    console.error(error);
                    this.extendState({errorMessage: error});
                    api.ui.showNotification('se.infomaker.newspilot.notify', api.getLabel('failed_to_update'), 'Info:' + e);
                });
        }
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


    getArticleId() {
        const articleId = api.newsItem.getNewspilotArticleId();
        return articleId ? articleId : 0;
    }

    setArticleId(articleId) {
        let articleIdNode = api.newsItem._getItemMetaExtPropertyByType('npext:articleid');
        if (!articleIdNode) {
            let itemMetaNode = api.newsItemArticle.querySelector('itemMeta');
            articleIdNode = api.newsItemArticle.createElement('itemMetaExtProperty');
            articleIdNode.setAttribute('type', 'npext:articleid');
            itemMetaNode.appendChild(articleIdNode)
        }

        articleIdNode.setAttribute('value', articleId)
    }

    getNewspilotArticleId() {
        let articleIdNode = this._getItemMetaExtPropertyByType('npext:articleid');

        if (articleIdNode) {
            return articleIdNode.getAttribute('value')
        }

        return null;
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
        this.makeRequest("GET", "/ping", null).then(() => {
        })
    }

    makeRequest(method, url, body) {

        const headers = new Headers();
        headers.append("Accept", "application/json");
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
                if (res.ok) {
                    return res;
                }
                throw new Error('Network response was not ok.');
            });
    }
}

export default NotifyComponent