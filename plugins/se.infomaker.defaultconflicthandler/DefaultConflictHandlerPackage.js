import DefaultConflictHandler from "./DefaultConflictHandler";
const {registerPlugin} = writer

const conflictHandlerPackage = {
    id: 'se.infomaker.defaultconflicthandler',
    name: 'defaultconflicthandler',

    configure: (config) => {
        config.registerConflictHandler("server.conflict", DefaultConflictHandler)

        config.addLabel("conflicthandler-header", {
            en: "There appeared a conflict while saving the document",
            sv: "Det uppstod en konflikt när dokumentet skulle sparas"
        })

        config.addLabel("conflicthandler-description", {
            en: "The article has been updated by someone else and the conflicting changes has to be resolved.",
            sv: "Artikeln har uppdaterats av någon annan och de ändringar som gjorts måste påföras manuellt."
        })

        config.addLabel("conflicthandler-commandtext", {
            en: "Click here to open article on server in a new window",
            sv: "Tryck här för att öppna artikeln från servern i ett nytt fönster"
        })
    }
}


export default () => {
    if (registerPlugin) {
        registerPlugin(conflictHandlerPackage)
    } else {
        console.info("Register method not yet available");
    }
}


