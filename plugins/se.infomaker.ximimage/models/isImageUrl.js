import {getExtensions} from './ImageTypes'

export default (uri) => {
    const extensions = getExtensions().join('|').replace(/\./g, '\\.')
    const regexp = new RegExp(`^(https?:\/\/([^\\s]+))\\s*(${extensions})$`)

    return regexp.test(uri)
}
