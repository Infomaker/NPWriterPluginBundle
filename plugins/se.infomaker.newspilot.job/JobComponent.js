import {Component} from "substance";
import JobImagesListComponent from "./JobImagesListComponent";
import NPGateway from "./NPGateway";
import Auth from "./Auth";
import LoginComponent from "./LoginComponent";


class JobComponent extends Component {

    constructor(...args) {
        super(...args)

        if (Auth.isLoggedIn()) {
            this.initGateway()
        }

        this.handleActions({
            'login:success': this.initGateway,
        });
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
        this.extendState({jobImages: data})
    }

    dispose() {
        if (this.gateway) {
            this.gateway.disconnect()
        }
    }

    initGateway() {

        let {user, password} = Auth.getCredentials()

        this.gateway = new NPGateway("newspilot.dev.np.infomaker.io", user, password, 13993, this.updateModel.bind(this))

        this.rerender()
    }

    render($$) {

        const el = $$('div').addClass('npjob')

        if (!Auth.isLoggedIn()) {
            el.append($$(LoginComponent, {server: "http://newspilot.dev.np.infomaker.io:8080/newspilot/rest"}))
            return el;

        }

        const imageList = $$(JobImagesListComponent, {
            jobImages: this.state.jobImages
        }).ref('imageList')

        el.append($$('h2').append(this.getLabel('Images')))
        el.append(imageList)

        el.append($$('button')
            .on('click', () => {
                Auth.logout()
                this.rerender()
            })
            .append('Logout'))

        return el;
    }
}

export default JobComponent