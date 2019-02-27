import {Component} from 'substance'
import {api, event} from 'writer'

/**
 * @class IMIDPopoverComponent
 * @extends {Component}
 *
 * @property {Object} props
 * @property {Boolean} props.sticky - Whether the popover should close when user clicks outside
 * @property {Component} props.content - The content to render inside the popover
 */
class IMIDPopoverComponent extends Component {

    constructor(...args) {
        super(...args)
        if (this.props.sticky === true) {
            api.events.on(`__popover-${this.props.id}`, event.BROWSER_RESIZE, () => {
                this._recalculateOffsets()
            })
        }

        api.events.on(`__popover-${this.props.id}`, 'popover:close', () => {
            this.extendState({active: false})
        })

        // Save reference to bound function to be able to remove event listener
        this._onOutsideClick = this._onOutsideClick.bind(this)
    }

    dispose() {
        document.removeEventListener('click', this._onOutsideClick)
        super.dispose()
    }

    getInitialState() {
        return {
            enabled: true,
            active: false,
            triggerElement: null
        }
    }

    didMount() {
        document.addEventListener('click', this._onOutsideClick, false)
    }

    _onOutsideClick(e) {
        // Listen to clicks outside of the popover only so that we
        // can close non sticky popovers automatically
        if (!this.state.active || this.props.sticky === true) {
            return
        }

        // Only close if the click was outside of the parent element
        if (!this.parent.el.el.contains(e.target)) {
            this.extendState({active: false})
        }
    }

    open() {
        if (this.state.active === false) {
            let triggerElement = this.refs['popover-root'].el.el
            this.extendState({
                offsetLeft: triggerElement.offsetLeft,
                offsetWidth: triggerElement.offsetWidth,
                active: true
            })

            // Opening one popover closes others, even the sticky ones, so
            // send an internal close event to all other popovers
            this.context.api.events.trigger(`__popover-${this.props.id}`, 'popover:close')
        }
    }

    close() {
        if (this.state.active === true) {
            this.extendState({active: false})
        }
    }

    toggle() {
        if (this.state.active === true) {
            this.close()
        }
        else {
            this.open()
        }
    }

    _onLayoutChange(newValue, oldValue) {
        if (newValue === oldValue) {
            return
        }

        // Send browser resize event to enforce position recalculations
        // for all active (visible) popovers
        this.context.api.events.trigger('__popover', Event.BROWSER_RESIZE)
    }

    _positionPopover(offset) {
        let popover = this.el.el.querySelector('div.sc-np-popover'),
            arrow = this.el.el.querySelector('div.sc-np-popover-arrow')

        popover.style.left = offset.box + 'px'
        arrow.style.marginLeft = offset.arrow + 'px'
    }

    /*
     * Calculate offsets for popover box (left) and it's arrow (margin)
     */
    _getOffsets(offsetLeft, offsetWidth) {
        if (!offsetLeft) {
            offsetLeft = this.state.offsetLeft
        }

        if (!offsetWidth) {
            offsetWidth = this.state.offsetWidth
        }

        let popoverEl = this.refs['popover'].el,
            left = offsetLeft - (popoverEl.width / 2) + offsetWidth / 2,
            margin = 0

        if (left < 10) {
            margin = left - 10
            left = 10
        }
        else if (left + popoverEl.width > document.body.clientWidth) {
            let oldLeft = left
            left = document.body.clientWidth - popoverEl.width - 10
            margin = oldLeft - left
        }

        return {
            box: left,
            arrow: margin
        }
    }

    _recalculateOffsets() {
        if (this.state.active) {
            let triggerElement = this.refs['popover-root'].el.el

            this._positionPopover(
                this._getOffsets(triggerElement.offsetLeft, triggerElement.offsetWidth)
            )
        }
    }

    render($$) {
        return $$('div', {class: 'popover-component'},
            this._renderPopoverContent($$)
        ).ref('popover-root')
    }

    _renderPopoverContent($$) {
        let classNames = 'sc-np-popover'

        if (this.state.active === true) {
            classNames += ' active'
            window.setTimeout(() => {
                this._positionPopover(this._getOffsets())
            }, 5)
        }

        return $$('div', {class: classNames, style: 'left: -99999px;'}, [
            $$('div', {class: 'sc-np-popover-arrow'}).ref('popover-top'),
            this.props.content
        ]).ref('popover')
    }
}

export {IMIDPopoverComponent}
