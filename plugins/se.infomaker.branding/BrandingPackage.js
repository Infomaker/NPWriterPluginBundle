export default {
    name: 'branding',
    version: '{{version}}',
    configure: function (config, configObject) {

        const data = configObject.data

        if (data) {
            for (let key in data) {
                if (data.hasOwnProperty(key)) {
                    config.addLabel(key, data[key])
                }
            }
        }
    }
}
