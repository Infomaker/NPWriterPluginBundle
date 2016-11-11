import {Command} from 'substance'
import {api, idGenerator, lodash} from 'writer'

const isString = lodash.isString
const isArrayLike = lodash.isArrayLike

class XimimageCommand extends Command {

    constructor(...args) {
        super(...args)
    }

    getCommandState() {
        return {
            disabled: false
        }
    }

    execute(param) {

        if (this.getCommandState().disabled) {
            return false
        }

        if (isString(param)) {
            this.handleUri(param)
            return true
        }

        if (!param.type) {
            throw new Error("Unsupported drop information, missing 'type' field");
        }

        switch (param.type) {
            case 'file':
                this.createPreviewNode(param);
                break;
            // case 'newsItem':
                // this.handleNewsItem(param.data);
                // break;
            default:
                throw new Error("XimimageCommand cannot handle drop of type: " + param.type);
        }

        return true;
    }


    handleFile(file) {
        console.log("Handle file", file);
        this.createPreviewNode(file)
        // this.context.api.uploadFile(file,
        //     {
        //         allowedItemClasses: ['ninat:picture'],
        //         allowedMimeTypes: this.mimeTypes,
        //         requestHeaders: {'x-infomaker-type': 'x-im/image'}
        //     },
        //     new Observer(this));
    }

    handleFiles(files) {
        if (!isArrayLike(files)) {
            this.handleFile(files);
        } else {
            for (var i = 0; i < files.length; i++) {
                this.handleFile(files[i]);
            }
        }
    }


    // handleUri(uri) {
    //     this.context.api.uploadUri(uri, {allowedItemClasses: ['ninat:picture'], imType: 'x-im/image'},
    //         new Observer(this));
    // }


    // handleNewsItem(newsItem) {
    //     var observer = new Observer(this);
    //
    //     observer.preview(null);
    //     observer.progress(100);
    //     observer.done({dom: newsItem});
    // }

    createPreviewNode(file) {

        const ximImageNodeId = idGenerator()

        let fileNode = {
            id: idGenerator(),
            type: 'npfile',
            fileType: 'image',
            parentNodeId: ximImageNodeId,
            data: file
        }

        // let imageFileNode = api.editorSession.getDocument().nodeFactory.create('npfile', fileNode)

        api.editorSession.transaction((tx) => {
            tx.create(fileNode);
        })

        var data = {
            type: 'ximimage',
            id: ximImageNodeId,
            uuid: '',
            caption: 'Enter caption here',
            alttext: '',
            credit: '',
            alignment: '',
            width: 0,
            height: 0,
            imageFile: fileNode.id,
            knownData: Boolean(file)
        };


        api.document.insertBlockNode(data.type, data);

        api.editorSession.fileManager.sync()
            .then((data) => {
                console.log("Data", data);
            })

        return data.id;
    }


   /* updateImageForNode(dom, node) {
        var newsItem = dom.querySelector('newsItem'),
            uri = dom.querySelector('itemMeta > itemMetaExtProperty[type="imext:uri"]'),
            authors = dom.querySelectorAll('itemMeta > links > link[rel="author"]'),
            text = dom.querySelector('contentMeta > metadata > object > data > text'),
            credit = dom.querySelector('contentMeta > metadata > object > data > credit'),
            widthEl = dom.querySelector('contentMeta > metadata > object > data > width'),
            heightEl = dom.querySelector('contentMeta > metadata > object > data > height');

        var uuid = newsItem.getAttribute('guid');

        this.context.api.router.get('/api/image/url/' + uuid)
            .done(function (url) {
                node.setInitialMetaData(
                    uuid,
                    uri ? uri.attributes['value'].value : '',
                    url,
                    text ? text.textContent : '',
                    credit ? credit.textContent : '',
                    getWidthFromElement(widthEl),
                    getHeightFromElement(heightEl),
                    authors
                );

            }.bind(this))
            .error(function (error, xhr, text) {
                // TODO: Display error message
                console.error(error, xhr, text);
            }.bind(this));
    }*/

}

export default XimimageCommand