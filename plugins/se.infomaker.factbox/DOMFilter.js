class DOMFilter {
    constructor(root, allowedTags) {
        this.root = root.cloneNode(true)
        this.allowedTags = allowedTags.map((tag) => tag.toUpperCase())
        this.poisonousTags = ['SCRIPT']
        this.stack = this.flatMap(this.createStack(this.root).slice(1).reverse(), (itm) => itm)
        this._output = null
    }

    walkTheDOM(node, func, level) {
        level = level || 0
        func(node, level)
        node = node.firstChild
        while (node) {
            this.walkTheDOM(node, func, level + 1)
            node = node.nextSibling
        }
    }

    flatMap(array, fn) {
        return Array.prototype.concat.apply([], array.map(fn))
    }

    createStack(root) {
        const stack = []
        this.walkTheDOM(root, (node, level) => {
            if (!Array.isArray(stack[level])) {
                stack[level] = []
            }
            stack[level].push(node)
        })
        return stack
    }

    keep() {
        const allowed = this.allowedTags
        const self = this
        return function (node) {
            if (node.nodeType !== Node.ELEMENT_NODE) {
                return
            }

            // Remove unwanted attributes
            self.filterAttributes(node)

            // Don't do node processing for wanted tags.
            if (allowed.includes(node.tagName)) {
                return
            }
            if (node.childNodes.length > 0 && !self.poisonousTags.includes(node.tagName)) {
                const fragment = document.createDocumentFragment()
                Array.prototype.slice.call(node.childNodes).forEach(fragment.appendChild, fragment)
                node.parentNode.replaceChild(fragment, node)
            } else {
                node.parentNode.removeChild(node)
            }
        }
    }

    filterAttributes(node) {
        Array.prototype.forEach.call(node.attributes, (attr) => {
            if (attr.name.indexOf('on') === 0) {
                node.removeAttribute(attr.name)
            }
        })
    }

    output() {
        if (this._output) {
            return this._output
        }

        this.stack.forEach(this.keep())
        // Document fragments do not have inner/outer HTML properties, so we create a temporary div
        // to facilitate HTML conversion.
        const tempObject = document.createElement('div')
        tempObject.appendChild(this.root)
        this._output = tempObject.innerHTML
        return this._output
    }
}

export default DOMFilter
