class PublishFlowConfiguration {
    constructor() {
        this.status = {
            'imext:draft': {
                'allowed': [
                    'imext:done',
                    'stat:withheld',
                    'stat:usable'
                ]
            },
            'imext:done': {
                'allowed': [
                    'stat:withheld',
                    'stat:usable',
                    'imext:draft'
                ]
            },
            'stat:withheld': {
                'allowed': [
                    'imext:draft',
                    'stat:usable',
                    'stat:canceled'
                ]
            },
            'stat:usable': {
                'allowed': [
                    'stat:usable',
                    'stat:canceled'
                ]
            },
            'stat:canceled': {
                'allowed': [
                    'imext:draft',
                    'imext:done',
                    'stat:withheld',
                    'stat:usable'
                ]
            },
        }
    }

    getAllowedActions(status) {
        if (this.status[status]) {
            return this.status[status].allowed
        }

        return []
    }
}

export default PublishFlowConfiguration
