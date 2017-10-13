import {api} from 'writer'

const fetchOembed = url => {
    return new Promise((resolve, reject) => {
        const baseUrl = 'http://iframe.ly/api/oembed'
        const apiKey = api.getConfigValue('se.infomaker.iframely', 'apiKey')
        const encodedUrl = encodeURIComponent(url)
        const iframelyUrl = `${baseUrl}/?url=${encodedUrl}&api_key=${apiKey}&iframe=true&omit_script=1`

        const req = {
            url: iframelyUrl
        }

        api.router.get('/api/resourceproxy', req)
        .then(res => api.router.checkForOKStatus(res))
        .then(res => res.json())
        .then(json => resolve(json))
        .catch(err => {
            reject(err)
        })
    })
}

export default fetchOembed