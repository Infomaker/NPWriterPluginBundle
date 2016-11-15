import {Tool, FontAwesomeIcon} from 'substance'

class YoutubeEmbedTool extends Tool {

    render($$) {
        const el = $$('div')
        const youtubeIcon = $$(FontAwesomeIcon, {icon: 'fa-youtube'})
        youtubeIcon.on('click', () => {
            this.getCommandName()
            this.executeCommand()
        })

        const btn = $$('button').addClass('se-tool')
        btn.append(youtubeIcon)

        el.append(btn)

        return el
    }

}

export default YoutubeEmbedTool