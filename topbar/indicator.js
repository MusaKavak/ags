import brightness from '../services/brightness.js';
const audio = await Service.import('audio')
const battery = await Service.import('battery')
const network = await Service.import('network')
import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
const { Gravity } = imports.gi.Gdk;

const volumeIndicator = Widget.EventBox({
    onPrimaryClick: () => audio.speaker.is_muted = !audio.speaker.is_muted,
    onScrollUp: () => {
        audio.speaker.volume += 0.03
    },
    onScrollDown: () => {
        audio.speaker.volume -= 0.03
    },
    child: Widget.Box({
        spacing: 5,
        children: [
            Widget.Icon({ className: "indicator-icon" }),
            Widget.Label()
        ]
    }).hook(audio.speaker, self => {
        const vol = audio.speaker.volume * 100;
        const icon = [
            [101, 'overamplified'],
            [67, 'high'],
            [34, 'medium'],
            [1, 'low'],
            [0, 'muted'],
        ].find(([threshold]) => threshold <= vol)?.[1];

        self.children[0].icon = `audio-volume-${icon}-symbolic`;
        self.children[1].label = vol.toFixed(0) + "%"
    }),
})

const brightnessIndicator = Widget.Button({
    onScrollUp: () => {
        Utils.exec("brightnessctl s +5")
    },
    onScrollDown: () => {
        Utils.exec("brightnessctl s 5-")
    },
    child: Widget.Box({
        spacing: 5,
        children: [
            Widget.Icon({ className: "indicator-icon" }),
            Widget.Label()
        ]
    }).hook(brightness, self => {
        const br = brightness.screen_value * 100
        const icon = [
            [70, 'high'],
            [50, 'medium'],
            [15, 'low'],
            [0, 'off'],
        ].find(([threshold]) => threshold <= br)?.[1];

        self.children[0].icon = `display-brightness-${icon}-symbolic`;
        self.children[1].label = br.toFixed(0) + "%"
    }),
})

const batteryProgress = Widget.Box({
    spacing: 5,
    children: [
        Widget.Icon({ className: "indicator-icon" }),
        Widget.Label()
    ],
}).hook(battery, self => {

    self.children[0].icon = battery["icon-name"]
    self.children[1].label = battery["percent"] + "%"
    self.children[1].visible = !battery["charged"]
})

const SysTrayItem = (item) => Widget.Button({
    child: item.id == "nm-applet"
        ? Widget.Icon({
            icon: network.bind('connectivity').as(p => {
                if (p == "wired") {
                    return network.wired["icon-name"]
                } else {
                    return network.wifi["icon-name"]
                }
            }
            )
        })
        : Widget.Icon({
            icon: item.icon,
            setup: (self) => self.hook(item, (self) => { self.icon = item.icon })
        }),
    onPrimaryClick: (_, event) => item.activate(event),
    onSecondaryClick: (btn, event) => item.menu.popup_at_widget(btn, Gravity.SOUTH, Gravity.NORTH, null),
}).hook(item, (self) => self.tooltipMarkup = item['tooltip-markup'])

const tray = Widget.Box({
    spacing: 10,
}).hook(SystemTray, (self) => {
    const children = []
    SystemTray.items.forEach(e => {
        children.push(SysTrayItem(e))
    });
    children.push(Widget.Separator({ orientation: 1 }))
    self.children = children
    self.show_all();
})


export default Widget.Box({
    className: "card",
    vexpand: false,
    vpack: "center",
    spacing: 10,
    children: [
        tray,
        brightnessIndicator,
        Widget.Separator({ orientation: 1 }),
        volumeIndicator,
        Widget.Separator({ orientation: 1 }),
        batteryProgress
    ]
})

