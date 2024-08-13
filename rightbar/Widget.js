Widget.Button({
    className: "switcher-box",
    hpack: "fill",
    hexpand: true,
    child: Widget.Box({
        hpack: "center",
        vertical: true,
        spacing: 10,
        children: [
            Widget.Icon("network-wired-symbolic"),
            Widget.Label("Wired")
        ]
    }),
    onClicked: () => {
        if (wiredStatus.value == "connected") {
            Utils.exec("nmcli d down eno1")
        }
        if (wiredStatus.value == "disconnected") {
            Utils.exec("nmcli d up eno1")
        }
    }
})


Widget.Button({
    className: "switcher-box",
    hpack: "fill",
    hexpand: true,
    child: Widget.Box({
        hpack: "center",
        vertical: true,
        spacing: 10,
        children: [
            Widget.Icon("network-wireless-signal-none-symbolic"),
            Widget.Label("Wi-Fi")
        ]
    }),
    onClicked: () => {
        if (wirelessStatus.value == "unavailable") {
            Utils.exec("nmcli r wifi on")
        } else {
            Utils.exec("nmcli r wifi off")
        }
    }
}).hook(wirelessStatus, self => {
    const s = wirelessStatus.value
    self.child.children[1].label = s
    self.toggleClassName("switcher-box-active", s != "unavailable")
})