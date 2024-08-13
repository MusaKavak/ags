import settings from "../settings.js"

export default Widget.Box({
    hexpand: true,
    className: "rightbar-header",
    spacing: 10,
    children: [
        Widget.Icon({ className: "rightbar-header-icon large", icon: settings.distroIcon }),
        Widget.Label().hook(App, (self, windowname, visible) => {
            if (windowname == "rightbar" && visible)
                Utils.execAsync(['bash', '-c', `uptime -p | sed -e 's/...//;s/ day\\| days/d/;s/ hour\\| hours/h/;s/ minute\\| minutes/m/;s/,[^,]*//2'`])
                    .then(upTimeString => {
                        self.label = Utils.exec("hostname") + " · " + upTimeString
                    })
        }),
        Widget.Box({
            className: "rightbar-header-icon",
            hpack: "end",
            hexpand: true,
            spacing: 10,
            children: [
                Widget.Button({
                    child: Widget.Icon("system-log-out-symbolic"),
                    onClicked: () => {
                        Utils.execAsync(['bash', '-c', 'hyprctl dispatch exit'])
                    }
                }),
                Widget.Button({
                    child: Widget.Icon("system-suspend-symbolic"),
                    onClicked: () => {
                        Utils.execAsync(['bash', '-c', 'systemctl suspend'])
                    }
                }),
                Widget.Button({
                    child: Widget.Icon("system-reboot-symbolic"),
                    onClicked: () => {
                        Utils.execAsync(['bash', '-c', 'systemctl reboot'])
                    }
                }),
                Widget.Button({
                    child: Widget.Icon("system-shutdown-symbolic"),
                    onClicked: () => {
                        Utils.execAsync(['bash', '-c', 'systemctl poweroff'])
                    }
                })
            ]
        })
    ]
})