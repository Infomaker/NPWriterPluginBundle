import { TextNode } from 'substance'

export default class ListItem extends TextNode {
    get isListItem() { return true }

    getLevel () {
        return this.level
    }

    setLevel (newLevel) {
        if (this.level !== newLevel) {
            this.getDocument().set([this.id, 'level'], newLevel)
        }
    }

    getText() {
        return this.content
    }

    isEmpty() {
        return !this.getText()
    }

    getLength() {
        return this.getText().length
    }

    getAnnotations() {
        return this.getDocument().getIndex('annotations').get(this.getPath())
    }

    getParent() {
        if (typeof this.parent === 'string') return this.document.get(this.parent)
        return this.parent
    }

    getPath() {
        return [this.id, 'content']
    }

    static isText() { return true }
}

ListItem.schema = {
    type: 'list-item',
    level: { type: 'number', default: 1 }
}
