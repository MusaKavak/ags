import settings from "../settings.js"

export default Widget.Button({
    child: Widget.Label({
        className: "card",
        vexpand: false,
        vpack: "center"
    }).poll(1000, self => {
        self.label = Utils.exec('date ' + settings.dateFormat)
    }),
    onClicked: () => App.toggleWindow("rightbar")
})
