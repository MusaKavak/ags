export default (
    children,
    cols,
    ...attributes
) => Widget.Box({
    vertical: true,
    ...attributes,
    setup: self => {
        const c = []
        for (let i = 0; i < children.length; i += cols) {
            c.push(Widget.Box({
                children: children.slice(i, i + cols)
            }))
        }
        self.children = c
    }
})