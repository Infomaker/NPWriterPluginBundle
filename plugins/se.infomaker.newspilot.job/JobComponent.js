import {Component} from "substance";
import JobImagesListComponent from "./JobImagesListComponent";
import NPGateway from "./NPGateway"
import LoginComponent from "./LoginComponent"
import Auth from "./Auth"


class JobComponent extends Component {

    constructor(...args) {
        super(...args)

        if (Auth.isLoggedIn()) {
            this.initGateway()
        }
    }

    getInitialState() {
        return {
            // TODO
            jobImages: []
        }
    }

    _onDragStart(e) {
        e.stopPropagation()
    }

    updateModel(data) {
        this.extendState({jobImages:data})
    }

    dispose() {
        if (this.gateway) {
            this.gateway.disconnect()
        }
    }

    initGateway() {

        let {user, password} = Auth.getCredentials()

        this.gateway = new NPGateway("newspilot.dev.np.infomaker.io", user, password, 13993, this.updateModel.bind(this))
    }

    render($$) {

        const el = $$('div').addClass('npjob')

        if (!Auth.isLoggedIn()) {
            el.append($$(LoginComponent))
            return el;
        }

        const imageList = $$(JobImagesListComponent, {
            jobImages: this.state.jobImages
        }).ref('imageList')

        el.append($$('h2').append(this.getLabel('Images')))
        el.append(imageList)

        return el;
    }
}

export default JobComponent