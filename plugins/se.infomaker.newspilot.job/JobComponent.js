import {Component} from "substance";
import JobImagesListComponent from "./JobImagesListComponent";
import NPGateway from "./NPGateway";
import NPArticle from "./NPArticle"
import Auth from "./Auth";


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
        this.extendState({jobImages: data})
    }

    dispose() {
        if (this.gateway) {
            this.gateway.disconnect()
        }
    }

    initGateway() {
        let {user, password} = Auth.getCredentials()

        const article = new NPArticle(21963, user, password)

        article.getArticle()
            .then((response) => {
                this.gateway = new NPGateway(
                    "newspilot.dev.np.infomaker.io", user, password, response.jobId, this.updateModel.bind(this)
                )
            })
            .catch((e) => {
                console.error(e)
            })
    }

    render($$) {

        const el = $$('div').addClass('npjob')

        if (!Auth.isLoggedIn()) {
            // TODO Show login component
            // el.append($$(LoginComponent))
            // return el;

            Auth.login("infomaker", "newspilot")
                .then(() => {
                    this.initGateway()
                    this.rerender()
                })
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