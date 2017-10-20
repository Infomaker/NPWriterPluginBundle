import {Component} from 'substance'
import {moment} from 'writer'


function formatDate(date) {
    return date
}

class TimeLineComponent extends Component {

    getInitialState() {
        return {
            markers: this.props.markers,

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
        const first = dates[0];
        const last = dates[dates.length - 1];

        const lastInt = moment(last).valueOf() - moment(first).valueOf()


        //Integer representation of the last day. The first day is represnted as 0
        // var lastInt = ((lastMonth - firstMonth) * 30) + (lastDay - firstDay);

        //Draw first date circle
        timeline.append(
            $$('div')
                .addClass('circle')
                .setAttribute('id', 'circle0')
                .setAttribute('style', "left: ' + 0 + '%;")
                .append(
                    $$('div')
                        .addClass("popupSpan")
                        .append(
                            dateSpan(dates[0])
                        )
                )
        )

        //Loop through middle dates
        for (let i = 1; i < dates.length - 1; i++) {
            //Integer representation of the date
            const thisInt = moment(dates[0]).valueOf();

            //Integer relative to the first and last dates
            const relativeInt = thisInt / lastInt;

            //Draw the date circle
            timeline.append(
                $$('div')
                    .addClass("circle")
                    .setAttribute('circle' + i)
                    .setAttribute('style', 'left: ' + relativeInt * 100 + '%;')
                    .append(
                        $$('div')
                            .addClass("popupSpan")
                            .append(dateSpan(dates[i]))
                    )
            )
        }
        //Draw the last date circle
//             $("#line").append('<div class="circle" id="circle' + i + '" style="left: ' + 99 + '%;"><div class="popupSpan">' + dateSpan(
        //     dates[dates.length - 1]) + '</div></div>');

    }

//                    $(".circle:first").addClass("active");
}

//                makeCircles();

// $(".circle").mouseenter(function () {
//     $(this).addClass("hover");
// });
//
// $(".circle").mouseleave(function () {
//     $(this).removeClass("hover");
// });
//
// $(".circle").click(function () {
//     var spanNum = $(this).attr("id");
//     selectDate(spanNum);
// });

// function selectDate(selector) {
//     $selector = "#" + selector;
//     $spanSelector = $selector.replace("circle", "span");
//     var current = $selector.replace("circle", "");
//
//     $(".active").removeClass("active");
//     $($selector).addClass("active");
//
//     if ($($spanSelector).hasClass("right")) {
//         $(".center").removeClass("center").addClass("left")
//         $($spanSelector).addClass("center");
//         $($spanSelector).removeClass("right")
//     } else if ($($spanSelector).hasClass("left")) {
//         $(".center").removeClass("center").addClass("right");
//         $($spanSelector).addClass("center");
//         $($spanSelector).removeClass("left");
//     }
//     ;
// };
// }
// */
// // --
//
// }
// }

function

dateSpan(date) {
    return moment(date).format('YYYY-MM-dd')
}

export default TimeLineComponent