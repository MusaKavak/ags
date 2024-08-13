import { TopBar } from "./topbar/index.js"
import { Corner } from "./widgets/cairo_roundedcorner.js";
import Audiolevel from "./levels/audiolevel.js";
import rightbar from "./rightbar/index.js";
import launcher from "./launcher/index.js";
import { NotificationPopups } from "./notifications/index.js";

App.config({
    style: "./style.css",
    stackTraceOnError: true,
    windows: [
        Audiolevel(),
        TopBar,
        Corner("top left"),
        Corner("top right"),
        rightbar(),
        launcher(),
        NotificationPopups()
    ]
})

