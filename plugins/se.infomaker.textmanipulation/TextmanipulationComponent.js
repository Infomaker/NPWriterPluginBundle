const {Component} = substance
const {UIButton} = writer
import './scss/index.scss'

class TextmanipulationComponent extends Component {

    getInitialState() {
        return {
            action: {
                from: '',
                to: ''
            },
            matches: [],
            offset: null
        }
    }

    render($$) {
        const el = $$('div').append([
            $$('label').attr({ for: 'im-tm_str'}).append(this.getLabel('Search')),
            $$('input').attr({ id: 'im-tm_str', name: 'im-tm_str' }).ref('im-tm_str'),
            $$('label').attr({ for: 'im-tm_to'}).append(this.getLabel('Replace')),
            $$('input').attr({ id: 'im-tm_to', name: 'im-tm_to' }).ref('im-tm_to'),
            $$('div').append([
                $$(UIButton, { label: 'Find' }).ref('im-tm_find')
                    .on('click', () => {
                        this.findNext()
                    }),
                $$(UIButton, { label: 'Replace' }).ref('im-tm_replace')
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

            let start = nodes[id].content.indexOf(str)
            while (start !== -1) {
                this.state.matches.push({
                    nodeId: id,
                    start: start,
                    end: start + str.length
                })

                start = nodes[id].content.indexOf(str, start + str.length)
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
