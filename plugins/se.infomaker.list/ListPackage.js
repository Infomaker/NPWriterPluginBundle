import ListNode from './nodes/ListNode'
import ListItemNode from './nodes/ListItemNode'
import ListComponent from './components/ListComponent'
import ListItemComponent from './components/ListItemComponent'
import ListHTMLConverter from './converters/ListHTMLConverter'
import ListItemHTMLConverter from './converters/ListItemHTMLConverter'

import InsertListTool from './InsertListTool'

import ToggleListCommand from './commands/ToggleListCommand'
import IndentListCommand from './commands/IndentListCommand'

import './scss/imlist.scss'

export default {
    name: 'list',
    id: 'se.infomaker.list',
    configure: function (config) {
        config.addNode(ListNode)
        config.addNode(ListItemNode)
        config.addComponent('list', ListComponent)
        config.addComponent('list-item', ListItemComponent)
        config.addConverter('html', ListHTMLConverter)
        config.addConverter('html', ListItemHTMLConverter)

        config.addContentMenuTopTool('toggle-unordered-list', InsertListTool)

        config.addCommand('toggle-unordered-list', ToggleListCommand, {
            spec: { listType: 'bullet' },
            commandGroup: 'list'
        })
        config.addLabel('toggle-unordered-list', {
            sv: 'Punktlista',
            en: 'Toggle list',
            de: 'Liste entfernen'
        })
        config.addIcon('toggle-unordered-list', { 'fontawesome': 'fa-list-ul' })

        config.addCommand('toggle-ordered-list', ToggleListCommand, {
            spec: { listType: 'order' },
            commandGroup: 'list'
        })
        config.addLabel('toggle-ordered-list', {
            sv: 'Numrerad lista',
            en: 'Toggle list',
            de: 'Aufzählung entfernen'
        })
        config.addIcon('toggle-ordered-list', { 'fontawesome': 'fa-list-ol' })

        config.addCommand('indent-list', IndentListCommand, {
            spec: { action: 'indent' },
            commandGroup: 'list'
        })
        config.addLabel('indent-list', {
            sv: 'Öka indraget',
            en: 'Increase indentation',
            de: 'Einrückung vergrößern'
        })
        config.addIcon('indent-list', { 'fontawesome': 'fa-indent' })

        config.addCommand('dedent-list', IndentListCommand, {
            spec: { action: 'dedent' },
            commandGroup: 'list'
        })
        config.addLabel('dedent-list', {
            sv: 'Minska indraget',
            en: 'Decrease indentation',
            de: 'Einrückung verringern'
        })
        config.addIcon('dedent-list', { 'fontawesome': 'fa-dedent' })
    }
}
