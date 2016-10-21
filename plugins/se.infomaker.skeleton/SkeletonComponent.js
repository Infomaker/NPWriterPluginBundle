const {Component} = substance
// const {api} = writer

class SkeletonComponent extends Component {

    /**
     * Method called when component is disposed and removed from DOM
     */
    dispose() {
        // Perfect place to remove eventlisteners etc
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


    /**
     * Render method is called whenever there's a change in state or props
     * @param $$
     * @returns {*}
     */
    render($$) {
        const el = $$('div')
        el.append($$('span').append('Skeleton plugin loaded...'))

        return el
    }
}
export default SkeletonComponent