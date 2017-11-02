import {Component} from 'substance'
import {moment} from 'writer'

class TimeLineComponent extends Component {

    getInitialState() {
        return {
            markers: this.props.markers,
            activeIndex: this.props.markers.length - 1
        }
    }

    render($$) {
        const el = $$('div').addClass('timeline-component')

        if (this.state.markers.length === 0) {
            el.append('No points in time found')
        }
        else {
            const timeline = $$('div').ref('timeline').setAttribute('id', 'timeline')

            el.append(timeline)

            //Draw the date circle
            timeline.append(
                this._renderCircles($$)
            )
        }

        return el
    }

    /**
     * @param $$
     * @return {VirtualElement}
     * @private
     */
    _renderCircles($$) {
        const dates = this.state.markers.map((marker) => marker.time)

        return dates.map((date, i) => {
            const relativeInt = i / (dates.length - 1);
            const circle = $$('div')
                .ref('circle' + i)
                .addClass("circle")
                .setAttribute('style', 'left: ' + relativeInt * 100 + '%;')
                .append(
                    $$('div')
                        .addClass("popupSpan")
                        .append(
                            this._renderDateSpan(dates[i], $$)
                        )
                )
                .on('click', () => {
                    if (i !== this.state.activeIndex) {
                        this.extendState({activeIndex: i})
                        if (this.props.pointInTime) {
                            this.props.pointInTime(this.state.markers[i])
                        }
                    }
                })

            if (this.props.markers.length > 1 && i === this.state.activeIndex) {
                circle.addClass('active')
            }

            return circle
        })
    }

    /**
     * @param date
     * @param $$
     * @private
     */
    _renderDateSpan(date, $$) {
        return $$('div')
            .append($$('div')
                .addClass('moment-date')
                .append(moment(date).format('YYYY-MM-DD')))
            .append($$('div')
                .addClass('moment-time')
                .append(moment(date).format('HH:mm:ss')))
    }
}

export default TimeLineComponent