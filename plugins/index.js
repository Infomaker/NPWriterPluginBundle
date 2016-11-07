import Skeleton from './se.infomaker.skeleton/index'
import TextAnalyzer from './se.infomaker.textanalyzer/index'
import Preamble from './se.infomaker.preamble/Preamble'
import PublishFlow from './se.infomaker.publishflow/index'
import SocialEmbed from './se.infomaker.socialembed/index'
import NewsPriority from './se.infomaker.newspriority/index'
import XImteaser from './se.infomaker.ximteaser/index'
import XImimage from './se.infomaker.ximimage/index'

(() => {

    console.log("Hello")

    Skeleton()
    TextAnalyzer()
    Preamble()
    SocialEmbed()
    XImteaser()
    XImimage()
    PublishFlow()
    NewsPriority()
})()
