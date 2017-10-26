import {Component} from 'substance'
import {moment} from 'writer'


function formatDate(date) {
    return date
}

class TimeLineComponent extends Component {

    getInitialState() {
        return {
            markers: this.props.markers,
            activeIndex: this.props.markers.length - 1
        }
    }

    didMount() {
    }

    render($$) {
        const el = $$('div').addClass('timeline-component')

        if (this.state.markers.length === 0) {
            el.append('No points in time found')
        }
        else {
            const timeline = $$('div').ref('timeline').setAttribute('id', 'timeline')

            el.append(timeline)
            this.makeCircles($$, timeline)
        }


        return el
    }


    makeCircles($$, timeline) {
        const dates = this.state.markers.map((marker) => marker.time)
        //Set day, month and year variables for the math
        const first = moment(dates[0]).valueOf();
        const last = moment(dates[dates.length - 1]).valueOf();

        const lastInt = last - first

        for (let i = 0; i < dates.length; i++) {
            //Integer representation of the date
            const thisInt = moment(dates[i]).valueOf() - first;

            //Integer relative to the first and last dates
            const relativeInt = i / (dates.length - 1);

            const circle = $$('div')
                .ref('circle' + i)
                .addClass("circle")
                .setAttribute('style', 'left: ' + relativeInt * 100 + '%;')
                .append(
                    $$('div')
                        .addClass("popupSpan")
                        .append(
                            dateSpan(dates[i], $$)
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


            //Draw the date circle
            timeline.append(
                circle
            )
        }
    }

}

function dateSpan(date, $$) {
    return $$('div')
        .append($$('div')
            .addClass('moment-date')
            .append(moment(date).format('YYYY-MM-DD')))
        .append($$('div')
            .addClass('moment-time')
            .append(moment(date).format('HH:mm:ss')))
}

export default TimeLineComponent