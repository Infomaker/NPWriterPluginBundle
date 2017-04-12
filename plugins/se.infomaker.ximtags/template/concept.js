export default {
    personTemplate: '<conceptItem conformance="power" standard="NewsML-G2" standardversion="2.20" version="1">' +
    '<catalogRef href="http://www.iptc.org/std/catalog/catalog.IPTC-G2-Standards_27.xml"/>' +
    '<catalogRef href="http://infomaker.se/spec/catalog/catalog.infomaker.g2.1_0.xml"/>' +
    '<itemMeta>' +
    '<itemClass qcode="cinat:concept"/>' +
    '<provider literal=""/>' +
    '<firstCreated />' +
    '<versionCreated/>' +
    '<pubStatus qcode="stat:usable"/>' +
    '<edNote/>' +
    '<itemMetaExtProperty type="imext:type" value="x-im/person"/>' +
    '<itemMetaExtProperty type="imext:firstName" value=""/>' +
    '<itemMetaExtProperty type="imext:lastName" value=""/>' +
    '<links xmlns="http://www.infomaker.se/newsml/1.0" />' +
    '</itemMeta>' +
    '<concept>' +
    '<conceptId uri="im://person/"/>' +
    '<type qcode="cpnat:person"/>' +
    '<name></name>' +
    '<definition role="drol:long"></definition>' +
    '<definition role="drol:short"></definition>' +
    '</concept>' +
    '</conceptItem>',

    organisationTemplate: '<conceptItem conformance="power" standard="NewsML-G2" standardversion="2.20" version="1">' +
    '<catalogRef href="http://www.iptc.org/std/catalog/catalog.IPTC-G2-Standards_27.xml"/>' +
    '<catalogRef href="http://infomaker.se/spec/catalog/catalog.infomaker.g2.1_0.xml"/>' +
    '<itemMeta>' +
    '<itemClass qcode="cinat:concept"/>' +
    '<provider literal=""/>' +
    '<firstCreated />' +
    '<versionCreated/>' +
    '<pubStatus qcode="stat:usable"/>' +
    '<itemMetaExtProperty type="imext:type" value="x-im/organisation"/>' +
    '<links xmlns="http://www.infomaker.se/newsml/1.0" />' +
    '</itemMeta>' +
    '<concept>' +
    '<conceptId uri="im://organisation/"/>' +
    '<type qcode="cpnat:organisation"/>' +
    '<name></name>' +
    '<definition role="drol:long"></definition>' +
    '<definition role="drol:short"></definition>' +
    '<metadata xmlns="http://www.infomaker.se/newsml/1.0">' +
    '<object id="" type="x-im/contact-info">' +
    '<data>' +
    '<email></email>' +
    '<phone></phone>' +
    '<fax></fax>' +
    '<streetAddress></streetAddress>' +
    '<postalCode></postalCode>' +
    '<country></country>' +
    '</data>' +
    '</object>' +
    '</metadata>' +
    '</concept>' +
    '</conceptItem>',

    topicTemplate: '<conceptItem conformance="power" standard="NewsML-G2" standardversion="2.20" version="1">' +
    '<catalogRef href="http://www.iptc.org/std/catalog/catalog.IPTC-G2-Standards_27.xml"/>' +
    '<catalogRef href="http://infomaker.se/spec/catalog/catalog.infomaker.g2.1_0.xml"/>' +
    '<itemMeta>' +
    '<itemClass qcode="cinat:concept"/>' +
    '<provider literal=""/>' +
    '<pubStatus qcode="stat:usable"/>' +
    '<firstCreated />' +
    '<versionCreated/>' +
    '<edNote/>' +
    '<itemMetaExtProperty type="imext:type" value="x-im/topic"/>' +
    '<links xmlns="http://www.infomaker.se/newsml/1.0"/>' +
    '</itemMeta>' +
    '<concept>' +
    '<conceptId />' +
    '<type qcode="cpnat:object"/>' +
    '<name></name>' +
    '<definition role="drol:long"></definition>' +
    '<definition role="drol:short"></definition>' +
    '</concept>' +
    '</conceptItem>'

}