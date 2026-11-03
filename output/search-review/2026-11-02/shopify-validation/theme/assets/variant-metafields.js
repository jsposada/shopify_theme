(() => {
  const fragmentSelector = '[data-variant-fragment]';

  function replaceFragment(currentSection, nextSection, currentFragment) {
    if (!currentFragment.id) return;
    const nextFragment = nextSection.querySelector(`#${currentFragment.id}`);
    if (nextFragment) {
      currentFragment.replaceWith(nextFragment);
    }
  }

  function refreshElementReferences(sectionId) {
    const productFormElement = document.getElementById(`product-form-${sectionId}`)?.closest('product-form');
    if (productFormElement) {
      productFormElement.submitButton = productFormElement.querySelector('[type="submit"]');
    }

    const productInfoElement = document.getElementById(`ProductInfo-${sectionId}`);
    if (productInfoElement) {
      productInfoElement.input = productInfoElement.querySelector('.quantity__input');
      productInfoElement.quantityForm = productInfoElement.querySelector('.product-form__quantity');
    }
  }

  function onVariantChange(event) {
    const data = event && event.data;
    if (!data || !data.html || !data.sectionId) return;

    const currentSection = document.getElementById(`MainProduct-${data.sectionId}`);
    const nextSection = data.html.getElementById(`MainProduct-${data.sectionId}`) || data.html;
    if (!currentSection || !nextSection) return;

    currentSection.querySelectorAll(fragmentSelector).forEach((fragment) => {
      replaceFragment(currentSection, nextSection, fragment);
    });
    refreshElementReferences(data.sectionId);
  }

  if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
    subscribe(PUB_SUB_EVENTS.variantChange, onVariantChange);
  }
})();
