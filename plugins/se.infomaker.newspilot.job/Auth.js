const CREDENTIALS_KEY = 'npCredentials'


function storeCredentials(user, password) {
    window.sessionStorage.setItem(CREDENTIALS_KEY, JSON.stringify({user: user, password: password}))
}


export default class Auth {

    static isLoggedIn() {
        return window.sessionStorage.getItem(CREDENTIALS_KEY) !== null
    }

    static login(user, password, checkUrl) {
        return new Promise((resolve, reject) => {
            storeCredentials(user, password)
            if (checkUrl) {
                let authHeader = Auth.getAuthHeader();
                console.log(authHeader.get('Authorization'))
                fetch(checkUrl, {headers: authHeader, mode: 'cors'})
                    .then((response) => {
                        console.log('response', response)

                        if (response.status !== 200) {
                            this.logout()
                            return reject(new Error(response.statusText))
                        }
                        return resolve()
                    })
                    .catch((e) => {
                        this.logout()
                        console.log('reject response', e)
                        return reject(e)
                    })
            } else {
                return resolve()
            }
        })
    }

    static getCredentials() {
        return JSON.parse(window.sessionStorage.getItem(CREDENTIALS_KEY));

    }

    static getAuthHeader() {
        const headers = new Headers();
        const authItem = Auth.getCredentials()
        headers.append('Authorization', `Basic ${btoa(authItem.user + ":" + authItem.password)}`)
        return headers
    }


    static logout() {
        window.sessionStorage.removeItem(CREDENTIALS_KEY)
    }

}

