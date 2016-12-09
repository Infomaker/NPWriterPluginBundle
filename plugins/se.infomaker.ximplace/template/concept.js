module.exports = {
    place: '<?xml version="1.0" encoding="UTF-8"?> ' +
        '<conceptItem xmlns="http://iptc.org/std/nar/2006-10-01/" version="1" standard="NewsML-G2" standardversion="2.20" conformance="power"> ' +
        '<catalogRef href="http://www.iptc.org/std/catalog/catalog.IPTC-G2-Standards_27.xml"/> ' +
        '<catalogRef href="http://infomaker.se/spec/catalog/catalog.infomaker.g2.1_0.xml"/> ' +
            '<itemMeta> ' +
                '<itemClass qcode="cinat:concept"/> ' +
                '<provider literal=""/>' +
                '<firstCreated />' +
                '<versionCreated/>' +
                '<pubStatus qcode="stat:usable"/> ' +
                '<itemMetaExtProperty type="imext:type" value="x-im/place"/> ' +
            '</itemMeta> ' +
        '<concept> ' +
            '<conceptId uri="im://place/"/> ' +
            '<type qcode="cpnat:poi"/>' +
            '<name></name>' +
            '<definition role="drol:long"></definition> ' +
            '<definition role="drol:short"></definition> ' +
            '<metadata xmlns="http://www.infomaker.se/newsml/1.0"> ' +
                '<object id="" type="x-im/position"> ' +
                    '<data> ' +
                        '<geometry>POINT(14.55600 56.89921)</geometry> ' +
                    '</data> ' +
                '</object> ' +
            '</metadata> ' +
        '</concept> ' +
    '</conceptItem>'
};