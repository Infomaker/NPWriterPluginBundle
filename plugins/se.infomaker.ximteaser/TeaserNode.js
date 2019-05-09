import {Container} from 'substance'
import {api, withTraits, traitBundle, fetchImageMeta} from 'writer'

const {imageNodeTrait, imageCropTrait} = traitBundle

class TeaserNode extends withTraits(Container, imageNodeTrait, imageCropTrait) {

    /**
     * Triggers after an image has finished uploading
     *
     * @returns {*|PromiseLike<T>|Promise<T>}
     */
    onImageUploaded() {
        const imageFile = this.getImageFile()
        if (imageFile) {
            return fetchImageMeta(imageFile.uuid)
                .then((node) => {
                    api.editorSession.transaction((tx) => {
                        tx.set([this.id, 'imageUuid'], node.uuid)
                        tx.set([this.id, 'uri'], node.uri)
                        tx.set([this.id, 'width'], node.width)
                        tx.set([this.id, 'height'], node.height)
                    })
                })
        }
    }

    addRelatedArticle(article, tx = null) {
        const teaserTypes = api.getConfigValue('se.infomaker.ximteaser', 'types', [])
        const currentType = teaserTypes.find(({type}) => type === this.dataType)
        const relatedArticlesEnabled = currentType.enableRelatedArticles === true

        if (!relatedArticlesEnabled) {
            return
        }

        const articles = Array.isArray(this.relatedArticles) ? this.relatedArticles.slice() : []
        const articleAlreadyPresent = articles.filter(a => a.uuid === article.uuid).length > 0
        const isSameArticle = article.uuid === api.newsItem.getGuid()
        const notificationTitle = api.getLabel('teaser-related-article-not-added')

        if (articleAlreadyPresent) {
            const message = api.getLabel('teaser-related-article-already-added')
                .replace('{title}', article.title)

            return api.ui.showNotification(this.type, notificationTitle, message)
        }

        if (isSameArticle) {
            const message = api.getLabel('teaser-related-article-is-self')
                .replace('{title}', article.title)

            return api.ui.showNotification(this.type, notificationTitle, message)
        }

        articles.push(article)

        if (tx) {
            tx.set([this.id, 'relatedArticles'], articles)
        } else {
            api.editorSession.transaction(tx => {
                tx.set([this.id, 'relatedArticles'], articles)
            })
        }
    }

    removeRelatedArticle(uuid, tx = null) {
        const articles = Array.isArray(this.relatedArticles) ? this.relatedArticles.slice() : []
        const remainingArticles = articles.filter(article => article.uuid !== uuid)

        if (tx) {
            tx.set([this.id, 'relatedArticles'], remainingArticles)
        } else {
            api.editorSession.transaction(tx => {
                tx.set([this.id, 'relatedArticles'], remainingArticles)
            })
        }
    }
}

TeaserNode.define({
    type: 'ximteaser',
    dataType: {type: 'string', optional: false},
    imageFile: {type: 'file', optional: true},
    uuid: {type: 'string', optional: true},
    imageUuid: {type: 'string', optional: true},
    uri: {type: 'string', optional: true},

    title: {type: 'text', optional: false, default: ''},
    subject: {type: 'string', optional: false, default: ''},
    text: {type: 'string', optional: false, default: ''},

    customFields: {type: 'object', optional: false, default: {}},

    relatedArticles: {type: 'array', optional: true, default: []},

    width: {type: 'number', optional: true},
    height: {type: 'number', optional: true},
    crops: {type: 'object', default: []},
    disableAutomaticCrop: {type: 'boolean', optional: true, default: false}
})

export default TeaserNode
