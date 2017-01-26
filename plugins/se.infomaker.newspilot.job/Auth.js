export default class Auth {

    static isLoggedIn() {
        return window.sessionStorage.getItem("npCredentials") !== null
    }

    static login(user, password, checkUrl) {
        return new Promise((resolve, reject) => {
            storeCredentials(user, password)
            if (checkUrl) {
                fetch("checkUrl", {headers: getAuthHeader(this.getCredentials()), mode: 'no-cors'})
                    .then((response) => {
                        console.log('response', response)
                        resolve()
                    })
                    .catch((e) => {
                        reject(e)
                    })
            } else {
                resolve()
            }
        })
    }

    static getCredentials() {
        return JSON.parse(window.sessionStorage.getItem("npCredentials"));

    }
}

function getAuthHeader(authItem) {
    return new Headers().append('Authorization', `Basic ${btoa(authItem.user + ":" + authItem.password)}`)
}

function storeCredentials(user, password) {
    window.sessionStorage.setItem("npCredentials", JSON.stringify({user: user, password: password}))
}