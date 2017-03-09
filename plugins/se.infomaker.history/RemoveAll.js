import {Component} from 'substance'

class RemoveAll extends Component {

    getInitialState() {
        return {
            confirmInProgress: false
        }
    }


    render($$) {

        let label = this.getLabel('history-remove-all-button')
        let clickAction = this.confirmRemove
        if(this.state.confirmInProgress) {
            label = this.getLabel('history-remove-all-confirm')
            clickAction = this.props.removeAll
        }

        return $$('button')
            .ref('remove-button')
            .addClass('history-version-item red')
            .append($$('i').addClass('fa fa-times').attr('title', this.getLabel('Remove')))
            .append($$('div').append(label))
            .on('click', clickAction)
            .on('blur', () => {
                this.extendState({
                    confirmInProgress: false
                })
            })
    }

    confirmRemove() {
        this.extendState({
            confirmInProgress: true
        })
    }
}
export default RemoveAll