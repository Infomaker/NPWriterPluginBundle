'use strict'

import { api } from 'writer'

function getItemMetaExtPropertyValue(type) {
    switch (type) {
        case 'imext:pubstart':
            return {
                pubStart: api.newsItem.getPubStart()
            }
        case 'imext:pubstop':
            return {
                pubStop: api.newsItem.getPubStop()
            }
        case 'imext:haspublishedversion':
            return {
                hasPublishedVersion: api.newsItem.getHasPublishedVersion()
            }
        default:
            return null
    }
}

export default function getExternalChange(event) {
    switch (event.data.key) {
        case 'pubStatus':
            return {
                status: api.newsItem.getPubStatus()
            }
        case 'pubStart':
            return {
                pubStart: api.newsItem.getPubStart()
            }
        case 'pubStop':
            return {
                pubStop: api.newsItem.getPubStop()
            }
        case 'itemMetaExtProperty':
            return getItemMetaExtPropertyValue(event.data.value.type)
        default:
            return null
    }
}