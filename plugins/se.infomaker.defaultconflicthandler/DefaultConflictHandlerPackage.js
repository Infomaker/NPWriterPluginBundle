import DefaultConflictHandler from "./DefaultConflictHandler";

export default {
    id: 'se.infomaker.defaultconflicthandler',
    name: 'defaultconflicthandler',
    version: '{{version}}',
    configure: (config) => {
        config.registerConflictHandler("server.conflict", DefaultConflictHandler)

        config.addLabel("conflicthandler-header", {
            en: "Whoops, it looks like someone else has made changes to the article",
            sv: "Hoppsan, det verkar som om någon annan gjort ändringar i artikeln"
        })

        config.addLabel("conflicthandler-description", {
            en: "It's not possible to save your changes, these have to be copied manually to the new version.",
            sv: "Det går inte att spara dina ändringar, dessa måste kopieras manuellt till den nya versionen."
        })

        config.addLabel("conflicthandler-commandtext", {
            en: "Click here to open the new version",
            sv: "Tryck här för att öppna den nya versionen"
        })
    }
}
