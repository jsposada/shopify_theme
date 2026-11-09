/* Attribution belongs to this survey link only; do not read customer data or persist it. */
if (!customElements.get('bikerz-service-evaluation')) {
  customElements.define('bikerz-service-evaluation', class extends HTMLElement {
    connectedCallback() {
      if (this.controller) return;
      const form = this.querySelector('.bikerz-evaluation__form');
      const sender = form?.querySelector('[data-evaluation-sender]');
      const email = form?.querySelector('[data-evaluation-email]');
      if (!sender || !email) return;

      this.controller = new AbortController();
      const { signal } = this.controller;
      const technicalEmail = sender.defaultValue;
      const returnTo = form.querySelector('input[name="return_to"]');
      const syncSender = () => {
        sender.value = email.value.trim() || technicalEmail;
      };
      const captureCampaign = () => {
        const params = new URLSearchParams(window.location.search);
        // Only fields explicitly declared in the Liquid allowlist are collected.
        for (const input of form.querySelectorAll('[data-evaluation-utm]')) {
          const value = (params.get(input.dataset.evaluationUtm) || '')
            .replace(/[\u0000-\u001f\u007f]/g, '')
            .trim()
            .slice(0, 200);
          input.value = value;
          input.disabled = value.length === 0;
        }
      };
      const syncDestination = () => {
        if (!returnTo) return;
        const ratings = Array.from(form.querySelectorAll('[data-evaluation-score]:checked'))
          .map(input => Number(input.dataset.evaluationScore));
        const excellent = ratings.length > 0 && ratings.every(score => score === 5);
        const destination = excellent ? this.dataset.excellentUrl : this.dataset.improvementUrl;
        if (destination) returnTo.value = destination;
      };

      email.addEventListener('input', syncSender, { signal });
      email.addEventListener('change', syncSender, { signal });
      form.addEventListener('change', syncDestination, { signal });
      form.addEventListener('submit', () => {
        syncSender();
        captureCampaign();
        syncDestination();
      }, { capture: true, signal });
      form.addEventListener('invalid', event => {
        const details = event.target.closest('details');
        if (details) details.open = true;
      }, { capture: true, signal });

      syncSender();
      captureCampaign();
      syncDestination();
    }

    disconnectedCallback() {
      this.controller?.abort();
      this.controller = null;
    }
  });
}
