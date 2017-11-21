import './scss/editorialnote.scss'

import EditorialNote from './EditorialNote'
const { registerPlugin } = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(EditorialNote)
    } else {
        console.info("Register method not yet available");
    }
}
