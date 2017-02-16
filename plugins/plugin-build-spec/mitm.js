import TextAnalyzer from '../se.infomaker.textanalyzer/index'
import Preamble from '../textstyles/se.infomaker.preamble/Preamble'
import PublishFlow from '../se.infomaker.publishflow/index'
import SocialEmbed from '../se.infomaker.socialembed/index'
import NewsPriority from '../se.infomaker.newspriority/index'
import XImteaser from '../se.infomaker.ximteaser/index'
import XImimage from '../se.infomaker.ximimage/index'
import XImPlace from '../se.infomaker.ximplace/index'
import XImAuthor from '../se.infomaker.ximauthor/index'
import Madmansrow from '../textstyles/se.infomaker.madmansrow/Madmansrow'
import Drophead from '../textstyles/se.infomaker.drophead/Drophead'
import Pagedateline from '../textstyles/se.infomaker.pagedateline/Pagedateline'
import Dateline from '../textstyles/se.infomaker.dateline/Dateline'
import Preleadin from '../textstyles/se.infomaker.preleadin/Preleadin'
import YoutubeEmbed from '../se.infomaker.youtubeembed/index'
import ContentRelations from '../se.infomaker.contentrelations/index'
import History from '../se.infomaker.history/index'
import PublicationChannel from '../se.infomaker.infomaker.publicationchannel/index'
import DefaultvalidationPackage from '../se.infomaker.defaultvalidation/DefaultvalidationPackage'
import HeaderEditor from '../se.infomaker.headereditor/HeaderEditorPackage'
import MitmTags from '../se.infomaker.mitm.tags'

(() => {

    XImPlace('position')
    XImPlace('polygon')
    TextAnalyzer()
    Preleadin()
    Preamble()
    Dateline()
    Pagedateline()
    Drophead()
    Madmansrow()
    XImimage()
    SocialEmbed()
    XImteaser()
    PublishFlow()
    NewsPriority()
    HeaderEditor()
    XImAuthor()
    YoutubeEmbed()
    ContentRelations()
    History()
    DefaultvalidationPackage()
    PublicationChannel()
    MitmTags()

})()
