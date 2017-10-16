import {api} from 'writer'

const fetchOembed = fetchUrl => {
    const baseUrl = 'http://iframe.ly/api/oembed'
    const apiKey = api.getConfigValue('se.infomaker.iframely', 'apiKey')
    const url = `${baseUrl}/?url=${encodeURIComponent(fetchUrl)}&api_key=${apiKey}&iframe=true&omit_script=1`

    return api.router.get('/api/resourceproxy', { url })
        .then(res => api.router.checkForOKStatus(res))
        .then(res => res.json())
}

export default fetchOembed
