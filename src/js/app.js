import NoSleep from "nosleep.js";

window.addEventListener("load", () => {
  var noSleep = new NoSleep();

  let isDarkModeEnabled = false;
  const heroSection = document.getElementById("hero");
  const preventSleepSwitch = document.getElementById("preventSleepSwitch");

  const Theme = {
    LIGHT: {
      enabled: "is-success",
      disabled: "is-light",
    },
    DARK: {
      enabled: "is-dark",
      disabled: "is-half-dark",
    },
  };

  function updateSwitchStatus() {
    let enabled = noSleep.isEnabled;
    if (noSleep._wakeLock) {
      enabled = !noSleep._wakeLock.released;
    }
    if (enabled) {
      console.log("noSleep is enabled");
      preventSleepSwitch.checked = true;
      heroSection.classList.remove(
        isDarkModeEnabled ? Theme.DARK.disabled : Theme.LIGHT.disabled
      );
      heroSection.classList.add(
        isDarkModeEnabled ? Theme.DARK.enabled : Theme.LIGHT.enabled
      );
      document
        .getElementById("favicon")
        .setAttribute(
          "href",
          "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>☕️</text></svg>"
        );
    } else {
      console.log("noSleep is disabled");
      preventSleepSwitch.checked = false;
      heroSection.classList.remove(
        isDarkModeEnabled ? Theme.DARK.enabled : Theme.LIGHT.enabled
      );
      heroSection.classList.add(
        isDarkModeEnabled ? Theme.DARK.disabled : Theme.LIGHT.disabled
      );
      document
        .getElementById("favicon")
        .setAttribute(
          "href",
          "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>😴</text></svg>"
        );
    }
  }

  document
    .getElementById("darkModeSwitch")
    .addEventListener("change", (evt) => {
      isDarkModeEnabled = evt.target.checked;

      const navbar = document.getElementById("navbar");
      navbar.classList.toggle("is-light");
      navbar.classList.toggle("is-dark");

      const card = document.getElementById("card");
      card.classList.toggle("is-light");
      card.classList.toggle("is-half-dark");

      preventSleepSwitch.classList.toggle("is-success");
      preventSleepSwitch.classList.toggle("is-info");

      if (noSleep.isEnabled) {
        heroSection.classList.toggle("is-success");
        heroSection.classList.toggle("is-dark");
      } else {
        heroSection.classList.toggle("is-half-dark");
      }
    });

  document
    .getElementById("preventSleepSwitch")
    .addEventListener("click", (evt) => {
      const preventSleep = evt.target.checked;

      if (preventSleep) {
        noSleep.enable().then(updateSwitchStatus);
      } else {
        noSleep.disable();
        updateSwitchStatus();
      }
    });

  document.addEventListener("visibilitychange", () => {
    if (noSleep._wakeLock && noSleep._wakeLock.released) {
      // We lost the wakelock because the tab was minimised
      document.getElementById("warning-modal").classList.add("is-active");
    }
  });

  function closeModal($el) {
    $el.classList.remove("is-active");
  }

  function closeAllModals() {
    (document.querySelectorAll(".modal") || []).forEach(($modal) => {
      closeModal($modal);
    });
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll(".js-modal-trigger") || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target;
    const $target = document.getElementById(modal);
    console.log($target);

    $trigger.addEventListener("click", () => {
      openModal($target);
    });
  });

  // Add a click event on various child elements to close the parent modal
  (
    document.querySelectorAll(
      ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
    ) || []
  ).forEach(($close) => {
    const $target = $close.closest(".modal");

    $close.addEventListener("click", () => {
      closeModal($target);
    });
  });

  // Add a keyboard event to close all modals
  document.addEventListener("keydown", (event) => {
    const e = event || window.event;

    if (e.key === "Escape") {
      // Escape key
      closeAllModals();
    }
  });

  noSleep.enable().then(updateSwitchStatus);
});
