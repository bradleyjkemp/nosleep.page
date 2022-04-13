import NoSleep from 'nosleep.js'

var noSleep = new NoSleep()

function updateSwitchStatus() {
    let enabled = noSleep.isEnabled
    if (noSleep._wakeLock) {
        enabled = !noSleep._wakeLock.released
    }
    if (enabled) {
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

document.addEventListener("visibilitychange", () => {
    if (noSleep._wakeLock && noSleep._wakeLock.released) {
        // We lost the wakelock because the tab was minimised
        document.getElementById("warning-modal").classList.add("is-active")
    }
})

document.addEventListener('DOMContentLoaded', () => {
    function closeModal($el) {
        $el.classList.remove('is-active');
    }

    function closeAllModals() {
        (document.querySelectorAll('.modal') || []).forEach(($modal) => {
            closeModal($modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);
        console.log($target);

        $trigger.addEventListener('click', () => {
            openModal($target);
        });
    });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
        const $target = $close.closest('.modal');

        $close.addEventListener('click', () => {
            closeModal($target);
        });
    });

    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
        const e = event || window.event;

        if (e.keyCode === 27) { // Escape key
            closeAllModals();
        }
    });
});

noSleep.enable().then(updateSwitchStatus)
