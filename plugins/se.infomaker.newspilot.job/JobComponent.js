import {Component} from "substance";
import JobImagesListComponent from "./JobImagesListComponent";
import NewspilotComm from "./communication/newspilot";
import {idGenerator} from 'writer'


class JobComponent extends Component {

    constructor(...args) {
        super(...args)

        // 13980

        let comm = new NewspilotComm("52.211.173.251", "infomaker", "newspilot", this.queryUpdates);
        comm.connect().then((data) => {
            console.log('connected', data);
            const request = {
                quid: idGenerator(),
                query: '<query type="Image" version="1.1"> <structure> <entity type="Image"/> </structure> <base-query> <and> <many-to-one field="image.id" type="Image"> <eq field="job.id" type="ImageLink" value="13980"/> </many-to-one> </and> </base-query> </query>'
            };

            comm.addQuery(request.quid, request.quid, request.query)

        })

    }

    getInitialState() {
        return {
            // TODO
            jobImages: [
                {
                    name: "Cthulhu A.jpg asdflökaf löaskdf klasdfj ölaksdfj aölsdfkj aödlfk aölksfj aölsdfjk aösdfl",
                    url: "http://vignette3.wikia.nocookie.net/lovecraft/images/6/67/Cthulhu.jpg/revision/latest/zoom-crop/width/240/height/240?cb=20140818055533"
                },
                {
                    name: "Cthulhu B.jpg",
                    url: "http://vignette3.wikia.nocookie.net/lovecraft/images/9/9a/HickmanCthulhu.jpg"
                },
                {
                    name: "Cthulhu C.jpg",
                    url: "http://img05.deviantart.net/067d/i/2014/177/6/2/cthulhu_by_glooh-d7o0g9p.jpg"
                },
                {
                    name: "Some really long image name comes here... and here...",
                    url: "http://wallpaperbackgrounds.com/Content/wallpapers/fantasy/cthulhu/189583-29777.jpg"
                },
                {
                    name: "Hello",
                    url: "http://wallpapercave.com/wp/KZzyyWc.png"
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