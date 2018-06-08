const {Component} = substance
const {UIButton, api} = writer
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

    didUpdate() {
        if (this.props.popover.active) {
            this.refs["im-tm_str"].el.focus()
        }
    }

    render($$) {
        const Toggle = api.ui.getComponent('toggle')
        const el = $$('div').append([
            $$('label').attr({ for: 'im-tm_str'}).append(this.getLabel('Search for')),
            $$('input').attr({ id: 'im-tm_str', name: 'im-tm_str' }).ref('im-tm_str'),
            $$('label').attr({ for: 'im-tm_to'}).append(this.getLabel('Replace with')),
            $$('input').attr({ id: 'im-tm_to', name: 'im-tm_to' }).ref('im-tm_to'),
            $$('div').addClass('toggles').append([
                $$(Toggle, {
                    id: 'im-tm_words',
                    label: this.getLabel('Match whole words'),
                    checked: this.state.words,
                    onToggle: checked => {
                        this.extendState({
                            words: checked
                        })
                    }
                }),
                $$(Toggle, {
                    id: 'im-tm_case',
                    label: this.getLabel('Case sensitive'),
                    checked: this.state.case,
                    onToggle: checked => {
                        this.extendState({
                            case: checked
                        })
                    }
                })
            ]),
            $$('div').append([
                $$(UIButton, { label: this.getLabel('Find next') }).ref('im-tm_find')
                    .on('click', () => {
                        this.findNext()
                    }),
                $$(UIButton, { label: this.getLabel('Replace') }).ref('im-tm_replace')
                    .on('click', () => {
                        this.replace(true)
                    })
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

    search() {
        const str = this.refs['im-tm_str'].val()
        const to = this.refs['im-tm_to'].val()

        this.state.matches.length = 0

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
                this.state.matches.push({
                    nodeId: id,
                    start: match.index,
                    end: match.index + len
                })
            }
        }

        // Figure out selection offset
        if (this.state.action.from !== str || !this.state.matches.length) {
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
            tx.update(
                [match.nodeId, 'content'],
                {
                    delete: {
                        start: match.start,
                        end: match.end
                    }
                }
            )

            tx.update(
                [match.nodeId, 'content'],
                {
                    insert: {
                        offset: match.start,
                        value: this.state.action.to
                    }
                }
            )
        })

        this.state.matches.splice(this.state.offset, 1)
        this.extendState({
            offset: this.state.offset > 0 ? this.state.offset - 1 : null
        })

        this.findNext()
    }

    selectNext() {
        if (this.state.offset === null) {
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
