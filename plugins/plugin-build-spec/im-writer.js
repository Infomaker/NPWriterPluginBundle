import CharacterTransformation from "../se.infomaker.charactertransformation/index";
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
import PublicationChannel from "../se.infomaker.publicationchannel/index";
import MitmTags from "../se.infomaker.mitm.tags/index";
import HdsdsTags from '../se.infomaker.hdsds.tags/index';
import XimTags from '../se.infomaker.ximtags/index';
import DefaultvalidationPackage from "../se.infomaker.defaultvalidation/DefaultvalidationPackage";
import HeaderEditor from "../se.infomaker.headereditor/HeaderEditorPackage";
import XImPdf from "../se.infomaker.ximpdf/index";
import ContentProfile from "../se.infomaker.ximcontentprofile/index";
import XImStory from "../se.infomaker.ximstory/index";
import Category from "../se.infomaker.ximcategory/index";
import Channel from "../se.infomaker.ximchannel/index";
import XImSection from "../se.infomaker.ximsection/index";
import DefaultConflictHandler from "../se.infomaker.defaultconflicthandler/DefaultConflictHandlerPackage"
import FactBox from "../se.infomaker.factbox/index"
import Gender from "../se.infomaker.gender/index"

/**
 * Text styles
 */
import Drophead from "../textstyles/se.infomaker.drophead/Drophead";
import Pagedateline from "../textstyles/se.infomaker.pagedateline/Pagedateline";
import Dateline from "../textstyles/se.infomaker.dateline/Dateline";
import Preleadin from "../textstyles/se.infomaker.preleadin/Preleadin";
import Madmansrow from "../textstyles/se.infomaker.madmansrow/Madmansrow";
import Preamble from "../textstyles/se.infomaker.preamble/Preamble";
import BlockQuotePackage from "../textstyles/se.infomaker.blockquote/BlockquotePackage";
import ParagraphPackage from "../textstyles/se.infomaker.paragraph/ParagraphPackage";
import SubheadlinePackage from "../textstyles/se.infomaker.subheadline/SubheadlinePackage";
import HeadlinePackage from "../textstyles/se.infomaker.headline/HeadlinePackage";
/**
 * Enrichment
 */
import HtmlembedPackage from "../se.infomaker.htmlembed/HtmlembedPackage";
/**
 * Newspilot integration
 */
// import NewspilotJob from "../se.infomaker.newspilot.job/index";

import UATrackerIndex from '../se.infomaker.uatracker/index'

(() => {
    CharacterTransformation()
    UATrackerIndex()
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
    DefaultvalidationPackage()
    PublicationChannel()
    ContentProfile()
    XImStory()
    MitmTags()
    HdsdsTags()
    XimTags()
    Category()
    Channel()
    XImSection()
    DefaultConflictHandler()
    FactBox()
    Gender()

    // Textstyles
    BlockQuotePackage()
    ParagraphPackage()
    HeadlinePackage()
    SubheadlinePackage()
    Preleadin()
    Preamble()
    Dateline()
    Pagedateline()
    Drophead()
    Madmansrow()

    // Enrichment
    HtmlembedPackage()

    // Newspilot job
    // NewspilotJob()

})()
