/*
    Insert socialembed at current cursor pos
*/
export default function(tx, url) {
    tx.insertNode({
        type: 'socialembed',
        dataType: 'x-im/socialembed',
        url: url
    })
}