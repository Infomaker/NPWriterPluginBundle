import {Component} from 'substance'
import {api} from 'writer'
import SearchResult from './ContentSearchResultComponent'

class ContentSearchComponent extends Component {

    getInitialState() {
        return {
            query: "",
            results: []
        }
    }

    render($$) {
        const el = $$('div').addClass('content_relations');

        const searchForm = $$('form').addClass('clearfix')
            .on('submit', this.search.bind(this)).ref('form');
        searchForm.append($$('input').attr({type: 'submit', style: 'display:none'}));

        const searchInput = $$('input')
            .addClass('form-control search__query col-xs-9')
            .ref('queryInput')
            .attr('placeholder', this.getLabel('Enter query'));

        const searchButton = $$('button')
            .addClass('sc-np-btn btn btn-neutral col-xs-3')
            .append(this.getLabel('Search'))
            .on('click', this.search.bind(this))
            .ref('serchButton');

        searchForm.append([searchInput, searchButton]);


        el.append(searchForm);


        const results = $$(SearchResult, {results: this.state.results, query: this.state.query});
        el.append(results);


        return el;
    }

    search(e) {
        e.preventDefault();

        const query = this.refs.queryInput.val();

        api.router.get('/api/search/concepts/articles?q='+query)
            .then(reponse => api.router.checkForOKStatus(reponse))
            .then(response => response.json())
            .then(json => {
                this.setState({
                    query: query,
                    results: json
                });
            })
            .catch(() => {
            })

    }
}

export default ContentSearchComponent
