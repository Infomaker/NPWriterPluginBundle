import { types, newsmlTags } from './config';

/*
 * HTML converter for Paragraphs.
 */
export default {
    type: types.NODE,
    tagName: newsmlTags.NODE,

    import (el, node) {},

    export (node, el) {}
};
