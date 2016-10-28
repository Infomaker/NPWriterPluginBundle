const {Component} = substance
const {api, moment, idGenerator} = writer

const pluginId = 'se.infomaker.newspriority'

// var idGen = require('writer/utils/IdGenerator');
// var isObject = require('lodash/isObject');

class NewsPriorityComponent extends Component {

    constructor(...args) {
        super(...args)

        api.events.on('newspriority', 'data:duplicated', () => {
            api.clearNewsPriority('newspriority');
            this.rerender();
        });
    }

    getInitialState() {

        this.scores = api.getConfigValue(pluginId, 'scores');
        this.lifetimes = api.getConfigValue(pluginId, 'lifetimes');
        this.durationKey = api.getConfigValue(pluginId, 'durationKey');
        this.defaultScoreIndex = api.getConfigValue(pluginId, 'defaultScoresIndex');
        this.defaultLifetimeIndex = api.getConfigValue(pluginId, 'defaultLifetimesIndex');

        var newsValue = {
            score: this.scores[this.defaultScoreIndex].value,
            description: this.lifetimes[this.defaultLifetimeIndex].label,
            format: 'lifetimecode'
        };

        newsValue[this.durationKey] = this.lifetimes[this.defaultLifetimeIndex].value;
        return newsValue;
    }

    updateState() {
        var newsPriority = api.newsItem.getNewsPriority(pluginId);

        if (!newsPriority) {
            // No news prio found in document, create a default template
            var template = {
                '@id': idGenerator(),
                '@type': "x-im/newsvalue",
                data: {
                    description: this.lifetimes[this.defaultLifetimeIndex].label,
                    end: "",
                    format: "lifetimecode",
                    score: this.scores[this.defaultScoreIndex].value
                }
            };

            template.data[this.durationKey] = this.lifetimes[this.defaultLifetimeIndex].value;

            api.newsItem.setNewsPriority('newspriority', template);
            newsPriority = api.newsItem.getNewsPriority(pluginId);

            // For some reason when transforming an empty string in API it returns an empty object{}
            if (typeof newsPriority.data[this.durationKey] === 'object') {
                newsPriority.data[this.durationKey] = template.data[this.durationKey];
            }

        } else {
            if (newsPriority.data.end && !this.extendedState) {
                this.extendedState = {end: newsPriority.data.end};
            }
        }

        if (newsPriority.data.score === this.state.score) {
            return;
        }

        var newState = {
            score: newsPriority.data.score,
            description: newsPriority.data.description,
            format: newsPriority.data.format,
            end: newsPriority.data.end
        };
        newState[this.durationKey] = newsPriority.data[this.durationKey];
        this.setState(newState);
    }

    render($$) {

        this.updateState();

        var el = $$('div');

        var prioTitle = $$('h2').text(this.getLabel('newsvalue'));
        el.append(prioTitle);
        el.append(this._renderPriority($$));

        var lifetimeTitle = $$('h2').text(this.getLabel('Lifetime'));
        el.append(lifetimeTitle);
        if (this.lifetimes.length > 1) {
            el.append(this._renderLifeTime($$));
        }

        el.append(this._renderDatetimeInput($$).ref('datePickerComponent'));

        return el;

    }

    _renderPriority($$) {
        var prio = $$('div').addClass('btn-group'),
            btn;

        for (var n = 0; n < this.scores.length; n++) {

            btn = this._renderButton(
                $$,
                this.scores[n].value,
                this.scores[n].text,
                this.setNewsPriority
            );

            console.log("this.state.score", this.state.score, this.scores[n].value);
            if (this.state.score === this.scores[n].value) {
                btn.addClass('active');
                btn.style('border', '1px solid red')
            }

            prio.append(btn);
        }

        return prio;
    }

    _renderLifeTime($$) {
        var lifetime = $$('div').addClass('btn-group lifetime')

        var buttons = this.lifetimes.map(function (lifetime) {

            return $$('button')
                .addClass('btn btn-secondary')
                .text(lifetime.label)
                .attr('data-toggle', 'tooltip')
                .attr('data-placement', 'bottom')
                .attr('data-trigger', 'manual')
                .attr('title', lifetime.text)
                .addClass(this.state[this.durationKey] === lifetime.value ? "active" : "")
                .on('click', function (e) {
                    this.setLifetime(e, lifetime);
                }.bind(this));

        }.bind(this));

        lifetime.append(buttons);
        return lifetime;
    }

    _renderButton($$, text, tooltip, onClickFunc) {

        return $$('button')
            .addClass('btn btn-secondary')
            .text(String(text))
            .attr('data-toggle', 'tooltip')
            .attr('data-placement', 'bottom')
            .attr('data-trigger', 'manual')
            .attr('title', tooltip)
            // .on('mouseenter', this.toggleTooltip)
            // .on('mouseout', this.hideTooltip)
            .on('click', onClickFunc);
    }


    _renderDatetimeInput($$) {
        var form = $$('form')
            .attr('id', 'npLifetimeForm');

        var fieldset = $$('fieldset').addClass('form-group').ref('datePickerFieldset');

        var text = this.getLabel('enter-date-and-time')
        // var endTime = api.getNewsPriority('newspriority').data.end;
        // if (endTime !== "" && !_.isEmpty(endTime)) {
        //     text = '\u2713 ' + text;
        // }

        var small = $$('div').append($$('small')
            .addClass('text-muted')
            .text(text)).addClass('hidden').ref('datePickerInstructionText');


        var input = $$('input')
            .attr('type', 'datetime-local')
            .addClass('form-control')
            .attr('id', 'npLifetimeInput')
            .on('change', this.setLifetimeDatetime).ref('datePickerInput');

        input.on('focus', () => {
            this.refs.datePickerInstructionText.$el.removeClass('hidden');
        })

        input.on('blur', () => {
            this.refs.datePickerInstructionText.$el.addClass('hidden');
        })


        if (this.state.end && this.state.end.length > 0) {
            input.val(this.state.end.substring(0, 16));
        }


        if (this.state[this.durationKey] !== 'custom' && this.lifetimes.length > 1) {
            form.attr('style', 'display: none;');
        }

        form.append(
            fieldset.append(input).append(small)
        );

        return form;
    }

    /*
    toggleTooltip(ev) {
        $(ev.target).tooltip('toggle');
        ev.target.timeout = window.setTimeout(function () {
            this.hideTooltip(ev)
        }.bind(this), 3000)
    }

    hideTooltip(ev) {
        if (ev.target.timeout) {
            window.clearTimeout(ev.target.timeout);
            ev.target.timeout = undefined;
        }
        $(ev.target).tooltip('hide');
    }*/

    setNewsPriority(ev) {
        //$(ev.target).tooltip('hide');
        var newsPriority = api.newsItem.getNewsPriority(pluginId);
        newsPriority.data.score = ev.target.textContent;

        api.newsItem.setNewsPriority(pluginId, newsPriority);

        this.extendState({
            score: newsPriority.data.score
        });
    }

    setLifetime(ev, lifetime) {

        //$(ev.target).tooltip('hide');
        var newsPriority = api.newsItem.getNewsPriority(pluginId);

        for (var n = 0; n < this.lifetimes.length; n++) {
            if (ev.target.textContent === this.lifetimes[n].label) {
                newsPriority.data.description = this.lifetimes[n].label;
                newsPriority.data[this.durationKey] = this.lifetimes[n].value;
                break;
            }
        }

        var extendedState = {};
        if (this.extendedState && this.extendedState.end) {
            extendedState.end = this.extendedState.end;
        }


        if (lifetime.value === 'custom' && this.extendedState && this.extendedState.end) {
            newsPriority.data.end = this.extendedState.end;
        } else {
            newsPriority.data.end = "";
        }

        api.newsItem.setNewsPriority('newspriority', newsPriority);

        extendedState['description'] = newsPriority.data.description;
        extendedState[this.durationKey] = newsPriority.data[this.durationKey];
        this.extendState(extendedState);
    }

    setLifetimeDatetime(ev) {

        var newsPriority = api.newsItem.getNewsPriority(pluginId);

        if (ev.target.value === "") {
            newsPriority.data.end = {};
        } else {
            newsPriority.data.end = moment(ev.target.value).format('YYYY-MM-DDTHH:mm:ssZ');
        }

        api.newsItem.setNewsPriority('newspriority', newsPriority);

        this.extendState({
            end: newsPriority.data.end
        });
    }
}

export default NewsPriorityComponent