import NoSleep from 'nosleep.js';

var noSleep = new NoSleep();

document.getElementById("preventSleepSwitch").addEventListener("click", (evt) => {
    const preventSleep = evt.target.checked

    if (preventSleep) {
        noSleep.enable()
        document.getElementById('favicon').setAttribute('href','data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☕️</text></svg>')
    } else {
        noSleep.disable()
        document.getElementById('favicon').setAttribute('href','data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😴</text></svg>')
    }
})
