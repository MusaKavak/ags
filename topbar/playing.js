const mpris = await Service.import('mpris')

const lastBus = Variable("")

export default new Widget.Button({
    className: "current-playing",
    vexpand: false,
    vpack: "center",
    onClicked: () => { mpris.getPlayer(lastBus.value).playPause() },
    onSecondaryClick: () => { mpris.getPlayer(lastBus.value).next() },
    onMiddleClick: () => { mpris.getPlayer(lastBus.value).previous() },
    child: Widget.Box({
        spacing: 10,
        children: [
            Widget.Label("eee"),
            Widget.Separator({ orientation: 1 }),
            Widget.Label("eee"),
        ]
    }).hook(mpris, self => {
        const player = mpris.players.find(p => p["play-back-status"] == "Playing")
            || mpris.players.find(p => p["bus-name"] == lastBus.value)
            || mpris.players[0]

        if (player) {
            self.children[0].label = player["track-artists"][0]
            self.children[2].label = player["track-title"]
            lastBus.value = player["bus-name"]
            self.visible = true
        } else {
            lastBus.value = ""
            self.visible = false
        }
    }, "changed")
})