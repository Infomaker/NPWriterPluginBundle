const {Component} = substance
const {api, moment, idGenerator, event} = writer
const {isObject, isEmpty} = writer.lodash
const pluginId = 'se.infomaker.newspriority'

// var idGen = require('writer/utils/IdGenerator');
// var isObject = require('lodash/isObject');

class NewsPriorityComponent extends Component {

    constructor(...args) {
        super(...args)

        this.Tooltip = api.ui.getComponent('tooltip')

        api.events.on(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED_EXTERNAL, e => {
            if (e.data.key === 'contentMetadata' && e.data.value.type === 'x-im/newsvalue') {
                this.updateState()
            }
        })

    }

    shouldRerender(newProps, newState) {
        return (newState.score !== this.state.score || newState.duration !== this.state.duration)
    }

    dispose() {
        api.events.off(this.props.pluginConfigObject.id, event.DOCUMENT_COPIED)
        api.events.off(this.props.pluginConfigObject.id, event.DOCUMENT_CHANGED_EXTERNAL)
    }


    getInitialState() {
        this.scores = api.getConfigValue(pluginId, 'scores');
        this.lifetimes = api.getConfigValue(pluginId, 'lifetimes');
        this.durationKey = api.getConfigValue(pluginId, 'durationKey');
        this.defaultScoreIndex = api.getConfigValue(pluginId, 'defaultScoresIndex');
        this.defaultLifetimeIndex = api.getConfigValue(pluginId, 'defaultLifetimesIndex');

        const newsValue = {
            score: this.scores[this.defaultScoreIndex].value,
            description: this.lifetimes[this.defaultLifetimeIndex].label,
            format: 'lifetimecode'
        };

        newsValue[this.durationKey] = this.lifetimes[this.defaultLifetimeIndex].value;
        return newsValue;
    }

    updateState() {
        let newsPriority = api.newsItem.getNewsPriority();

        if (!newsPriority) {
            // No news prio found in document, create a default template
            const template = {
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
            newsPriority = api.newsItem.getNewsPriority();

            // For some reason when transforming an empty string in API it returns an empty object{}
            if (isObject(newsPriority.data[this.durationKey])) {
                newsPriority.data[this.durationKey] = template.data[this.durationKey];
            }

        } else {
            if (newsPriority.data.end && !this.extendedState) {
                this.extendedState = {end: newsPriority.data.end};
            }
        }

        const newState = {
            score: newsPriority.data.score,
            description: newsPriority.data.description,
            format: newsPriority.data.format,
            end: newsPriority.data.end
        };
        newState[this.durationKey] = newsPriority.data[this.durationKey];
        this.setState(newState);
    }

    didMount() {
        this.updateState();
    }

    render($$) {
        const el = $$('div');

        const prioTitle = $$('h2').append(this.getLabel('newsvalue'));
        el.append(prioTitle);
        el.append(this._renderPriority($$));

        if (!this.preventLifeTime()) {
            const lifetimeTitle = $$('h2').append(this.getLabel('Lifetime'));
            el.append(lifetimeTitle);
            if (this.lifetimes.length > 1) {
                el.append(this._renderLifeTime($$));
            }

            el.append(this._renderDatetimeInput($$).ref('datePickerComponent'));
        }

        return el;

    }


    preventLifeTime() {
        return api.getConfigValue(pluginId, 'preventLifetime', false) === true
    }

    toogleTooltip(ref, show) {
        this.refs[ref].extendProps({show: show})
    }

    _renderPriority($$) {
        const prio = $$('div').addClass('btn-group')
        const currentScore = parseInt(this.state.score, 10)

        const buttons = this.scores.map(score => {
            const scoreOption = parseInt(score.value, 10)
            const buttonClass = (currentScore === scoreOption) ? "active" : ""

            return $$('button')
                .append([
                    $$(this.Tooltip, {title: score.text}).ref('tooltip-' + score.value),
                    $$('span').addClass('label').append(scoreOption)
                        .on('click', () => {
                            this.setNewsPriority(score.value);
                            this.toogleTooltip('tooltip-' + score.value, false)
                        })
                        .on('mouseenter', () => {
                            this.toogleTooltip('tooltip-' + score.value, true)
                        })
                        .on('mouseout', () => {
                            this.toogleTooltip('tooltip-' + score.value, false)
                        })
                ])
                .addClass('btn btn-secondary sc-np-btn')
                .addClass(buttonClass)
        })

        prio.append(buttons)
        return prio;
    }

    _renderLifeTime($$) {
        const lifetime = $$('div').addClass('btn-group lifetime')
        const currentDuration = this.state[this.durationKey]

        const buttons = this.lifetimes.map(lifetime => {
            const buttonClass = (currentDuration === lifetime.value) ? "active" : ""

            return $$('button')
                .addClass('btn btn-secondary sc-np-btn')
                .append([
                    $$(this.Tooltip, {title: lifetime.text}).ref('tooltip-' + lifetime.label),
                    $$('span').addClass('label').append(lifetime.label)
                        .on('click', () => {
                            this.setLifetime(lifetime);
                            this.toogleTooltip('tooltip-' + lifetime.label, false)
                        })
                        .on('mouseenter', () => {
                            this.toogleTooltip('tooltip-' + lifetime.label, true)
                        })
                        .on('mouseout', () => {
                            this.toogleTooltip('tooltip-' + lifetime.label, false)
                        })
                ])
                .attr('title', lifetime.text)
                .addClass(buttonClass)
        })

        lifetime.append(buttons);
        return lifetime;
    }


    _renderDatetimeInput($$) {
        const form = $$('form')
            .attr('id', 'npLifetimeForm');

        const fieldset = $$('fieldset').addClass('form-group').ref('datePickerFieldset');

        let text = this.getLabel('enter-date-and-time');

        const endTime = api.newsItem.getNewsPriority().data.end;
        if (endTime !== "" && !isEmpty(endTime)) {
            text = '\u2713 ' + text;
        }

        const small = $$('div').append($$('small')
            .addClass('text-muted')
            .text(text)).addClass('hidden').ref('datePickerInstructionText');


        const input = $$('input')
            .attr('type', 'datetime-local')
            .addClass('form-control')
            .attr('id', 'npLifetimeInput')
            .on('change', this.setLifetimeDatetime).ref('datePickerInput');

        input.on('focus', () => {
            this.refs.datePickerInstructionText.el.removeClass('hidden');
        })

        input.on('blur', () => {
            this.refs.datePickerInstructionText.el.addClass('hidden');
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

    setNewsPriority(score) {
        const newsPriority = api.newsItem.getNewsPriority();
        newsPriority.data.score = score;

        api.newsItem.setNewsPriority(pluginId, newsPriority);

        this.extendState({
            score: newsPriority.data.score
        });
    }

    setLifetime(lifetime) {
        const newsPriority = api.newsItem.getNewsPriority();

        for (let n = 0; n < this.lifetimes.length; n++) {
            if (lifetime.label === this.lifetimes[n].label) {
                newsPriority.data.description = this.lifetimes[n].label;
                newsPriority.data[this.durationKey] = this.lifetimes[n].value;
                break;
            }
        }

        const extendedState = {};
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

        const newsPriority = api.newsItem.getNewsPriority();

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
