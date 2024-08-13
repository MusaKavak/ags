import { RoundedCorner } from "../widgets/cairo_roundedcorner.js"
import { Workspaces } from "./workspaces.js";
import settings from "../settings.js";
import updateStyle from "../styling/update.js";
import indicator from "./indicator.js";
import date from "./date.js";
import system from "./system.js";
import tools from "./tools.js";
import playing from "./playing.js";

export const TopBar = Widget.Window({
    name: "bar",
    anchor: ['top', 'left', 'right'],
    exclusivity: 'exclusive',
    child: Widget.CenterBox({
        className: "bar-bg",
        startWidget: Widget.Box({
            children: [
                RoundedCorner('topleft', { className: 'corner-black', }),
                Widget.Button({
                    child: Widget.Icon({ className: "topleft-icon", css: "font-size: 1.5rem;margin-right: 10px;", icon: "arch-symbolic" }),
                    onClicked: () => App.toggleWindow("launcher"),
                    onSecondaryClick: nextWallpaper
                }),
                Workspaces()
            ]
        }),
        endWidget: Widget.Box({
            hexpand: false,
            hpack: "end",
            spacing: 10,
            children: [
                playing,
                tools,
                system,
                indicator,
                date,
                RoundedCorner('topright', { className: 'corner-black', }),
            ]
        })
    })
})


let last = ""

function nextWallpaper() {
    let wallpapers = Utils.exec(`ls ${settings.wallpaperFolderPath}`).split("\n")

    let wallpaperToSet = last

    while (wallpaperToSet == last) {
        wallpaperToSet = wallpapers[Math.round(Math.random() * wallpapers.length - 1)]
    }

    Utils.exec(`
        swww img ${settings.wallpaperFolderPath + wallpaperToSet} 
    `)

    updateStyle(settings.wallpaperFolderPath + wallpaperToSet).then(result => {
        if (result) {
            App.applyCss(App.configDir + '/style.css')
        }
    })

    last = wallpaperToSet
}

setTimeout(() => {
    Variable(0, { poll: [settings.wallpaperSwitchInterval, nextWallpaper] })
}, settings.wallpaperSwitchInterval)