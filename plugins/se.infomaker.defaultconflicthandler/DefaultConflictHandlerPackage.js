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
            en: "",
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


