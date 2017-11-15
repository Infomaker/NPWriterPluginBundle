import {api} from 'writer'
import fetchWriterIframe from './fetchWriterIframe'

export default function fetchOembed(fetchUrl) {
    const baseUrl = 'http://iframe.ly/api/oembed'
    const apiKey = api.getConfigValue('se.infomaker.iframely', 'apiKey')
    const url = `${baseUrl}/?url=${encodeURIComponent(fetchUrl)}&api_key=${apiKey}`

    return api.router.get('/api/resourceproxy', { url })
        .then(res => api.router.checkForOKStatus(res))
        .then(res => res.json())
        .then(res => {
            if (!res.html) {
                return res
            } else {
                return addWriterFrameToOembed(fetchUrl, res)
            }
        })
}

export function addWriterFrameToOembed(fetchUrl, oembed) {
    return fetchWriterIframe(fetchUrl).then(writerIframe => {
        oembed.writerIframe = writerIframe
        return oembed
    })
}
