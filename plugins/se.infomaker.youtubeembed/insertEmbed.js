/*
    Insert youtubeembed at current cursor pos
*/

export default function insertEmbed(tx, embedUrl) {
    tx.insertBlockNode({
        type: 'youtubeembed',
        dataType: 'x-im/youtube',
        url: embedUrl
    })
}
