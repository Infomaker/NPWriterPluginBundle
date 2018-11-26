const {Component} = substance
const {UIButton, UIToggle, api} = writer
import './scss/index.scss'

class TextmanipulationComponent extends Component {

    getInitialState() {
        return {
            action: {
                from: '',
                to: ''
            },
            matches: [],
            offset: null,
            words: false,
            case: false
        }
    }

    willReceiveProps(newProps) {
        if (newProps.popover.active && !this.props.active) {
            setTimeout(() => {
                this.refs["im-tm_str"].el.focus()
            })
        }
    }

    render($$) {
        const el = $$('div').append([
            $$('label').attr({for: 'im-tm_str'}).append(this.getLabel('Search for')),
            $$('input').attr({id: 'im-tm_str', name: 'im-tm_str', tabIndex: '0', 'data-test': 'test'}).ref('im-tm_str'),
            $$('label').attr({for: 'im-tm_to'}).append(this.getLabel('Replace with')),
            $$('input').attr({id: 'im-tm_to', name: 'im-tm_to', tabIndex: '0'}).ref('im-tm_to'),
            $$('div').addClass('toggles').append([
                $$(UIToggle, {
                    id: 'im-tm_words',
                    label: this.getLabel('Match whole words'),
                    checked: this.state.words,
                    tabIndex: '0',
                    onToggle: checked => {
                        this.extendState({
                            words: checked
                        })
                    }
                }),
                $$(UIToggle, {
                    id: 'im-tm_case',
                    label: this.getLabel('Case sensitive'),
                    checked: this.state.case,
                    tabIndex: '0',
                    onToggle: checked => {
                        this.extendState({
                            case: checked
                        })
                    }
                })
            ]),
            $$('div').append([
                $$(UIButton, {label: this.getLabel('prev')})
                    .ref('im-tm_find_prev')
                    .addClass('np-ui-secondary')
                    .on('click', (evt) => {
                            this.findPrev()
                            evt.target.focus()
                        }
                    ).attr({tabIndex: '0'}),
                $$(UIButton, {label: this.getLabel('next')})
                    .ref('im-tm_find_next')
                    .addClass('np-ui-secondary')
                    .on('click', (evt) => {
                        this.findNext()
                        evt.target.focus()
                    })
                    .attr({tabIndex: '0'}),
                $$(UIButton, {
                        label: this.getLabel('Replace')
                    }
                )
                    .addClass(this.state.matches.length === 0 ? 'np-ui-secondary disabled' : 'np-ui-secondary')
                    .ref('im-tm_replace')
                    .on('click', (evt) => {
                            if (this.state.matches.length > 0) {
                                this.replace()
                            }
                            setTimeout(() => {
                                evt.target.focus()
                            }, 500)
                        }
                    ).attr({tabIndex: '0'}),
                $$(UIButton, {
                        label: this.getLabel('Replace all')
                    }
                )
                    .ref('im-tm_replace_all')
                    .addClass('np-ui-secondary')
                    .on('click', (evt) => {
                            this.replaceAll()
                            evt.target.focus()
                        }
                    ).attr({tabIndex: '0'})
            ])
        ])

        return el
            .ref('searchandreplace')
            .addClass('im-textmanipulation')
    }

    clear(offset = null) {
        this.setState({
            action: {
                from: '',
                to: ''
            },
            matches: [],
            offset: offset
        })
    }

    search({backwards} = {backwards: false}) {
        const str = this.refs['im-tm_str'].val()
        const to = this.refs['im-tm_to'].val()

        this.extendState({matches: []})

        if (str === '') {
            return this.clear()
        }

        const doc = this.context.editorSession.getDocument()
        const nodes = doc.getNodes()

        for (let id in nodes) {
            // Only text nodes should have the content property
            if (!nodes[id].content) {
                continue
            }

            const len = str.length
            let match
            let matchString = str.replace('/', '\\/')
            if (this.state.words) {
                matchString = `\\b${matchString}\\b`
            }

            const re = new RegExp(matchString, `g${this.state.case ? '' : 'i'}`)
            while ((match = re.exec(nodes[id].content)) !== null) {
                const item = {
                    nodeId: id,
                    start: match.index,
                    end: match.index + len
                };
                if (backwards) {
                    this.state.matches.unshift(item)
                } else {
                    this.state.matches.push(item)
                }
            }
        }

        // Figure out selection offset
        if (this.state.action.from !== str || this.state.action.to !== to || !this.state.matches.length) {
            return this.extendState({
                offset: this.state.matches.length ? 0 : null,
                action: {
                    from: str,
                    to: to
                }
            })
        }

        let offset = this.state.offset + 1
        if (offset >= this.state.matches.length) {
            offset = 0
        }

        this.extendState({
            offset: offset
        })
    }

    findPrev() {
        this.search({backwards: true})
        this.selectNext()
    }


    findNext() {
        this.search()
        this.selectNext()
    }

    replace() {
        if (this.state.offset === null) {
            this.findNext()
        }

        if (this.state.offset === null) {
            return
        }

        const match = this.state.matches[this.state.offset]

        this.context.editorSession.transaction(tx => {
            this._performReplace(tx, match)
        })

        this.state.matches.splice(this.state.offset, 1)
        this.extendState({
            offset: this.state.offset > 0 ? this.state.offset - 1 : null
        })

        this.findNext()
    }

    /*
    {
        nodeId: id,
        start: match.index,
        end: match.index + len
    }
    */
    replaceAll() {

        this.search();

        const from = this.state.action.from
        const to = this.state.action.to

        if (this.state.matches.length === 0) {
            this._notifyUser(this.getLabel('No hits'))
            return
        }

        const matches = this.state.matches.slice()

        this.context.editorSession.transaction(tx => {
            matches.reverse().forEach((searchHit) => {
                this._performReplace(tx, searchHit)
            })
        })

        this._notifyUser(`${this.getLabel('Replaced')} ${matches.length} ${this.getLabel('Occurrences')}`)
    }

    _performReplace(tx, searchHit) {

        const sel = tx.createSelection(
            {
                type: 'property',
                path: [searchHit.nodeId, 'content'],
                startOffset: searchHit.start,
                endOffset: searchHit.start + this.state.action.from.length
            }
        );
        tx.setSelection(sel)

        tx.insertText(this.state.action.to)

    }

    _notifyUser(message) {
        this.context.api.ui.showNotification('textmanipulation', this.getLabel('Search and replace'), message)

    }

    selectNext() {
        if (this.state.offset === null) {
            if (this.state.matches.length === 0) {
                this._notifyUser(this.getLabel('No hits'))
                return
            }

            const editorSession = this.context.editorSession;
            editorSession.setSelection(null)

            return
        }

        const match = this.state.matches[this.state.offset]
        const doc = this.context.editorSession.getDocument()

        const selection = doc.createSelection({
            type: 'property',
            path: [match.nodeId, 'content'],
            startOffset: match.start,
            endOffset: match.end
        })

        this.context.editorSession.setSelection(selection)
    }
}

export {TextmanipulationComponent}
