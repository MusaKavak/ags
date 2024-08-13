import bluetooth from "./bluetooth.js";
import header from "./header.js";
import mixer from "./mixer.js";
import network from "./network.js";
import { Media } from "./media.js";

export default () => Widget.Window({
    name: "rightbar",
    visible: false,
    layer: 'overlay',
    anchor: ['right', 'top', "bottom"],
    margins: [5],
    child: Widget.CenterBox({
        vertical: true,
        className: "rightbar",
        startWidget: Widget.Box({
            vpack: "start",
            spacing: 10,
            vertical: true,
            children: [
                header,
                mixer,
                network
                // bluetooth
            ],
        }),
        endWidget: Media()
    }).keybind("Escape", () => App.closeWindow("rightbar"))

})
