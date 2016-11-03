import Newspriority from './Newspriority'
const {registerPlugin} = writer

export default () => {
    if (registerPlugin) {
        registerPlugin(Newspriority)
    } else {
        console.info("Register method not yet available");
    }
}


