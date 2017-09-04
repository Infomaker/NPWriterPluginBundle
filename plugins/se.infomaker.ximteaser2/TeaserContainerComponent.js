import {Component} from 'substance'
import TeaserContainerMenu from './TeaserContainerMenu'

class TeaserContainerComponent extends Component {

    render($$) {
        console.log(this.props.node)

        const el = $$('div')

        el.append($$(TeaserContainerMenu, {node: this.props.node}))
        return el
    }

}

export default TeaserContainerComponent