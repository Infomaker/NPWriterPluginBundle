/*
 Insert socialembed at current cursor pos
 */

/**
 *
 * Twitter
 * <object id="NzYsMTE0LDE5OSw3OQ" type="x-im/socialembed">
 *     <links>
 *         <link rel="self" type="x-im/tweet" url="https://twitter.com/jkrums/status/1121915133" uri="im://tweet/1121915133"/>
 *     </links>
 * </object>
 *
 *
 * FACEBOOK
 * <object id="MTAxLDEyNywxNDQsMTg" type="x-im/socialembed">
 *     <links>
 *         <link rel="self" type="x-im/facebook-post" url="https://www.facebook.com/mobienaapp/posts/150034608477813" uri="im://facebook-post/150034608477813"/>
 *     </links>
 * </object
 *
 * // INSTAGRAM
 * <object id="MjIxLDg2LDcxLDE3Nw" type="x-im/socialembed">
 *     <links>
 *         <link rel="self" type="x-im/instagram" url="https://www.instagram.com/p/BNX5CmxDCsK/" uri="im://instagram/1393833477409614602_247362020"/>
 *     </links>
 *</object>
 */

export default function insertEmbed(tx, embedUrl) {
    return tx.insertBlockNode({
        type: 'socialembed',
        dataType: 'x-im/socialembed',
        url: embedUrl
    })
}
