class ContainerContent {

    constructor(container, converter) {
        this.container = container
        this.converter = converter
    }

    /**
     * Create a DocumentFragment with content from the current container.
     */
    fragment () {
        return this.container
            .getNodes()
            .map(this.extractAnnotations(this.container))
            .map(this.annotateText(this.converter))
            .map(this.joinParagraph)
            .map(this.createParagraph)
            .reduce((fragment, paragraph) => {
                fragment.appendChild(paragraph)
                return fragment
            }, document.createDocumentFragment())
    }

    /**
     * Returns a list of valid tag names from the current converter.
     * Also removes some potentially nefarious ones and adds in `p` and `div`.
     */
    tagNames () {
        const tags = this.converter.converters
            .map((itm) => itm.tagName)
            .filter((tagName) => !['element', 'object', 'group'].includes(tagName))
            .filter((tagName) => Boolean(tagName))
        tags.push('p')
        tags.push('div')

        return tags
    }

    /**
     * Extracts the annotation nodes (strong, emphasis etc) from each paragraph.
     *
     * This function returns a new function that can be used with map. It does so to capture the `container` object.
     */
    extractAnnotations (container) {
        return function (node) {
            const annotations = container.document.data.indexes.annotations.byPath[node.id] || {content: {}}
            return {
                annotations: Object.keys(annotations.content).map((key) => annotations.content[key]),
                content: node.content
            }
        }
    }

    /**
     * Use the text annotation nodes to generate HTML.
     *
     * We piggyback on the NewsML converters implementation of _annotatedText to create HTML from the container.
     *
     * This function returns a new function that can be used with map. It does so to capture the `converter` object.
     */
    annotateText (converter) {
        return function (node) {
            return converter._annotatedText(node.content, node.annotations)
        }
    }

    /**
     * Joins paragraph content nodes together.
     *
     * Results in HTML from the contents of one paragraph in the editor.
     */
    joinParagraph (paragraph) {
        if (!Array.isArray(paragraph)) { return '' }
        return paragraph.map((fragment) => fragment.outerHTML || fragment).filter((fragment) => fragment).join('')
    }

    /**
     * Creates a new paragraph tag and encloses our HTML in it and then returns the entire paragraph as an HTML string.
     */
    createParagraph (content) {
        const el = document.createElement('p')
        el.innerHTML = content
        return el
    }
}

export default ContainerContent
