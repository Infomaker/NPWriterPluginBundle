import { registerPlugin } from 'writer'; // eslint-disable-line
import Package from './package';

function init() {
    if (registerPlugin) {
        registerPlugin(Package);
    }
    else {
        console.error('Register method not yet available'); // eslint-disable-line no-console
    }
}

export default init;
