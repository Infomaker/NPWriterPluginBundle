import {Component} from 'substance'

class IMIDUnlockAlert extends Component {
    render($$) {
        return $$('div', {class: 'popover-content unlock-alert'}, [
            $$('div', {class: 'content'}, [
                $$('h2', {class: 'heading'},
                    this.getLabel('imidtracker-unlock-article-title')
                ),
                $$('p', {class: 'message'},
                    this.getLabel('imidtracker-unlock-article-message')
                )
            ]),
            $$('div', {class: 'footer'}, [
                $$('button', {class: 'btn cancel'},
                    this.getLabel('cancel')
                ).on('click', () => {
                    this.props.onCancel()
                }),
                $$('button', {class: 'btn unlock'},
                    this.getLabel('unlock')
                ).on('click', () => {
                    this.props.onUnlock()
                })
            ])
        ])
    }
}

export {IMIDUnlockAlert}
