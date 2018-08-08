import JobComponent from "./JobComponent";
import "./scss/job.scss";

export default {
    id: 'se.infomaker.newspilot.job',
    name: 'npjob',
    version: '{{version}}',
    configure: function (config, pluginConfig) {

        config.addLabel('Newspilot Job', {
            sv: 'Newspilot Jobb'
        })

        config.addToSidebar('Newspilot Job', pluginConfig, JobComponent)

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

        config.addLabel('Invalid username or password', {
            sv: 'Felaktigt användarnamn eller lösenord'
        })

        config.addLabel('user', {
            en: 'Username',
            sv: 'Användarnamn'
        })

        config.addLabel('password', {
            en: 'Password',
            sv: 'Lösenord'
        })

        config.addLabel('An error has occurred', {
            sv: 'Ett fel har inträffat'
        })

        config.addLabel('Login required', {
            sv: 'Inloggning krävs'
        })

        config.addLabel('Article not linked with Newspilot', {
            en: 'The article is not linked with Newspilot',
            sv: 'Artikeln är inte länkad med Newspilot'
        })

        config.addLabel('Please login', {
            sv: 'Vänligen logga in'
        })

        config.addLabel('Logging in, please wait', {
            sv: 'Loggar in, vänligen vänta'
        })

        config.addLabel('unsupported-format', {
            en: 'Unsupported image format in the Writer',
            sv: 'Bildformatet stödjs inte av Writer'
        })

        config.addIcon('reload', {'fontawesome': 'fa-refresh'})
    }
}
