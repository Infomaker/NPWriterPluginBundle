import JobComponent from './JobComponent'
import './scss/job.scss'

export default {
    id: 'se.infomaker.newspilot.job',
    name: 'npjob',

    configure: function (config) {
        config.addSidebarTab('npjob', 'Newspilot Jobb')

        config.addComponentToSidebarWithTabId('npjob', 'npjob', JobComponent)
    }
}
