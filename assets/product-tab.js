/*
  Product tabs (sections/product-tab.liquid).
  Only the first tab is rendered as live markup; the others arrive inside a
  <template data-tab-content> and are unpacked the first time they are needed
  (hover/focus on the tab, click, or the mobile select).
*/
(() => {
  function unpack(panel) {
    const template = panel && panel.querySelector(':scope > template[data-tab-content]');
    if (template) template.replaceWith(template.content);
  }

  function panelFor(index) {
    return document.querySelector(`.parent-item-${index}`);
  }

  function show(index) {
    const panel = panelFor(index);
    unpack(panel);
    document.querySelectorAll('.parent-item.active').forEach((item) => item.classList.remove('active'));
    if (panel) panel.classList.add('active');
  }

  function init() {
    if (window.bikerzProductTabs) return;
    window.bikerzProductTabs = true;

    document.addEventListener('click', (event) => {
      const button = event.target.closest('.collection_tablinks');
      if (!button || !button.dataset.tabIndex) return;
      document.querySelectorAll('.collection_tablinks.active').forEach((item) => item.classList.remove('active'));
      button.classList.add('active');
      show(button.dataset.tabIndex);
    });

    // Warm up a tab before the click lands, so its images start loading earlier.
    const warm = (event) => {
      const button = event.target.closest && event.target.closest('.collection_tablinks');
      if (button && button.dataset.tabIndex) unpack(panelFor(button.dataset.tabIndex));
    };
    document.addEventListener('pointerover', warm);
    document.addEventListener('focusin', warm);

    document.addEventListener('change', (event) => {
      if (event.target.id === 'tpbox-select') show(event.target.value);
    });
  }

  init();
})();
