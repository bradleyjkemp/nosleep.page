import NoSleep from 'nosleep.js'

var noSleep = new NoSleep()

function updateSwitchStatus() {
    if (noSleep.isEnabled) {
        console.log("noSleep is enabled")
        document.getElementById("preventSleepSwitch").checked = true
        document.getElementById("hero").classList.add("is-success")
        document.getElementById('favicon').setAttribute('href', 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☕️</text></svg>')
    } else {
        console.log("noSleep is disabled")
        document.getElementById("preventSleepSwitch").checked = false
        document.getElementById("hero").classList.remove("is-success")
        document.getElementById('favicon').setAttribute('href', 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😴</text></svg>')
    }
}

document.getElementById("preventSleepSwitch").addEventListener("click", (evt) => {
    const preventSleep = evt.target.checked

    if (preventSleep) {
        noSleep.enable().then(updateSwitchStatus)
    } else {
        noSleep.disable()
        updateSwitchStatus()
    }
})

noSleep.enable().then(updateSwitchStatus)
