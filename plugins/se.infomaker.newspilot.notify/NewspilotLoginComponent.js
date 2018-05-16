import { Component } from "substance";
import { api } from "writer";
import { isNullOrUndefined } from "util";

const CREDENTIALS_KEY = 'npCredentials'

class NewspilotLoginComponent extends Component {
    execute() {
        return new Promise((resolve, reject) => {
            this.updateNewspilotLogin(resolve, reject)
        })
    }

    updateNewspilotLogin(resolve) {
        let credentials = NewspilotLoginComponent.getCredentials()
        if (!isNullOrUndefined(credentials)) {
            let newspilotUser = credentials.user //This is the logged in newspilot user if any.
            if (newspilotUser !== null) {
                api.newsItem.removeAllLinksByType(this.name, 'x-np/login')
                api.newsItem.addLink(this.name, {
                    '@rel': 'author',
                    '@type': 'x-np/login',
                    '@uri': 'np://login/'+newspilotUser
                });
            }
        }

        resolve();
    }

    static getCredentials() {
        return JSON.parse(window.sessionStorage.getItem(CREDENTIALS_KEY));
    }

}

export default NewspilotLoginComponent

