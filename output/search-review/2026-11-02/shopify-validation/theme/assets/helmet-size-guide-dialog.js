(function () {
  var dialog = document.getElementById("HelmetSizeGuideDialog");

  if (!dialog || window.__helmetSizeGuideDialogLoaded) {
    return;
  }

  window.__helmetSizeGuideDialogLoaded = true;

  var lastFocusedElement = null;

  function lockBody() {
    document.body.classList.add("size-guide-modal-open");
  }

  function unlockBody() {
    document.body.classList.remove("size-guide-modal-open");
  }

  function removeLegacyDrawer() {
    var legacyBackdrop = document.getElementById("size-guide-backdrop");
    var legacyDrawer = document.getElementById("size-guide-drawer");

    if (legacyBackdrop) {
      legacyBackdrop.remove();
    }

    if (legacyDrawer) {
      legacyDrawer.remove();
    }
  }

  function upgradeLegacyTriggers() {
    document
      .querySelectorAll('button[onclick*="size-guide-drawer"], a[onclick*="size-guide-drawer"]')
      .forEach(function (trigger) {
        trigger.removeAttribute("onclick");
        trigger.setAttribute("data-size-guide-open", "");
        trigger.setAttribute("aria-controls", "HelmetSizeGuideDialog");
      });
  }

  function findOpenTrigger(target) {
    if (!target || typeof target.closest !== "function") {
      return null;
    }

    return target.closest(
      '[data-size-guide-open], button[onclick*="size-guide-drawer"], a[onclick*="size-guide-drawer"]'
    );
  }

  function openDialog(trigger) {
    lastFocusedElement = trigger || document.activeElement;
    removeLegacyDrawer();

    if (dialog.open) {
      return;
    }

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }

    lockBody();
  }

  function closeDialog() {
    if (dialog.open && typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
      unlockBody();
    }

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  document.addEventListener(
    "click",
    function (event) {
      var trigger = findOpenTrigger(event.target);

      if (!trigger) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      openDialog(trigger);
    },
    true
  );

  dialog.querySelectorAll("[data-size-guide-close]").forEach(function (trigger) {
    trigger.addEventListener("click", closeDialog);
  });

  dialog.addEventListener("cancel", unlockBody);
  dialog.addEventListener("close", unlockBody);

  dialog.addEventListener("click", function (event) {
    var rect = dialog.getBoundingClientRect();
    var isBackdropClick =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (isBackdropClick) {
      closeDialog();
    }
  });

  document.addEventListener("shopify:section:load", function () {
    removeLegacyDrawer();
    upgradeLegacyTriggers();
  });

  removeLegacyDrawer();
  upgradeLegacyTriggers();
})();
