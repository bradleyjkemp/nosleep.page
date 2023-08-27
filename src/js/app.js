import NoSleep from 'nosleep.js'

var noSleep = new NoSleep()
var countdownHandle;
var wasEnabled = false;

function updateSwitchStatus() {
    let enabled = noSleep.isEnabled
    if (noSleep._wakeLock) {
        enabled = !noSleep._wakeLock.released
    }
    if (wasEnabled !== enabled) {
        wasEnabled = enabled;
        if (enabled) {
            console.log("noSleep is enabled")
            document.getElementById("preventSleepSwitch").checked = true
            document.getElementById("hero").classList.add("is-success")
            document.getElementById('favicon').setAttribute('href', 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☕️</text></svg>')
            startCountdown();
        } else {
            console.log("noSleep is disabled")
            document.getElementById("preventSleepSwitch").checked = false
            document.getElementById("hero").classList.remove("is-success")
            document.getElementById('favicon').setAttribute('href', 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😴</text></svg>')
            stopCountdown();
        }
    }
}

function updateTimeRemaining(totalSecondsRemaining) {
    // Add 1 to the seconds so you never see 0:00
    const adjustedSeconds = totalSecondsRemaining + 1;

    const secondsRemainingString = Math.floor(adjustedSeconds % 60).toString().padStart(2, "0");
    const minutesRemainingString = Math.floor((adjustedSeconds / 60) % 60).toString();
    const hoursRemaining = Math.floor(adjustedSeconds / 60 / 60);
    if (hoursRemaining) {
        timeRemaining.textContent = `${hoursRemaining}:${minutesRemainingString.padStart(2, "0")}:${secondsRemainingString}`;
    } else {
        timeRemaining.textContent = `${minutesRemainingString}:${secondsRemainingString}`;
    }
}

function startCountdown() {
    stopCountdown();

    const timeSelect = document.getElementById("timeSelect");
    const hours = +timeSelect.value;
    if (!hours) {
        return;
    }

    const seconds = hours * 60 * 60;
    // Initial time update - subtract one to deal with the 1 offset updateTimeRemaining adds.
    updateTimeRemaining(seconds - 1);

    const endTime = new Date(Date.now() + (seconds * 1000));
    countdownHandle = setInterval(() => {
        const totalSecondsRemaining = (endTime - Date.now()) / 1000;

        if (totalSecondsRemaining <= 0) {
            noSleep.disable()
            updateSwitchStatus()
            return;
        }

        updateTimeRemaining(totalSecondsRemaining);
    }, 1000);
}

function stopCountdown() {
    if (countdownHandle !== undefined) {
        clearInterval(countdownHandle);
        countdownHandle = undefined;
    }
    document.getElementById("timeRemaining").textContent = "";
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("preventSleepSwitch").addEventListener("click", (evt) => {
        const preventSleep = evt.target.checked

        if (preventSleep) {
            noSleep.enable().then(updateSwitchStatus)
        } else {
            noSleep.disable()
            updateSwitchStatus()
        }
    })

    document.getElementById("timeSelect").addEventListener("change", () => {
        if (noSleep.isEnabled) {
          startCountdown();
        }
    })

    window.addEventListener("unhandledrejection", () => {
        // NoSleep will try to reactivate itself on visibility changes but
        // it may fail since the wakeLock is not triggered as part of a
        // user gesture. In this case, update our switch status to reflect
        // the current state
        if (noSleep.isEnabled !== document.getElementById("preventSleepSwitch").checked) {
            updateSwitchStatus();
        }
    })

    document.addEventListener("visibilitychange", () => {
        if (noSleep._wakeLock && noSleep._wakeLock.released) {
            // We lost the wakelock because the tab was minimised
            document.getElementById("warning-modal").classList.add("is-active")
        }
    })

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
