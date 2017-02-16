class Config {

    constructor(tagsConfig) {
        this.tagsConfig = tagsConfig
    }

    getTagConfigByType(type) {
        return this.tagsConfig[type]
    }
}

export default Config