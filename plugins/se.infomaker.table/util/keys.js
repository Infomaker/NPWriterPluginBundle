export const keys = {
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    RIGHT: 'ArrowRight',
    LEFT: 'ArrowLeft',
    ENTER: 'Enter',
    ESCAPE: 'Escape',
    TAB: 'Tab',
    DELETE: 'Delete'
}

export const MODIFIER_KEYS = [
    'Alt',
    'AltGraph',
    'CapsLock',
    'Control',
    'Fn',
    'FnLock',
    'Hyper',
    'Meta',
    'NumLock',
    'ScrollLock',
    'Shift',
    'Super',
    'Symbol',
    'SymbolLock'
]

export const NAVIGATION_KEYS = [
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowUp',
    'End',
    'Home',
    'PageDown',
    'PageUp'
]

export function isInputKey(key) {
    return !MODIFIER_KEYS.includes(key) && !NAVIGATION_KEYS.includes(key)
}
