import JobComponent from './JobComponent'
import './scss/job.scss'

export default {
    id: 'se.infomaker.newspilot.job',
    name: 'npjob',

    configure: function (config) {
        config.addSidebarTab('npjob', 'Newspilot Jobb')

        config.addComponentToSidebarWithTabId('npjob', 'npjob', JobComponent)

        config.addLabel('Images', {
            sv: 'Bilder'
        })

        config.addLabel('Image information', {
            sv: 'Bildinformation'
        })

        config.addLabel('Created', {
            sv: 'Skapad'
        })

        config.addLabel('Photographer', {
            sv: 'Fotograf'
        })

        config.addLabel('Proposed caption', {
            sv: 'Bildtextförslag'
        })

        config.addLabel('Article not linked with Newspilot', {
            sv: 'Artikeln är inte länkad till Newspilot'
        })


        config.addIcon('login', {'fontawesome': 'fa-sign-in'})
        config.addIcon('warning', {'fontawesome': 'fa-warning'})
    }
}
