const bl = await Service.import('bluetooth')
const active = Variable(bl.enabled)

export default Widget.Box({
    vertical: true,
    children: [
        Widget.EventBox({
            child: Widget.Box({
                spacing: 10,
                children: [
                    Widget.Icon("bluetooth-symbolic"),
                    Widget.Label("Bluetooth"),
                    Widget.Switch({ hpack: "end" }),
                    Widget.Icon("arrow-down")
                ]
            }),
            onPrimaryClick: () => {
                active.value = !active.value
                bl.enabled = active.value
            }
        }),
    ]
})