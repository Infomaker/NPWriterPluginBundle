import {Component} from 'substance'
import {api} from 'writer'
import { OpenContentClient } from '@infomaker/oc-client'
import ContentSearchComponent from './ContentSearchComponent'

class ContentRelationsMainComponent extends Component {

    didMount() {
        const relevance = { name: 'Relevans', field: false, ascending: false }
        this.extendState({ sorting: relevance, sortings: [relevance] })

        new OpenContentClient(this.state.pluginConfig.contentHost)
            .getSortings()
            .then(response => api.router.checkForOKStatus(response))
            .then(response => response.json())
            .then(({ sortings }) => {
                this.extendState({
                    sortings: [
                        relevance,
                        ...sortings.map((sorting) => {
                            return {
                                name: sorting.name,
                                field: sorting.sortIndexFields[0].indexField,
                                ascending: sorting.sortIndexFields[0].ascending
                            }
                        })
                    ]
                })
            })
            .catch((err) => {
                console.error(err)
            })
    }

    getInitialState() {
        const pluginConfig = this.props.pluginConfigObject.pluginConfigObject.data

        return {
            pluginConfig,
            sortings: [],
            client: null
        }
    }

    render($$) {
        const { sortings, sorting, pluginConfig } = this.state
        const { contentHost, propertyMap, defaultQueries, contenttype, locale, icons } = pluginConfig

        const header = $$('h2').append(this.getLabel('ContentRelations'))
        const searchComponent = $$(ContentSearchComponent, {
            contentHost,
            contenttype,
            propertyMap,
            defaultQueries,
            sorting,
            sortings,
            locale,
            icons
        }).ref('searchComponent')

        const el = $$('div')
            .addClass('content-relations-container')
            .append(header)
            .append(searchComponent)
            .ref('relationsContainer')

        return el
    }
}


export default ContentRelationsMainComponent