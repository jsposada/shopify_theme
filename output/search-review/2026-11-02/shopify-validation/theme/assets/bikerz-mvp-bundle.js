(() => {
  if (customElements.get('bikerz-mvp-bundle')) return;
  const validId = id => /^[1-9]\d*$/.test(String(id));
  class BikerzMvpBundle extends HTMLElement {
    connectedCallback() {
      if (this.initialized) {
        if (this.carousel) this.carouselObserver?.observe(this.carousel);
        this.updateCarousel();
        return;
      }
      this.initialized = true;
      this.cartAttempted = false;
      this.submitting = false;
      this.cards = [...this.querySelectorAll('[data-complement]')];
      this.error = this.querySelector('[data-error]');
      this.result = this.querySelector('[data-result]');
      this.button = this.querySelector('[data-submit], [data-simulate]');
      this.cartLink = this.querySelector('[data-cart-link]');
      this.controls = [...this.querySelectorAll('[data-include], [data-size]')];
      this.cards.forEach(card => {
        card.querySelector('[data-include]').checked = false;
        const size = card.querySelector('[data-size]');
        if (size) size.value = '';
      });
      this.addEventListener('change', event => this.onChange(event));
      this.button.addEventListener('click', () => this.submit());
      this.carousel = this.querySelector('[data-carousel]');
      this.carouselControls = this.querySelector('[data-carousel-controls]');
      this.previous = this.querySelector('[data-carousel-prev]');
      this.next = this.querySelector('[data-carousel-next]');
      if (this.carousel && this.carouselControls && this.previous && this.next) {
        this.previous.addEventListener('click', () => this.moveCarousel(-1));
        this.next.addEventListener('click', () => this.moveCarousel(1));
        this.carousel.addEventListener('scroll', () => this.updateCarousel(), {passive:true});
        if (typeof ResizeObserver !== 'undefined') {
          this.carouselObserver = new ResizeObserver(() => this.updateCarousel());
          this.carouselObserver.observe(this.carousel);
        }
        this.updateCarousel();
      }
      this.update();
    }
    disconnectedCallback() {
      this.carouselObserver?.disconnect();
    }
    updateCarousel() {
      if (!this.carousel || !this.carouselControls || !this.previous || !this.next) return;
      const maximum = Math.max(0, this.carousel.scrollWidth - this.carousel.clientWidth);
      this.carouselControls.hidden = maximum <= 1;
      this.previous.disabled = this.carousel.scrollLeft <= 1;
      this.next.disabled = this.carousel.scrollLeft >= maximum - 1;
    }
    moveCarousel(direction) {
      if (!this.carousel) return;
      this.carousel.scrollBy({left:direction * this.carousel.clientWidth,
        behavior:window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ? 'auto' : 'smooth'});
    }
    cartRoutes() {
      const root = window.Shopify?.routes?.root;
      const theme = window.Shopify?.theme;
      const exactPilot = this.dataset.preview === 'true' && this.dataset.cartEnabled === 'true' &&
        this.dataset.cartEnvironment === 'pilot' && this.dataset.recommendationMode === 'staged' &&
        String(theme?.id) === '189814309085';
      const allowedDraft = exactPilot && (theme?.role === 'unpublished' ||
        (theme?.role === 'main' && this.dataset.liveCartEnabled === 'true'));
      if (!allowedDraft || typeof root !== 'string' ||
          !root.startsWith('/') || root.startsWith('//') || !root.endsWith('/') || /[?#\\]/.test(root)) return null;
      return {add:root + 'cart/add.js',cart:root + 'cart'};
    }
    selected() {
      return this.cards.filter(card => card.querySelector('[data-include]').checked);
    }
    money(cents) {
      return new Intl.NumberFormat('es-CL', {style:'currency',currency:'CLP',maximumFractionDigits:0}).format(cents / 100);
    }
    variant(card) {
      const size = card.querySelector('[data-size]');
      if (size) {
        const option = size.selectedOptions[0];
        if (!option?.value || option.disabled || !(Number(option.dataset.stock) > 0)) return null;
        return {id:option.value,price:Number(option.dataset.price),quantity:1};
      }
      if (!(Number(card.dataset.stock) > 0)) return null;
      return {id:card.dataset.variantId,price:Number(card.dataset.price),quantity:1};
    }
    onChange(event) {
      if (this.submitting || this.cartAttempted) return;
      const card = event.target.closest('[data-complement]');
      if (['tire','helmet'].includes(card?.dataset.kind) && event.target.matches('[data-include]')) {
        if (event.target.checked) {
          this.cards.filter(other => other !== card && other.dataset.kind === card.dataset.kind)
            .forEach(other => { other.querySelector('[data-include]').checked = false; });
        }
      }
      this.result.hidden = true;
      this.error.hidden = true;
      this.update();
    }
    update() {
      let total = Number(this.dataset.basePrice);
      const selected = this.selected();
      this.cards.forEach(card => {
        card.classList.toggle('upsell-checked', selected.includes(card));
        const variant = this.variant(card);
        if (variant && selected.includes(card)) total += variant.price;
        if (variant) card.querySelector('[data-card-price]').textContent = this.money(variant.price);
      });
      this.querySelector('[data-total]').textContent = this.money(total);
      const locked = this.submitting || this.cartAttempted;
      this.controls.forEach(control => { control.disabled = locked; });
      this.button.disabled = this.dataset.preview !== 'true' || locked ||
        (this.dataset.cartEnabled === 'true' && !this.cartRoutes());
      this.setAttribute('aria-busy', String(this.submitting));
    }
    fail(message) {
      this.result.hidden = true;
      this.error.textContent = message;
      this.error.hidden = false;
      return null;
    }
    buildPayload() {
      if (this.dataset.preview !== 'true') return this.fail('Esta versión solo permite el tema de prueba.');
      if (!validId(this.dataset.baseVariantId) || !(Number(this.dataset.baseStock) > 0) ||
          !Number.isFinite(Number(this.dataset.basePrice)) || Number(this.dataset.basePrice) <= 0) {
        return this.fail('El producto actual no está disponible. Actualiza la página.');
      }
      const selected = this.selected();
      const items = [{id:this.dataset.baseVariantId,quantity:1}];
      const ids = new Set([String(this.dataset.baseVariantId)]);
      if (selected.filter(card => card.dataset.kind === 'tire').length > 1) return this.fail('Elige solo una medida para el eje opuesto.');
      if (selected.filter(card => card.dataset.kind === 'helmet').length > 1) return this.fail('Elige solo un casco.');
      for (const card of selected) {
        const variant = this.variant(card);
        if (!variant || !Number.isFinite(variant.price) || variant.price <= 0 || !validId(variant.id)) {
          return this.fail(card.dataset.kind === 'helmet' ? 'Elige una talla disponible para el casco.' : 'Este neumático ya no está disponible.');
        }
        if (String(card.dataset.productId) === String(this.dataset.sourceProductId) || ids.has(String(variant.id))) {
          return this.fail('La selección contiene un producto repetido. Actualiza la página.');
        }
        ids.add(String(variant.id));
        items.push({id:variant.id,quantity:1});
      }
      this.error.hidden = true;
      return {items};
    }
    async submit() {
      if (this.submitting || this.cartAttempted) return;
      const payload = this.buildPayload();
      if (!payload) return;
      if (this.dataset.cartEnabled !== 'true') {
        // The local HTML prototype stays a simulator, with no network request.
        this.result.textContent = `Simulación: ${payload.items.length} producto(s). No se envió al carro.\n${JSON.stringify(payload,null,2)}`;
        this.result.hidden = false;
        this.dispatchEvent(new CustomEvent('bikerz:mvp:simulation',{bubbles:true,detail:payload}));
        return;
      }
      const routes = this.cartRoutes();
      if (!routes) return this.fail('El carrito de esta selección no está habilitado. Usa la ficha del producto.');
      this.submitting = true;
      // Do not retry a POST: even a timeout or 422 can leave items in the cart.
      this.cartAttempted = true;
      this.button.textContent = 'Agregando…';
      this.result.hidden = true;
      this.update();
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch(routes.add, {
          method:'POST',credentials:'same-origin',signal:controller.signal,
          headers:{'Content-Type':'application/json','Accept':'application/json'},
          body:JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok || Number(data?.status) >= 400) {
          const reason = typeof data?.description === 'string' ? data.description : 'No se pudo completar la solicitud.';
          throw new Error(`Shopify: ${reason} Revisa tu carrito; podría contener productos agregados.`);
        }
        if (!Array.isArray(data?.items) || payload.items.some(item => !data.items.some(added => String(added.variant_id ?? added.id) === String(item.id)))) {
          throw new Error('No pudimos confirmar todos los productos. Revisa tu carrito antes de intentarlo de nuevo.');
        }
        // Report only confirmed incremental complements, never the base product.
        // Observations cannot delay or break cart/navigation, and simulations do not emit this.
        try {
          const items = this.selected().map(card => {
            const variant = this.variant(card);
            const added = data.items.find(item => String(item.variant_id ?? item.id) === String(variant.id));
            if (!(Number(added.quantity) >= 1) || (added.product_id && String(added.product_id) !== card.dataset.productId)) return null;
            return {product_id:card.dataset.productId,variant_id:String(variant.id),
              unit_price_cents:Number.isSafeInteger(added.final_price) ? added.final_price : null};
          }).filter(Boolean);
          if (items.length) this.dispatchEvent(new CustomEvent('bikerz:mvp:cart-added',{bubbles:true,detail:{items}}));
        } catch { /* Analytics is optional, cart success is not. */ }
        this.result.textContent = 'Productos agregados. Abriendo tu carrito…';
        this.result.hidden = false;
        this.button.textContent = 'Agregado';
        if (this.cartLink) { this.cartLink.href = routes.cart; this.cartLink.hidden = false; }
        if (this.dataset.ga4RealQa === 'true') {
          // Private QA stays on the source page so reception can be inspected; no delayed redirect.
          this.result.textContent = 'Productos agregados. Usa «Revisar carrito» para verlos. Prueba QA: no realiza compras.';
          return;
        }
        // Remain in the same session. This never opens or submits checkout.
        try { window.location.assign(routes.cart); }
        catch { this.result.textContent = 'Productos agregados. Usa «Revisar carrito» para verlos.'; }
      } catch (error) {
        this.fail(error.message?.startsWith('Shopify:') || error.message?.startsWith('No pudimos confirmar') ? error.message :
          'No pudimos confirmar el resultado. Revisa tu carrito antes de intentarlo de nuevo.');
        this.button.textContent = 'Revisa tu carrito';
        if (this.cartLink) { this.cartLink.href = routes.cart; this.cartLink.hidden = false; }
      } finally {
        clearTimeout(timeout);
        this.submitting = false;
        this.update();
      }
    }
  }
  customElements.define('bikerz-mvp-bundle', BikerzMvpBundle);
})();
