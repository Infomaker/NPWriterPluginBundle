import TextAnalyzer from '../se.infomaker.textanalyzer/index'
import PublishFlow from '../se.infomaker.publishflow/index'
import SocialEmbed from '../se.infomaker.socialembed/index'
import NewsPriority from '../se.infomaker.newspriority/index'
import XImteaser from '../se.infomaker.ximteaser/index'
import XImimage from '../se.infomaker.ximimage/index'
import XImPlace from '../se.infomaker.ximplace/index'
import XImAuthor from '../se.infomaker.ximauthor/index'
import YoutubeEmbed from '../se.infomaker.youtubeembed/index'
import ContentRelations from '../se.infomaker.contentrelations/index'
import History from '../se.infomaker.history/index'
import PublicationChannel from '../se.infomaker.infomaker.publicationchannel/index'
import DefaultvalidationPackage from '../se.infomaker.defaultvalidation/DefaultvalidationPackage'
import XImPdf from '../se.infomaker.ximpdf/index'
import XimTags from '../se.infomaker.hdsds.tags'
import Channel from '../se.infomaker.ximchannel/index'
import XImStory from '../se.infomaker.ximstory/index'

import BlockQuotePackage from '../textstyles/se.infomaker.blockquote/BlockquotePackage'
import ParagraphPackage from '../textstyles/se.infomaker.paragraph/ParagraphPackage'
import SubheadlinePackage from '../textstyles/se.infomaker.subheadline/SubheadlinePackage'
import HeadlinePackage from '../textstyles/se.infomaker.headline/HeadlinePackage'
import Madmansrow from '../textstyles/se.infomaker.madmansrow/Madmansrow'
import Drophead from '../textstyles/se.infomaker.drophead/Drophead'
import Pagedateline from '../textstyles/se.infomaker.pagedateline/Pagedateline'
import Dateline from '../textstyles/se.infomaker.dateline/Dateline'
import Preleadin from '../textstyles/se.infomaker.preleadin/Preleadin'
import Preamble from '../textstyles/se.infomaker.preamble/Preamble'
import Factbody from '../textstyles/se.infomaker.factbody/Factbody'

(() => {
    BlockQuotePackage()
    ParagraphPackage()
    SubheadlinePackage()
    HeadlinePackage()
    Madmansrow()
    Drophead()
    Pagedateline()
    Dateline()
    Preleadin()
    Preamble()
    Factbody()

    XImPlace()
    TextAnalyzer()
    XImimage()
    SocialEmbed()
    XImteaser()
    PublishFlow()
    NewsPriority()
    XImAuthor()
    YoutubeEmbed()
    ContentRelations()
    History()
    XImPdf()
    DefaultvalidationPackage()
    PublicationChannel()
    XimTags()
    Channel()
    XImStory()
})()
