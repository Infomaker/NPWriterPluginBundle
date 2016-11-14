/*
    Insert socialembed at current cursor pos
*/

export default function insertEmbed(tx, embedUrl) {
    tx.insertBlockNode({
        type: 'socialembed',
        dataType: 'x-im/socialembed',
        url: embedUrl
    })
}
