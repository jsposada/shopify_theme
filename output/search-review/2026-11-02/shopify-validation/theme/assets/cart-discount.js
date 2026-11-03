(() => {
  if (customElements.get('cart-discount')) return;

  class CartDiscount extends HTMLElement {
    connectedCallback() {
      if (this.initialized) return;
      this.initialized = true;
      this.addEventListener('click', (event) => {
        const button = event.target.closest('[data-apply-discount], [data-remove-code]');
        if (!button) return;
        event.preventDefault();
        this.updateDiscount(button.dataset.removeCode);
      });
      this.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && event.target.matches('input')) {
          event.preventDefault();
          this.updateDiscount();
        }
      });
    }

    showStatus(message, error = false) {
      const status = this.querySelector('[data-discount-status]');
      status.textContent = message;
      status.classList.remove('hidden');
      this.querySelector('input').setAttribute('aria-invalid', String(error));
    }

    getSections() {
      const sections = [];
      const items = document.getElementById('main-cart-items');
      if (items) {
        sections.push({ id: items.dataset.id, target: '#main-cart-items .js-contents' });
        sections.push({ id: 'main-cart-footer', target: '#main-cart-footer', source: '.cart__right' });
      }
      if (document.getElementById('CartDrawer')) {
        sections.push({ id: 'cart-drawer', target: '#CartDrawer .drawer__inner' });
      }
      return sections;
    }

    renderSections(cart, sections) {
      // Validate every section before changing any prices. A null section is not a failed discount.
      const updates = sections.map((section) => {
        const html = cart.sections?.[section.id];
        if (!html) throw new Error('Missing cart section');
        const source = new DOMParser().parseFromString(html, 'text/html').querySelector(section.source || section.target);
        const target = document.querySelector(section.target);
        if (!source || !target) throw new Error('Missing cart content');
        return { source, target };
      });
      updates.forEach(({ source, target }) => {
        const openDetails = Array.from(target.querySelectorAll('details')).map((details) => details.open);
        target.innerHTML = source.innerHTML;
        target.querySelectorAll('details').forEach((details, index) => { details.open = openDetails[index] || false; });
      });
      window.loadContry?.();
      window.initializeAnimationSummaries?.();
      window.freeShipping?.init();
    }

    async updateDiscount(removeCode) {
      if (CartDiscount.busy) return;
      if (document.querySelector('.tp-cart.loading, .drawer__inner.loading')) {
        this.showStatus('Espera a que termine de actualizarse el carrito e inténtalo nuevamente.');
        return;
      }
      const input = this.querySelector('input');
      const code = input.value.trim();
      if (removeCode === undefined && !code) {
        this.showStatus('Ingresa un código de descuento.', true);
        input.focus();
        return;
      }

      CartDiscount.busy = true;
      const context = this.dataset.context;
      const sections = this.getSections();
      const controls = Array.from(document.querySelectorAll('cart-discount button, .cart__checkout-button, #CartDrawer-Checkout'));
      const disabled = controls.map((control) => control.disabled);
      controls.forEach((control) => { control.disabled = true; });
      const itemLists = Array.from(document.querySelectorAll('cart-items, cart-drawer-items'));
      const inert = itemLists.map((list) => list.inert);
      itemLists.forEach((list) => { list.inert = true; });
      this.setAttribute('aria-busy', 'true');
      this.querySelector('[data-discount-spinner]').classList.remove('hidden');
      this.querySelector('[data-discount-label]').classList.add('hidden');
      this.querySelector('[data-discount-status]').classList.add('hidden');
      let mutationStarted = false;

      try {
        const root = window.Shopify?.routes?.root || '/';
        const currentResponse = await fetch(`${root}cart.js`, { headers: { Accept: 'application/json' }, cache: 'no-store' });
        if (!currentResponse.ok) throw new Error('Cannot read cart');
        const current = await currentResponse.json();
        const codes = (current.discount_codes || []).filter((discount) => discount.applicable).map((discount) => discount.code);
        const nextCodes = removeCode === undefined
          ? codes.filter((value) => value.toLowerCase() !== code.toLowerCase()).concat(code)
          : codes.filter((value) => value.toLowerCase() !== removeCode.toLowerCase());
        const body = { discount: nextCodes.join(','), sections: sections.map((section) => section.id), sections_url: window.location.pathname };
        const note = document.querySelector('cart-note textarea');
        if (note) body.note = note.value;
        mutationStarted = true;
        const response = await fetch(this.dataset.updateUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(body)
        });
        if (!response.ok) throw new Error('Cannot update discount');
        const cart = await response.json();
        this.renderSections(cart, sections);
        const coupon = document.querySelector(`cart-discount[data-context="${context}"]`);
        if (!coupon) throw new Error('Missing discount form');
        const accepted = (cart.discount_codes || []).some((discount) => discount.applicable && discount.code.toLowerCase() === code.toLowerCase());
        coupon.querySelector('input').value = removeCode === undefined ? code : '';
        coupon.showStatus(removeCode !== undefined ? 'Código quitado.' : accepted ? 'Código de descuento aplicado.' : 'El código no es válido o no se aplica a este carrito.', removeCode === undefined && !accepted);
        const details = coupon.closest('details');
        if (details) details.open = true;
        coupon.querySelector('input').focus({ preventScroll: true });
      } catch (error) {
        if (mutationStarted) {
          // Shopify may apply the discount even if section rendering fails. Reload for authoritative prices.
          window.location.reload();
        } else {
          this.showStatus('No pudimos comprobar el código. Inténtalo nuevamente.', true);
        }
      } finally {
        controls.forEach((control, index) => { control.disabled = disabled[index]; });
        itemLists.forEach((list, index) => { list.inert = inert[index]; });
        this.removeAttribute('aria-busy');
        this.querySelector('[data-discount-spinner]').classList.add('hidden');
        this.querySelector('[data-discount-label]').classList.remove('hidden');
        CartDiscount.busy = false;
      }
    }
  }

  customElements.define('cart-discount', CartDiscount);
})();
