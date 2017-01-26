export default class NPArticle {

    constructor(articleId, user, password) {
        this.articleId = articleId
        this.user = user
        this.password = password
    }

    getArticle() {
        return new Promise((resolve, reject) => {
            console.log(this._getBasicAuthHeader())

            fetch(this._getArticleUrl(), {
                headers: this._getBasicAuthHeader(),
                credentials: 'include',
                mode: 'no-cors'
                //Accept: 'application/json'
            })
                .then((response) => {
                    console.log('response', response)
                    resolve(response)
                })
                .catch((e) => {
                    reject(e)
                })
        })
    }

    _getArticleUrl() {
        // TODO: get host from config
        return `http://newspilot.dev.np.infomaker.io:8080/newspilot/rest/articles/${this.articleId}`
    }

    _getBasicAuthHeader() {
        return new Headers().append('Authorization', `Basic ${btoa(this.user + ":" + this.password)}`)
    }

}
