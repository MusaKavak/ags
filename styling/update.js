export default async (wallpaperPath) => {
    const css = await Utils.readFile(App.configDir + '/style.css')
    const newColors = await Utils.execAsync(["bash", "-c", `python ${App.configDir}/styling/c.py --path ${wallpaperPath} --opacity 0.7  --scheme rainbow`])

    let changeIndex = css.indexOf('/* COLORS */');

    if (changeIndex !== -1) {
        let contentStartIndex = changeIndex + '/* COLORS */'.length;
        let newString = css.substring(0, contentStartIndex) + "\n" + newColors;

        await Utils.writeFile(newString, App.configDir + '/style.css')
        return true
    } else {
        console.log("No '/* COLORS */' found in the input string.");
        return false
    }
}