import Package from './IframelyPackage'

export default function insertIframelyEmbed(tx, url) {
    tx.insertBlockNode({
        type: Package.name,
        dataType: `x-im/${Package.name}`,
        url: decodeURIComponent(url)
    })
}
