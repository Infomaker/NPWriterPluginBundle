import TextAnalyzer from "../se.infomaker.textanalyzer/index";
import PublishFlow from "../se.infomaker.publishflow/index";
import SocialEmbed from "../se.infomaker.socialembed/index";
import NewsPriority from "../se.infomaker.newspriority/index";
import XImteaser from "../se.infomaker.ximteaser/index";
import XImimage from "../se.infomaker.ximimage/index";
import XImPlace from "../se.infomaker.ximplace/index";
import XImAuthor from "../se.infomaker.ximauthor/index";
import YoutubeEmbed from "../se.infomaker.youtubeembed/index";
import ContentRelations from "../se.infomaker.contentrelations/index";
import History from "../se.infomaker.history/index";
import ChannelSelector from "../se.infomaker.hdsds.channelselector/index";
import PublicationChannel from "../se.infomaker.mitm.publicationchannel/index";
import MitmTags from "../se.infomaker.mitm.tags/index";
import XimTags from "../se.infomaker.tags/index";
import HeaderEditor from "../se.infomaker.headereditor/index";
import XImPdf from "../se.infomaker.ximpdf/index";
import ContentProfile from "../se.infomaker.ximcontentprofile/index";
import XImStory from "../se.infomaker.ximstory/index";
import Category from "../se.infomaker.ximcategory/index";
import Channel from "../se.infomaker.ximchannel/index";
import XImSection from "../se.infomaker.ximsection/index";
/**
 * Text styles
 */
import Drophead from "../textstyles/se.infomaker.drophead/Drophead";
import Pagedateline from "../textstyles/se.infomaker.pagedateline/Pagedateline";
import Dateline from "../textstyles/se.infomaker.dateline/Dateline";
import Preleadin from "../textstyles/se.infomaker.preleadin/Preleadin";
import Madmansrow from "../textstyles/se.infomaker.madmansrow/Madmansrow";
import Preamble from "../textstyles/se.infomaker.preamble/Preamble";
import BlockQuote from "../textstyles/se.infomaker.blockquote/index";
import Paragraph from "../textstyles/se.infomaker.paragraph/index";
import Subheadline from "../textstyles/se.infomaker.subheadline/index";
import Headline from "../textstyles/se.infomaker.headline/index";
/**
 * Enrichment
 */
import Htmlembed from "../se.infomaker.htmlembed/index";
/**
 * Newspilot integration
 */
// import NewspilotJob from "../se.infomaker.newspilot.job/index";


(() => {

    XImPlace()
    TextAnalyzer()
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
    XImPdf()
    ChannelSelector()
    PublicationChannel()
    ContentProfile()
    XImStory()
    MitmTags()
    XimTags()
    Category()
    Channel()
    XImSection()

    // Textstyles
    BlockQuote()
    Paragraph()
    Headline()
    Subheadline()
    Preleadin()
    Preamble()
    Dateline()
    Pagedateline()
    Drophead()
    Madmansrow()

    // Enrichment
    Htmlembed()

    // Newspilot job
    // NewspilotJob()

})()
