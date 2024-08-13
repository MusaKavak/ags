import settings from "../settings.js"
const audio = await Service.import('audio')

let state = Variable({ timeout: setTimeout(() => { }, 0), vol: 0 })

export default () => Widget.Window({
    name: "level-indicator",
    anchor: ["bottom"],
    layer: "overlay",
    margin: 10,
    child: Widget.Box({
        className: "card",
        hexpand: true,
        spacing: 10,
        css: `
            min-width: ${settings.levelProgressBarSize}px;
            padding: .5rem;
            margin-bottom: 100px;
        `,
        children: [
            Widget.Label({ hpack: "start", label: "", css: "min-width: 3rem;" }),
            Widget.Slider({
                drawValue: false,
                hexpand: true,
                value: audio.speaker.volume,
                vertical: false,
                min: 0,
                max: 1,
            })
        ]
    }).hook(audio, self => {
        if (state.value.vol == audio.speaker.volume) return
        else state.value.vol = audio.speaker.volume
        clearTimeout(state.value.timeout)

        self.visible = true

        state.value.timeout = setTimeout(() => {
            self.visible = false
        }, settings.levelProgressBarDuration)

        self.children[0].label = (audio.speaker.volume * 100).toFixed(0) + "%"
        self.children[1].value = Math.min(audio.speaker.volume, 1)
    }, "speaker-changed")





























})


Widget.CircularProgress({
    css: `
            min-width: ${settings.levelProgressBarSize}px;
            min-height: ${settings.levelProgressBarSize}px;
        `,
    rounded: true,
    startAt: 0.75,
    value: 0.6,
    child: Widget.Label()
})