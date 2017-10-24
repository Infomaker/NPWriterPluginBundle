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
        this.updateSelectedCircle()
    }

    updateSelectedCircle() {
        if (this.props.markers.length > 1) {
            this.refs[(`circle` + this.state.activeIndex)].addClass('active')
        }
    }

    render($$) {
        const el = $$('div').addClass('timeline-component')

        if (this.state.markers.length === 0) {
            el.append('No points in time found')
        }
        else if (this.state.markers.length === 1) {
            el.append(
                $$('span').ref('date').append(formatDate(this.state.markers[0].date))
            )

        }
        else {
            const timeline = $$('div').ref('timeline').setAttribute('id', 'timeline')
            const date = $$('span').ref('date').setAttribute('id', 'date').append('-')

            el.append(
                [
                    timeline,
                    date
                ]
            )
            this.makeCircles($$, timeline, date)
        }


        return el
    }


    makeCircles($$, timeline, date) {
        const dates = this.state.markers.map((marker) => marker.time)
        //Set day, month and year variables for the math
        const first = moment(dates[0]).valueOf();
        const last = moment(dates[dates.length - 1]).valueOf();

        const lastInt = last - first


        //Integer representation of the last day. The first day is represnted as 0
        // var lastInt = ((lastMonth - firstMonth) * 30) + (lastDay - firstDay);

        //Draw first date circle
        // timeline.append(
        //     $$('div')
        //         .ref('circle0')
        //         .addClass('circle')
        //         .setAttribute('style', "left: 0%;")
        //         .append(
        //             $$('div')
        //                 .addClass("popupSpan")
        //                 .append(
        //                     dateSpan(dates[0], $$)
        //                 )
        //         )
        //         .on('click', () => {
        //             if (i !== this.state.activeIndex) {
        //                 this.extendState({activeIndex: i})
        //                 this.updateSelectedCircle()
        //             }
        //         })
        // )

        //Loop through middle dates
        for (let i = 0; i < dates.length; i++) {
            //Integer representation of the date
            const thisInt = moment(dates[i]).valueOf() - first;

            //Integer relative to the first and last dates
            const relativeInt = thisInt / lastInt;

            //Draw the date circle
            timeline.append(
                $$('div')
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
                            this.updateSelectedCircle()
                        }
                    })
            )
        }
        //Draw the last date circle
        // timeline.append($$('div')
        //     .ref('circle' + (dates.length - 1))
        //     .addClass('circle')
        //     .setAttribute('id', 'circle' + (dates.length - 1))
        //     .setAttribute('style', 'left: 99%;')
        //     .append(
        //         $$('div')
        //             .addClass("popupSpan")
        //             .append(
        //                 dateSpan(dates[dates.length - 1], $$)
        //             )
        //     )
        // )
    }

}

function

dateSpan(date, $$) {
    return $$('div')
        .append($$('div')
            .addClass('moment-date')
            .append(moment(date).format('YYYY-MM-DD')))
        .append($$('div')
            .addClass('moment-time')
            .append(moment(date).format('HH:mm:ss')))
}

export default TimeLineComponent