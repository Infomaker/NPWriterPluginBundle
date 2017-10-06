import {containsExtension} from './ImageTypes'

export default (uri, api) => {
    return containsExtension(uri)
}
