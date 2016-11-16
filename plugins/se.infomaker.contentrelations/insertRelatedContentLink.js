/*
 Insert socialembed at current cursor pos
 */

export default function insertRelatedContentLink(tx, data) {

    tx.insertBlockNode({
        dataType: 'x-im/link',
        type: 'contentrelations',
        uuid: data.item.uuid,
        label: data.item.name[0]
    })
}
