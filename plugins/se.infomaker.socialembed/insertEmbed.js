/*
    Insert socialembed at current cursor pos
*/
export default function insertEmbed(tx, url) {
    tx.insertBlockNode({
        type: 'socialembed',
        dataType: 'x-im/socialembed',
        url: url
    })
}
