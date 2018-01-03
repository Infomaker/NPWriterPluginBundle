import { Component } from 'substance'

export default function(target) {
    const comp = Component.unwrap(target)
    return findClosestCellParent(comp)
}

function findClosestCellParent(comp) {
    if (comp) {
        if (comp._isTableCellComponent) {
            return comp
        } else if (comp.getParent) {
            const candidate = comp.getParent()
            return findClosestCellParent(candidate)
        }
    }
    return null
}
