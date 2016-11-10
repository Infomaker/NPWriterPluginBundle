import Skeleton from './se.infomaker.skeleton/index'
import TextAnalyzer from './se.infomaker.textanalyzer/index'
import Preamble from './se.infomaker.preamble/Preamble'
import PublishFlow from './se.infomaker.publishflow/index'
import SocialEmbed from './se.infomaker.socialembed/index'
import NewsPriority from './se.infomaker.newspriority/index'
import XImteaser from './se.infomaker.ximteaser/index'
import XImimage from './se.infomaker.ximimage/index'
import XImPlace from './se.infomaker.ximplace/index'

(() => {

    XImPlace()
    Skeleton()
    TextAnalyzer()
    Preamble()
    SocialEmbed()
    XImteaser()
    XImimage()
    PublishFlow()
    NewsPriority()
})()
