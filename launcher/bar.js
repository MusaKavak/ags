const { query } = await Service.import("applications")

const input = Variable("")
let bestMatch;

function appList(filter, onPinned) {
    const apps = query(filter)
    if (apps[0]) {
        bestMatch = () => { apps[0].launch(); App.closeWindow("launcher") }
    } else bestMatch = () => { }
    return apps.map(app => Widget.Box({
        children: [
            Widget.Button({
                child: Widget.Box({
                    className: "launcher-bar-app-item",
                    spacing: 10,
                    children: [
                        Widget.Icon({ className: "launcher-bar-app-item-icon", icon: app["icon-name"] }),
                        Widget.Label({ className: "launcher-bar-app-item-label", label: app["name"], truncate: "end" }),
                    ]
                }),
                onClicked: () => { app.launch(); App.closeWindow("launcher") }
            }),
            Widget.Button({
                hpack: "end",
                hexpand: true,
                child: Widget.Icon({ className: "launcher-bar-app-item-pin", icon: "window-pin-symbolic", tooltip_text: "Pin" }),
                onClicked: () => {
                    pinApp(app)
                    setTimeout(() => {
                        onPinned()
                    }, 100);
                }
            })
        ]
    })
    )
}

export default (
    onPinned
) => Widget.Box({
    className: "launcher-bar launcher-section",
    hexpand: false,
    hpack: "center",
    vertical: true,
    children: [
        Widget.Entry({
            className: "launcher-bar-entry",
            hexpand: true,
            placeholder_text: "Search",
            on_accept: () => { bestMatch() },
            on_change: ({ text }) => input.value = text,
        }).hook(App, (self, visible) => {
            if (visible) {
                self.text = ""
                self.grab_focus()
            }
        }), ,
        Widget.Scrollable({
            hscroll: "never",
            vscroll: "always",
            className: "launcher-bar-scroll",
            child: Widget.Box({
                vertical: true,
                children: []
            })
        }).hook(input, self => {
            self.visible = input.value.length > 0
            if (self.visible) {
                self.child.child.children = appList(input.value, onPinned)
            }
        })
    ]
})

function pinApp(application) {
    const apps = JSON.parse(Utils.readFile(App.configDir + "/launcher/pinned.json"))
    apps.push({
        name: application["name"],
        icon: application["icon-name"],
        exec: application["executable"]
    })

    Utils.writeFile(JSON.stringify(apps, null, 4), App.configDir + "/launcher/pinned.json")
}