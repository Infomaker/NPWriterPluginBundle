import DefaultConflictHandler from "./DefaultConflictHandler";
const {registerPlugin} = writer

const conflictHandlerPackage = {
    id: 'se.infomaker.defaultconflicthandler',
    name: 'defaultconflicthandler',

    configure: (config) => {
        config.registerConflictHandler("server.conflict", DefaultConflictHandler)

        config.addLabel("conflicthandler-header", {
            en: "The article cannot be saved",
            sv: "Det går inte att spara artikeln"
        })

        config.addLabel("conflicthandler-description", {
            en: "The article has been updated by someone else your changes must be copied manually.",
            sv: "Artikeln har uppdaterats av någon annan och dina ändringar måste kopieras manuellt."
        })

        config.addLabel("conflicthandler-commandtext", {
            en: "Click here to open the most recent article in a new window",
            sv: "Tryck här för att öppna den senast sparade artikeln"
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


