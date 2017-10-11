import Auth from "./Auth";

function getNewspilotRestUrl(newspilotServer, articleId, externalSystemId) {
    return `${newspilotServer}/newspilot/rest/articles/externalId/${articleId}?externalSystemId=${externalSystemId}`
}

function getOldNewspilotRestUrl(newspilotServer, articleId) {
    return `${newspilotServer}/newspilot/rest/articles/${articleId}`
}

export default class NPFetcher {

    static getArticle(newspilotHostName, articleId, externalSystemId) {
        return new Promise((resolve, reject) => {
            const newspilotServer = NPFetcher.getNewspilotServer(newspilotHostName)

            let url
            if (externalSystemId) {
                url = getNewspilotRestUrl(newspilotServer, articleId, externalSystemId)
            } else {
                url = getOldNewspilotRestUrl(newspilotServer, articleId)
            }

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("HEAD", url, true); // Make async HEAD request (must be a relative path to avoid cross-domain restrictions)
            xmlhttp.onreadystatechange=function() {
                if (XMLHttpRequest.DONE) { // make sure the request is complete
                    if (xmlhttp.status === 200) {
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
                    } else {
                        reject({status: xmlhttp.status})
                    }
                }
            }

            xmlhttp.setRequestHeader('Authorization', Auth.getAuthHeaderValue());

            xmlhttp.send(null); // send request

        })
    }

    static getNewspilotServer(hostName) {
        return 'https://' + hostName + ':8443'
    }

}
