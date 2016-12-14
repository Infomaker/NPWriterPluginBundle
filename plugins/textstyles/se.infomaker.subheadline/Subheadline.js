import './scss/index.scss'
import {TextBlock} from 'substance'

class Subheadline extends TextBlock {}

Subheadline.type = 'subheadline'
Subheadline.define({
    "level": { type: "number", default: 1 },
    "contentType": { type: "string", optional: true },
    "format": { type: "string", default: "html"}
})

export default Subheadline
