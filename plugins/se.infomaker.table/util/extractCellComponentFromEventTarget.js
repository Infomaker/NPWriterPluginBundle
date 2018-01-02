import { Component } from 'substance'

export default function(target) {
    const comp = Component.unwrap(target)

    if (comp) {
        if (comp._isTableCellComponent) {
            return comp
        } else if (comp._isTextPropertyEditor) {
            return comp.getParent()
        } else if (comp._isTextPropertyComponent) {
            return comp.getParent().getParent()
        } else {
            return null
        }
    }

    return null
}
