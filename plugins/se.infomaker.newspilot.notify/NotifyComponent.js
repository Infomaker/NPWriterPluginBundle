import {Component} from "substance";
import {api} from "writer";
import { isNullOrUndefined } from "util";

class NotifyComponent extends Component {

    execute() {
        return new Promise((resolve, reject) => {
            this.publishArticle(resolve, reject)
        })
    }

    /**
     * Constructor
     * @param args
     */
    constructor(...args) {
        super(...args);
        this.pluginId = 'se.infomaker.newspilot.notify';
        this.filter = this.getFilter()
    }

    publishArticle(resolve, reject) {
        if (this.state.updateAfterPost) {
            this.extendState({updateAfterPost: false});
            return resolve()
        }
        let newsItemArticle = api.editorSession.saveHandler.getExportedDocument();

        if (!this.articlePassesFilter(this.filter)) {
            return resolve()
        }

        let newsItemArticleId = api.newsItem.getGuid()

        this.makeRequest("GET", '/articles/exchanges/external/' + newsItemArticleId, null, "xml").then(response => {
            if (response.status === 404) {
                this.createNewspilotArticle(newsItemArticle)
            } else {
                let articleId = response.headers.get("location");
                if (articleId) {
                    this.updateNewspilotArticle(articleId, newsItemArticle)
                }
            }

            return resolve()
        }).catch(e => {
            reject(e)
        })
    }

    articlePassesFilter(filter) {        
        if (filter === undefined) {
            return true
        }
        
        const filterQuery = filter.query
        const filterType = filter.type
        const filterValue = filter.value

        const queryResult = api.newsItemArticle.evaluate(filterQuery, api.newsItemArticle, 
            function(prefix) { 
                if (prefix === 'ils') { 
                    return 'http://www.infomaker.se/lookupservice'; 
                } else {
                    return "http://iptc.org/std/nar/2006-10-01/"; 
                }
            },
            XPathResult.ANY_TYPE,null);
        
        const result = queryResult.iterateNext() 
        if (result !== null) {
            if (filterType === undefined || filterType === "EXISTS"){                
                return true
            }else if (filterType === "EQUALS") {                                
                const value = result.value
                if (value.trim() === filterValue) {                    
                    return true
                }            
            }else if (filterType === "NOT_EQUALS") {                            
                const value = result.value
                if (value.trim() !== filterValue) {                
                    return true
                }
            }else if (filterType === "DATE_OLDER_THAN" || filterType === "DATE_YOUNGER_THAN") {                                
                const value = result.value
                const queryDate = new Date(value);
                               
                if (this.dateIsValid(queryDate)) {
                    let targetDate = new Date()
                    targetDate.setDate(targetDate.getDate()-filterValue)                    
                    return filterType === "DATE_OLDER_THAN" ? queryDate.getTime() < targetDate.getTime() : queryDate.getTime() > targetDate.getTime()
                }                
            }
        }else if (filterType === "NOT_EQUALS" || filterType === "NOT_EXISTS") {
            return true
        }
        return false
    }

    dateIsValid(date) {
        return !date.isNullOrUndefined && date.getTime() === date.getTime()
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

    getFilter() {
        return api.getConfigValue(this.pluginId, 'filter')
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
                cache: 'default'
            };
        }

        let integrationService = this.getIntegrationService();

        return fetch(integrationService + url, myInit)
                .then(res => {
                    return res;
                })
    }
}

export default NotifyComponent
