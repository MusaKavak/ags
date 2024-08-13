export default Widget.Box({
    className: "card",
    vexpand: false,
    vpack: "center",
    spacing: 10,
    children: [
        Widget.Button({
            onClicked: () => { Utils.execAsync(["grimblast", "--freeze", "copysave", "area"]) },
            child: Widget.Icon("tool-crop-symbolic")
        }),
        Widget.Separator({ orientation: 1 }),
        Widget.Button({
            onClicked: () => { Utils.execAsync(["hyprpicker", "-a"]) },
            child: Widget.Icon("color-select-symbolic")
        })
    ]
})