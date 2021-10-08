export default function (selectedLang = null, action) {
    if (action.type == 'changeLang') {
        console.log(action)
        return action.selectedLang
    } else {
        return selectedLang
    }
}