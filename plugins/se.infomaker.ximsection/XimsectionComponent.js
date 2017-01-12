import {Component} from 'substance'
import {event, api} from 'writer'

class XimsectionComponent extends Component {

    constructor(...args) {
        super(...args)
    }

    didMount() {
        api.events.on('ximsection', event.DOCUMENT_CHANGED, (event) => {
            if (event.data && event.data.type === 'section') {
                this.synchronize(event)
            }
        })

        // TODO: This needs to be fixed somehow. As-is it will remove on('click') event in drop down menu...
        // this.refs.dropdownButton.el.el.addEventListener('blur', () => {
        //     this.hideMenu()
        // })
    }

    /**
     * Default state before actions happens (render).
     *
     * Get initial state for section
     * @returns {object}
     */
    getInitialState() {
        let currentSection = api.newsItem.getSection(),
            sections = api.getConfigValue(
                'se.infomaker.ximsection',
                'sections'
            )

        sections.forEach((section) => {
            section.active = this.isActive(currentSection, section)
        })

        return {
            showSectionMenu: false,
            sections: sections
        }
    }


    /**
     * Render drop down "active" selected (or select... option if no section on article)
     *
     * @returns {VirtualDomElement}
     */
    render($$) {
        let el = $$('div').addClass('sc-ximsection')

        el.append([
            $$('h2').append(this.getLabel('ximsection-Sections')),
            this.renderSectionDropDown($$),
        ])

        return el
    }

    /**
     * Render drop down select for section
     */
    renderSectionDropDown($$) {
        let activeSection = null,
            dropdownButton = null

        this.state.sections.forEach((section) => {
            if (section.active) {
                activeSection = section
            }
        })

        if (!activeSection) {
            dropdownButton = $$('button').addClass('btn btn-secondary dropdown-toggle').attr({
                id: 'w-sections-main-select',
                type: 'button',
                'data-toggle': 'dropdown'
            }).append(
                this.getLabel('ximsection-Choose_section')
            )
        }
        else {
            dropdownButton = $$('button').addClass('btn btn-secondary dropdown-toggle').attr({
                id: 'w-sections-main-select',
                type: 'button',
                'data-toggle': 'dropdown'
            }).append([
                this.getSectionName(activeSection)
            ])
        }

        dropdownButton.on('click', () => {
            this.toggleMenu();
            return false
        })

        dropdownButton.ref('dropdownButton')

        let components = [dropdownButton];

        if (this.state.showSectionMenu) {
            const sectionElements = this.state.sections.map((section) => {
                return $$('div').addClass('dropdown-item').append(
                    this.getSectionName(section)
                ).on('click', () => {
                    this.selectSection(section)
                })
            })

            const sectionMenu = $$('div').addClass('dropdown-menu').append(
                sectionElements
            )
            components = [...components, sectionMenu]
        }

        return $$('div').attr({id: 'w-sections-main'}).addClass('dropdown').attr({
            'aria-labelledby': 'w-sections-main-select'
        }).append(components)
    }

    getSectionName(section) {
        let sectionName = section.name

        if (section.product) {
            // Build section name adding product name (after removing any
            // qcode prefixes) as parent to actual section name
            let qcodePrefixIndex = section.product.lastIndexOf(":")
            let productName = section.product.substr(qcodePrefixIndex + 1)

            sectionName = productName + ' / ' + sectionName
        }

        return sectionName
    }

    selectSection(section) {
        api.newsItem.updateSection('ximsection', section)

        this.synchronize()
    }

    toggleMenu() {
        this.extendState({showSectionMenu: !this.state.showSectionMenu})
    }

    // TODO: This does not work...
    hideMenu() {
        window.setTimeout(() => {
            this.extendState({showSectionMenu: false})
        }, 500)
    }

    /**
     * Synchronize UI with newsML services/sections
     */
    synchronize() {
        let currentSection = api.newsItem.getSection(),
            sections = api.getConfigValue(
                'se.infomaker.ximsection',
                'sections'
            )

        sections.forEach((section) => {
            section.active = this.isActive(currentSection, section)
        })

        this.extendState({
            showSectionMenu: false,
            sections: this.state.sections
        })
    }

    /**
     * Compare current section, i.e. section in article, to list section. If both
     * qcode and product match section is considered "active".
     *
     * @param currentSection
     * @param currentSection.qcode
     * @param currentSection.pubconstraint
     * @param configSection
     * @param configSection.qcode
     * @param configSection.product
     * @return {boolean}
     */
    isActive(currentSection, configSection) {
        if (currentSection && currentSection.qcode === configSection.qcode) {
            const pubconstraint = currentSection.pubconstraint ? currentSection.pubconstraint : ""
            const product = configSection.product ? configSection.product : ""

            console.log('pubconstraint', pubconstraint, 'product', product)
            return pubconstraint === product
        }

        return false;
    }
}

export default XimsectionComponent
