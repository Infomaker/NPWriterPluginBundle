import Auth from "./Auth";

function getNewspilotRestUrl(newspilotServer, articleId, externalSystemId) {
    return `${newspilotServer}/newspilot/rest/articles/externalId/${articleId}?externalSystemId=${externalSystemId}`
}

export default class NPFetcher {

    static getArticle(newspilotHostName, articleId, externalSystemId) {
        return new Promise((resolve, reject) => {
            const newspilotServer = NPFetcher.getNewspilotServer(newspilotHostName)
            const url = getNewspilotRestUrl(newspilotServer, articleId, externalSystemId)

            const headers = Auth.getAuthHeader(Auth.getCredentials());
            headers.append('Accept', 'application/json')

            fetch(url, {headers: headers, mode: 'cors'})
                .then((response) => {
                    return response.json()
                })
                .then((jsonResponse) => {
                    resolve(jsonResponse)
                })
                .catch((e) => {
                    console.error('Failed to get url', url, e)
                    reject(e)
                })
        })
    }

    static getNewspilotServer(hostName) {
        return 'https://' + hostName + ':8443'
    }

}
