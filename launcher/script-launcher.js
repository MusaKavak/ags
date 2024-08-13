import grid from "../widgets/grid.js"

const file = App.configDir + "/launcher/scripts.json"

function getScripts() {
    const scripts = JSON.parse(Utils.readFile(App.configDir + "/launcher/scripts.json"))

    const menu = (script) => Widget.Menu({
        children: [
            Widget.MenuItem({
                child: Widget.Box({
                    spacing: 10,
                    children: [
                        Widget.Icon("delete-symbolic"),
                        Widget.Label("Remove")
                    ]
                }),
                onActivate: () => Utils.writeFileSync(JSON.stringify(JSON.parse(Utils.readFile(file)).filter(s => s.exec != script)), file)
            }),
        ],
    })

    return scripts.map(s => Widget.Box({
        className: "script-launcher-item",
        children: [
            Widget.Button({
                child: Widget.Box({
                    spacing: 10,
                    children: [
                        Widget.Icon({ icon: s["icon"], className: "script-launcher-icon" }),
                        Widget.Label({ truncate: 'start', label: s["exec"] })
                    ]
                }),
                onClicked: () => {
                    Utils.execAsync(['bash', '-c', s["exec"]])
                    App.closeWindow("launcher")
                },
                onSecondaryClick: (_, event) => {
                    menu(s["exec"]).popup_at_pointer(event)
                },
            })
        ]
    }))
}

export default () => Widget.Box({
    className: "script-launcher launcher-section",
    vertical: true,
    vexpand: false,
    vpack: "end",
    child: grid(getScripts(), 3),
    setup: self => {

    }
})