const audio = await Service.import('audio')

export default Widget.Box({
    className: "rightbar-mixer",
    spacing: 10,
    vertical: true,
    attribute: {
        update: (self) => {
            self.children = audio.apps.map(app => {
                return Widget.Box({
                    spacing: 10,
                    children: [
                        Widget.Icon(app.stream.name.toLowerCase()),
                        Widget.Box({
                            vertical: true,
                            hexpand: true,
                            spacing: 10,
                            children: [
                                Widget.Label({ hpack: "start", truncate: "end", label: app["description"] }),
                                Widget.Slider({
                                    drawValue: false,
                                    hpack: 'fill',
                                    value: app.volume,
                                    vertical: false,
                                    min: 0,
                                    max: 1.5,
                                    onChange: ({ value }) => app.volume = value,
                                    setup: (self) => self.hook(app, (self) => {
                                        self.value = app.volume;
                                    })
                                })
                            ]
                        })
                    ]
                })
            })
        }
    },
    setup: (self) => self
        .hook(audio, self.attribute.update, 'stream-added')
        .hook(audio, self.attribute.update, 'stream-removed')
    ,
})