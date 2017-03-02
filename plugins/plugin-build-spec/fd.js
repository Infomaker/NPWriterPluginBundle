import CharacterTransformation from "../se.infomaker.charactertransformation/index";
import PublishFlow from '../se.infomaker.publishflow/index'
import SocialEmbed from '../se.infomaker.socialembed/index'
import XImimage from '../se.infomaker.ximimage/index'
import YoutubeEmbed from '../se.infomaker.youtubeembed/index'
import History from '../se.infomaker.history/index'
import HeaderEditor from '../se.infomaker.headereditor/HeaderEditorPackage'
import XImPdf from '../se.infomaker.ximpdf/index'

import HeadlinePackage from '../textstyles/se.infomaker.headline/HeadlinePackage'
import Preamble from '../textstyles/se.infomaker.preamble/Preamble'
import SubheadlinePackage from '../textstyles/se.infomaker.subheadline/SubheadlinePackage'
import ParagraphPackage from '../textstyles/se.infomaker.paragraph/ParagraphPackage'
(() => {
    // TODO Remove when their version if finished
    PublishFlow()
    CharacterTransformation()

    HeadlinePackage()
    Preamble()
    SubheadlinePackage()
    ParagraphPackage()

    XImimage()
    SocialEmbed()
    HeaderEditor()
    YoutubeEmbed()
    History()
    XImPdf()

})()
