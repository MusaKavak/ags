import settings from "../settings.js"
const hyprland = await Service.import('hyprland')

const dispatch = ws => Utils.exec(`hyprctl dispatch workspace ${ws}`);

const currentWorkspace = Variable(1)

export const Workspaces = () => Widget.EventBox({
    className: "workspaces-wrapper",
    onScrollDown: () => {
        if (currentWorkspace.value < settings.workspaceCount) {
            currentWorkspace.value = currentWorkspace.value + 1
            dispatch('+1')
        }
    },
    onScrollUp: () => {
        if (currentWorkspace.value > 1) {
            currentWorkspace.value = currentWorkspace.value - 1
            dispatch('-1')
        }
    },
    child: Widget.Box({
        className: "workspaces",
        children: Array.from({ length: settings.workspaceCount }, (_, i) => i + 1).map(i => workspace(i)),
        setup: self => {
            self.hook(hyprland, () => {
                currentWorkspace.value = hyprland.active.workspace.id
                self.children.forEach(workspace => {
                    if (workspace.attribute == hyprland.active.workspace.id) {
                        workspace.toggleClassName('active', true)
                    } else {
                        workspace.toggleClassName('active', false)
                    }

                    if (hyprland.workspaces.some(ws => ws.id == workspace.attribute)) {
                        workspace.toggleClassName('dirty', true)
                    } else {
                        workspace.toggleClassName('dirty', false)
                    }
                });
            })
        }
    }),

})

const workspace = (i) => {
    return Widget.Button({
        vpack: "center",
        vexpand: false,
        className: currentWorkspace.bind().as(id => id == i ? "workspace active" : "workspace"),
        attribute: i,
        label: `${i}`,
        onClicked: () => {
            currentWorkspace.value = i
            dispatch(i)
        },
    })
}