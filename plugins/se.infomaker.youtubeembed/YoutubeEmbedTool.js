import {Tool, FontAwesomeIcon} from 'substance'

class YoutubeEmbedTool extends Tool {

    render($$) {
        const el = $$('span')
        const youtubeIcon = $$(FontAwesomeIcon, {icon: 'fa-youtube'})
        youtubeIcon.on('click', () => {
            this.getCommandName()
            this.executeCommand()
        })


        el.append(youtubeIcon)

        return el
    }

}

export default YoutubeEmbedTool