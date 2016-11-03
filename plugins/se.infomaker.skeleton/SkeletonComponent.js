import {Component} from 'substance'
import {api} from 'writer'

class Test extends Component {

    didMount() {

    }

    render($$) {
        return $$('div').css('padding', '1rem 2rem').css('height', '200px').append("HELLO WORLD")
    }

    onClose(action) {
        console.log("Close");
        return true
    }
}

class SkeletonComponent extends Component {

    /**
     * Method called when component is disposed and removed from DOM
     */
    dispose() {
        // Perfect place to remove eventlisteners etc
        console.log("Dispose");
    }

    /**
     * Constructor
     * @param args
     */
    constructor(...args) {
        super(...args)
    }


    /**
     *
     * @returns {{clickCount: number}}
     */
    getInitialState() {
        return {
            clickCount: 0
        }
    }

    didMount() {

    }


    /**
     * Render method is called whenever there's a change in state or props
     * @param $$
     * @returns {*}
     */
    render($$) {
        let el = $$('div')

        el.append($$('h2').append(this.getLabel('skeleton-title')))
        el.append($$('p').append(String(this.state.clickCount)))

        let clickCount = this.state.clickCount

        let button = $$('button').on('click', () => {
            this.setState({
                clickCount: clickCount+1
            })
        }).append('Click me')

        const third = [{
            caption: "Third",
            callback: () => {
                console.log("called")
                return true;
            }
        }]

        let openDialog = $$('button').on('click', () => {

            const messages = [
                {
                    type: "info",
                    message: "Hello info message"
                },
                {
                    type: "warning",
                    message: "Hello warning message"
                }
            ]

            // api.ui.showMessageDialog(messages, () => {}, () => {})
            api.ui.showDialog(Test, {}, {primary:"Go", secondary: "Cancel", tertiary: third})
        }).append('Open dialog')

        el.append(button)
        el.append(openDialog)

        return el
    }
}
export default SkeletonComponent