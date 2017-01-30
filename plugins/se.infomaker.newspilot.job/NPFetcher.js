import Auth from "./Auth";

function getNewspilotRestUrl(newspilotServer, articleId) {
    return `${newspilotServer}/newspilot/rest/articles/${articleId}`
}

export default class NPFetcher {

    static getArticle(newspilotServer, articleId) {
        return new Promise((resolve, reject) => {
            const url = getNewspilotRestUrl(newspilotServer, articleId)
            const headers = Auth.getAuthHeader(Auth.getCredentials());

            headers.append('Accept', 'application/json')

            fetch(url, {headers: headers, mode: 'cors'})
                .then((response) => {
                    console.log('response', response)
                    return response.json()
                })
                .then((jsonResponse) => {
                    console.log(jsonResponse)
                    resolve(jsonResponse)
                })
                .catch((e) => {
                    console.error('Failed to get url', url, e)
                    reject(e)
                })
        })
    }

}
