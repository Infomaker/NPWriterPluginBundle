import Auth from "./Auth";

export default class NPFetcher {

    static getArticle(articleId) {
        return new Promise((resolve, reject) => {
            const url = `http://newspilot.dev.np.infomaker.io:8080/newspilot/rest/articles/${articleId}`
            const authHeader = Auth.getAuthHeader(Auth.getCredentials());

            fetch(url, {headers: authHeader, mode: 'no-cors'})
                .then((response) => {
                    console.log('response', response)
                    resolve(response)
                })
                .catch((e) => {
                    console.error('Failed to get url', url, e)
                    reject(e)
                })
        })
    }

}
