import {Component} from 'substance'

class ArticleDisplayComponent extends Component {

    getInitialState() {
        return {
            article: this.props.articles[this.props.articles.length - 1],
        }
    }

    didMount() {
    }

    updateArticle(article) {
        this.extendState({article: article})
    }

    render($$) {

        if (window.DOMParser) {
            const articleContent = $$('div').addClass('article-content')

            const parser = new DOMParser()
            const doc = parser.parseFromString(this.state.article.src, "application/xml")
            let elements = doc.querySelectorAll(
                'newsItem > contentSet > inlineXML > idf > group > element, newsItem > contentSet > inlineXML > idf > group > object');
            elements.forEach(
                (element) => articleContent.append(this.getComponentForElement($$, element))
            )

            let textlength = doc.querySelector(
                'newsItem > contentSet > inlineXML > idf').textContent.length;
            const characterCount = $$('div')
                .append(`${this.getLabel('se.intomaker.history-charactercount.label')}: ${textlength}`)

            return $$('div')
                .append([
                    articleContent,
                    characterCount
                ]);

        } else {
            return $$('div').append("No article preview available")
        }

    }

    getComponentForElement($$, element) {

        let name = element.localName;

        if (name === 'element') {
            return $$('div')
                .addClass(`sc-${element.getAttribute('type')}`)
                .append(element.textContent)
        } else if (name === 'object') {
            return $$('div')
                .addClass('object-content')
                .append(element.getAttribute('type'))
        }

        return $$('p').append('Unhandled element: ' + name)
    }
}

export default ArticleDisplayComponent