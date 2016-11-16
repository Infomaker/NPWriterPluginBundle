import Skeleton from './se.infomaker.skeleton/index'
import TextAnalyzer from './se.infomaker.textanalyzer/index'
import Preamble from './se.infomaker.preamble/Preamble'
import PublishFlow from './se.infomaker.publishflow/index'
import SocialEmbed from './se.infomaker.socialembed/index'
import NewsPriority from './se.infomaker.newspriority/index'
import XImteaser from './se.infomaker.ximteaser/index'
import XImimage from './se.infomaker.ximimage/index'
import XImPlace from './se.infomaker.ximplace/index'
import XImAuthor from './se.infomaker.ximauthor/index'
import Madmansrow from './se.infomaker.madmansrow/Madmansrow'
import Drophead from './se.infomaker.drophead/Drophead'
import Pagedateline from './se.infomaker.pagedateline/Pagedateline'
import Dateline from './se.infomaker.dateline/Dateline'
import Preleadin from './se.infomaker.preleadin/Preleadin'
import YoutubeEmbed from './se.infomaker.youtubeembed/index'
import ContentRelations from './se.infomaker.contentrelations/index'

(() => {

    XImPlace()
    Skeleton()
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
    XImAuthor()
    YoutubeEmbed()
    ContentRelations()
})()
