import {Component} from "substance"
import {api} from "writer"

class GenderComponent extends Component {

    constructor(...args) {
        super(...args)
        this.setupConfig()
    }

    /**
     * Setup config for plugin
     */
    setupConfig() {
        this.pluginName = 'gender'
        this.linkType = 'x-im/' + this.pluginName.toLocaleLowerCase()
        this.linkRel = this.pluginName.toLocaleLowerCase()
        this.linkUri = 'im://' + this.pluginName.toLocaleLowerCase() + '/'
        this.options = {
            'female': {
                id: 'female',
                title: 'Female',
                label: 'K',
                icon: 'fa-venus',
            },
            'male': {
                id: 'male',
                title: 'Male',
                label: 'M',
                icon: 'fa-mars',
            },
            'neutral': {
                id: 'neutral',
                title: 'Neutral',
                label: 'N',
                icon: 'fa-genderless',
            }
        }
    }

    /**
     * Initial state
     *
     * @returns {{gender: string}}
     */
    getInitialState() {
        this.setupConfig()

        const existingGender = api.newsItem.getContentMetaLinkByType(this.pluginName, this.linkType)

        return {
            gender: (existingGender && existingGender.length > 0) ? this.options[existingGender[0]["@uri"].split('/').pop()].id : ''
        }
    }

    /**
     * Render options
     *
     * @param $$
     * @returns {*}
     */
    renderOptions($$) {
        const btnGroup = $$('div').addClass('btn-group btn-group-' + this.pluginName),
            width = Math.floor(100 / Object.keys(this.options).length)

        Object.keys(this.options).forEach((option) => {

            const props = this.options[option],
                btn = $$('button')
                    .addClass('btn btn-secondary')
                    .attr('style', 'width: ' + width + '%;')
                    .on('click', () => {
                        this.saveMeta(props)
                    }),
                icon = $$('i')
                    .addClass('fa ' + props.icon)
                    .addClass('im-spaced-right')

            btn.append(icon)

            if (this.state['gender'] === props.id) {
                btn.addClass('active')
            }

            // Add btn label
            btn.append(props.label)

            btnGroup.append(btn)
        });

        return btnGroup
    }

    /**
     * Save meta for options
     *
     * @param gender
     */
    saveMeta(gender) {

        const link = {
                '@title': gender.title,
                '@uri': this.linkUri + gender.id,
                '@rel': this.linkRel,
                '@type': this.linkType
            },
            existingLinks = api.newsItem.getContentMetaLinkByType(this.pluginName, this.linkType)

        // Remove existing
        if (existingLinks && existingLinks.length > 0) {
            api.newsItem.removeLinkContentMetaByTypeAndRel(this.pluginName, this.linkType, this.linkRel)
        }

        // Add new value
        api.newsItem.addContentMetaLink(this.pluginName, link)

        this.extendState({
            [this.pluginName]: gender.id
        })
    }

    /**
     * Render plugin
     *
     * @param $$
     * @returns {*}
     */
    render($$) {
        const el = $$('div').addClass('im-' + this.pluginName),
            label = $$('h2').append(this.getLabel('gender-label')),
            btns = this.renderOptions($$)

        el.append(label)
            .append(btns)

        return el
    }
}

export default GenderComponent