export default Widget.Box({
    className: "card",
    vexpand: false,
    vpack: "center",
    spacing: 10,
    children: [
        Widget.Box({
            spacing: 5,
            children: [
                Widget.Icon("jockey-symbolic"),
                Widget.Label(),
            ]
        }),
        Widget.Separator({ orientation: 1 }),
        Widget.Box({
            spacing: 5,
            children: [
                Widget.Icon("nvidia-ram-symbolic"),
                Widget.Label(),
            ]
        })
    ]
}).poll(5000, async (self) => {
    self.children[2].children[1].label = Utils.exec(`bash -c "free | grep Mem | awk '{print int($3/$2 * 100.0)}'"`) + "%"
    self.children[0].children[1].label = await Utils.execAsync(["bash", "-c", `top -bn2 | awk '/^%Cpu/ {print 100 - $8}' | tail -n1`]) + "%"
})