import grid from "../widgets/grid.js"
import bar from "./bar.js"
import scripts from "./script-launcher.js"

const file = App.configDir + "/launcher/pinned.json"

function removePinned(app) {
    Utils.writeFileSync(JSON.stringify(JSON.parse(Utils.readFile(file)).filter(a => a.name != app), null, 4), file)
}

function pinnedApps() {
    const menu = (app) => Widget.Menu({
        children: [
            Widget.MenuItem({
                child: Widget.Box({
                    spacing: 10,
                    children: [
                        Widget.Icon("delete-symbolic"),
                        Widget.Label("Remove")
                    ]
                }),
                onActivate: () => removePinned(app)
            }),
        ],
    })

    const apps = JSON.parse(Utils.readFile(App.configDir + "/launcher/pinned.json"))
    return apps.map(app => {
        return Widget.Button({
            child: Widget.Icon({ className: "pinned-app-icon", icon: app["icon"], "tooltip-text": app["name"] }),
            onClicked: () => {
                Utils.execAsync(['bash', '-c', app["exec"]])
                App.closeWindow("launcher")
            },
            onSecondaryClick: (_, event) => {
                menu(app.name).popup_at_pointer(event)
            },
        })
    })
}

export default () => Widget.Window({
    name: "launcher",
    anchor: [],
    keymode: 'exclusive',
    visible: false,
    child: Widget.Box({
        className: "launcher",
        vertical: true,
        spacing: 10,
        children: [
            Widget.Box({
                spacing: 10,
                children: [
                    Widget.Box({
                        className: "launcher-section pinned-apps",
                        vexpand: false,
                        vpack: "end",
                        setup: self => {
                            self.child = grid(pinnedApps(), 7)
                        }
                    }),
                    scripts()
                ]
            })
        ],
        setup: self => {
            self.children = self.children.concat(
                bar(() => {
                    self.children[0].children[0].child = grid(pinnedApps(), 7)
                })
            )
        }
    })
}).keybind("Escape", () => App.closeWindow("launcher"))

