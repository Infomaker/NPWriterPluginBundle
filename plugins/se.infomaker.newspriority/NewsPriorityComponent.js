const {Component} = substance
const {api, moment, idGenerator, NPWriterSidebarComponent} = writer
const {isObject, isEmpty} = writer.lodash
const pluginId = 'se.infomaker.newspriority'

// var idGen = require('writer/utils/IdGenerator');
// var isObject = require('lodash/isObject');

class NewsPriorityComponent extends NPWriterSidebarComponent {

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

        let newsValue = {
            score: this.scores[this.defaultScoreIndex].value,
            description: this.lifetimes[this.defaultLifetimeIndex].label,
            format: 'lifetimecode'
        };

        newsValue[this.durationKey] = this.lifetimes[this.defaultLifetimeIndex].value;
        return newsValue;

    }

    render($$) {

        const el = $$('div'),
            prioTitle = $$('h2').text(this.getLabel('newsvalue'));

        el.append(prioTitle);
        el.append(this._renderPriority($$));

        this.node = this.props.nodes[0]

        return el;

    }

    toogleTooltip(ref, show) {
        this.refs[ref].extendProps({show: show})
    }

    _renderPriority($$) {
        const prio = $$('div').addClass('btn-group'),
            Tooltip = api.ui.getComponent('tooltip')

        const node = this.props.nodes[0]
        if(!node) {
            return
        }
        const buttons = this.scores.map((score) => {
            return $$('button')
                .append([
                    $$(Tooltip, {title: score.text}).ref('tooltip-' + score.value),
                    $$('span').addClass('label').text(String(score.value))
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
                .addClass(parseInt(node.score, 10) === score.value ? "active" : "")
        })

        prio.append(buttons)
        return prio;
    }

    _renderLifeTime($$) {
        var lifetime = $$('div').addClass('btn-group lifetime')

        var buttons = this.lifetimes.map(function (lifetime) {

            const Tooltip = api.ui.getComponent('tooltip')
            return $$('button')
                .addClass('btn btn-secondary sc-np-btn')
                .append([
                    $$(Tooltip, {title: lifetime.text}).ref('tooltip-' + lifetime.label),
                    $$('span').addClass('label').text(lifetime.label)
                        .on('click', (e) => {
                            this.setLifetime(e, lifetime);
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
                .addClass(this.state[this.durationKey] === lifetime.value ? "active" : "")


        }.bind(this));

        lifetime.append(buttons);
        return lifetime;
    }


    _renderDatetimeInput($$) {
        var form = $$('form')
            .attr('id', 'npLifetimeForm');

        var fieldset = $$('fieldset').addClass('form-group').ref('datePickerFieldset');

        var text = this.getLabel('enter-date-and-time')

        const node = this.props.nodes[0]

        var endTime = node.end;
        if (endTime !== "" && !isEmpty(endTime)) {
            text = '\u2713 ' + text;
        }

        var small = $$('div').append($$('small')
            .addClass('text-muted')
            .text(text)).addClass('hidden').ref('datePickerInstructionText');


        var input = $$('input')
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
        const node = this.props.nodes[0]
        this.context.api.editorSession.transaction((tx) => {
            tx.set([node.id, 'score'], score)
        })
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
