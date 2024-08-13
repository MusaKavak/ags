const wiredStatus = Variable("disconnected")
const wirelessStatus = Variable("unavailable")
const wirelessNetworks = Variable([])

function toggleSection() {
    return Widget.Box({
        className: "network-toggle",
        spacing: 10,
        vertical: true,
        children: [
            Widget.Box({
                spacing: 10,
                children: [
                    Widget.Icon("network-wired-symbolic"),
                    Widget.Label(),
                    Widget.Button({
                        hpack: "end",
                        hexpand: true,
                        onClicked: () => {
                            if (wiredStatus.value == "connected") {
                                Utils.exec("nmcli d down eno1")
                            }
                            if (wiredStatus.value == "disconnected") {
                                Utils.exec("nmcli d up eno1")
                            }
                        },
                        child: Widget.Switch()
                    })
                ]
            }).hook(wiredStatus, self => {
                const s = wiredStatus.value
                self.children[1].label = s.charAt(0).toUpperCase() + s.slice(1)
                self.children[2].child.active = s == "connected"
                self.children[2].child.toggleClassName("active", s == "connected")
            }),
            Widget.Box({
                spacing: 10,
                children: [
                    Widget.Icon("network-wireless-signal-none-symbolic"),
                    Widget.Label(),
                    Widget.Button({
                        hpack: "end",
                        hexpand: true,
                        onClicked: () => {
                            if (wirelessStatus.value == "unavailable") {
                                Utils.exec("nmcli r wifi on")
                            } else {
                                Utils.exec("nmcli r wifi off")
                            }
                        },
                        child: Widget.Switch()
                    })
                ]
            }).hook(wirelessStatus, self => {
                const s = wirelessStatus.value
                self.children[1].label = s.charAt(0).toUpperCase() + s.slice(1)
                self.children[2].child.active = s != "unavailable"
                self.children[2].child.toggleClassName("active", s != "unavailable")
            }),
        ]
    })
}

function wirelessDetails() {
    return Widget.Box({
        className: "wireless-details",
        vertical: true,
        children: [
            Widget.Button({
                hpack: "end",
                child: Widget.Icon({ icon: "reload3", tooltip_text: "Scan" }),
                attribute: {
                    scan: () => {
                        console.log("networks")
                        const networkList = Utils.exec("nmcli -f IN-USE,BSSID,SSID,SIGNAL d wifi list --rescan yes").split("\n")

                        const networks = []

                        for (let i = 1; i < networkList.length; i++) {
                        }
                    }
                },
                onClicked: self => self.attribute.scan()
            })
        ]
    })
}

export default Widget.Box({
    className: "network-box",
    vertical: true,
    spacing: 10,
    children: [
        toggleSection(),
    ],
    attribute: {
        startMonitor: () => {
            const currentState = Utils.exec("nmcli -f device,state d").split("\n")

            const wired = currentState.find(s => s.includes("eno1"))
            const wireless = currentState.find(s => s.includes("wlan0"))

            wiredStatus.setValue(wired.replace("eno1", "").replace(/\(.*?\)/, "").trim())
            wirelessStatus.setValue(wireless.replace("wlan0", "").replace(/\(.*?\)/, "").trim())


            const proc = Utils.subprocess(
                ['bash', '-c', 'nmcli m'],
                (output) => {
                    if (output.includes("eno1")) {
                        wiredStatus.value = output.replace("eno1:", "").replace(/\(.*?\)/, "").trim()
                    }
                    if (output.includes("wlan0") && !output.includes("p2p")) {
                        wirelessStatus.value = output.replace("wlan0:", "").replace(/\(.*?\)/, "").trim()
                    }
                },
                (err) => console.log(err),
            )
        }
    },
    setup: self => self.attribute.startMonitor()
})