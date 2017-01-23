import {Component} from "substance";
import JobImagesListComponent from "./JobImagesListComponent";
import {idGenerator} from "writer";


class JobComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    getInitialState() {
        return {
            // TODO
            jobImages: [
                {
                    name: "Cthulhu-image.jpg",
                    url: "http://vignette3.wikia.nocookie.net/lovecraft/images/6/67/Cthulhu.jpg/revision/latest/zoom-crop/width/240/height/240?cb=20140818055533",
                    created: "2017-01-10T10:26:00Z",
                    photographer: "Jane & John Doe",
                    proposedCaption: "Nnnli'hee hai h''fhalma orr'e Hasturoth Hastur hai hrii n'ghftoth naflnw."
                },
                {
                    name: "UnknownBeast.jpg",
                    url: "http://vignette3.wikia.nocookie.net/lovecraft/images/9/9a/HickmanCthulhu.jpg",
                    created: "2017-01-01T12:29:00Z",
                    proposedCaption: "Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn. Tsathoggua phlegeth ooboshu stell'bsna f'uaaah, shtunggli li'heeagl wgah'n h'mnahn' ch' stell'bsna uln mg. Y'hahog y-nglui ph'hlirgh kadishtuoth shogg hupadgh 'bthnk ch' y'hah, phlegeth cgrah'n kadishtu ilyaa phlegeth n'gha cs'uhn ebunma y'hah, goka y'hah 'fhalma chtenff uln hafh'drn ilyaa. Ph'n'gha nglui y-ep ep 'bthnk nafly'hah li'hee n'ghft nilgh'ri, ftaghu lloig mg throd kadishtu Hastur y-ep kn'a, sll'ha orr'e f'sll'ha 'ainyth cvulgtm chtenff kn'a. H'gof'nn nog n'gha vulgtm zhro uh'e cphlegeth shogg grah'n mg r'luhyar gotha hai, n'ghft mnahn' n'gha ya kadishtu ph'ah Cthulhu shtunggli mnahn' r'luh."
                },
                {
                    name: "this_is_a_really_looong_filename_right_would_you_not_agree.jpg",
                    url: "http://img05.deviantart.net/067d/i/2014/177/6/2/cthulhu_by_glooh-d7o0g9p.jpg",
                    created: "2017-01-10T10:26:00Z",
                    photographer: "Freddy Benson",
                    proposedCaption: ""
                },
                {
                    name: "image.jpg",
                    url: "http://wallpaperbackgrounds.com/Content/wallpapers/fantasy/cthulhu/189583-29777.jpg",
                    photographer: "Christy Chris"
                },
                {
                    name: "Name of image",
                    url: "http://wallpapercave.com/wp/KZzyyWc.png",
                    created: "2017-01-10T10:26:00Z",
                    photographer: "Steve Harris",
                    proposedCaption: "R'luh ron vulgtlagln nalw'nafh."
                }
            ]
        }
    }

    _onDragStart(e) {
        e.stopPropagation()
    }

    queryUpdates(query, events) {
        console.log(query, events)
    }

    initGateway() {
        // 13980


        return new NPCallback("infomaker", "newspilot", {urlEndpoint: 'http://www.infomaker.se', server:'52.211.173.251', port:8080, nameProperty:'', idProperty:'id', createdProperty: 'created', captionProperty: ''})

    }

    render($$) {
        const el = $$('div').addClass('npjob')

        const imageList = $$(JobImagesListComponent, {
            jobImages: this.state.jobImages
        }).ref('imageList')

        el.append($$('h2').append(this.getLabel('Images')))
        el.append(imageList)

        return el;
    }
}

export default JobComponent