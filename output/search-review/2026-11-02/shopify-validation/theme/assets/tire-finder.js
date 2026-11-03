/*
  Tire finder (sections/tire-finder.liquid), used on the home page and the tire landing.
  Settings arrive as data attributes on [data-tire-finder]; element ids are the wrapper id
  plus a suffix (-ancho, -aspecto, -aro, -uso, -buscar, -estado, -actualizaciones).
*/
(function() {
  'use strict';

  async function initTireFinder(finderEl) {
    if (!finderEl || finderEl.dataset.initialized === 'true') return;
    finderEl.dataset.initialized = 'true';

    // ─────────────────────────────────────────────
    // CONFIGURACIÓN
    // ─────────────────────────────────────────────
    const config = finderEl.dataset;
    const STOREFRONT_TOKEN = config.storefrontToken || '';
    const API_URL          = "/api/2026-07/graphql.json";
    const COLLECTION_HANDLE = config.collectionHandle || 'all';
    const COLLECTION_URL    = config.collectionUrl || '/collections/all';
    const FINDER_SOURCE     = config.source || '';
    let resultsCount        = Number(config.resultsCount ?? -1);
    const REQUIRE_METRIC_PROFILE = config.requireProfile === 'true';

    // Namespace y keys de los metacampos en los productos
    // Ajusta el namespace si no es "custom"
    const NAMESPACE_ANCHO   = "custom";   const KEY_ANCHO   = "ancho";
    const NAMESPACE_ASPECTO = "custom";   const KEY_ASPECTO = "aspecto";
    const NAMESPACE_ARO     = "custom";   const KEY_ARO     = "di_metro";  // custom.di_metro

    // ─────────────────────────────────────────────
    // ELEMENTOS DEL DOM
    // ─────────────────────────────────────────────
    const byId = (suffix) => document.getElementById(`${finderEl.id}-${suffix}`);
    const selectAncho   = byId('ancho');
    const selectAspecto = byId('aspecto');
    const selectAro     = byId('aro');
    const selectUse     = byId('uso');
    const btnSearch     = byId('buscar');
    const statusEl      = byId('estado');
    const statusIconEl  = statusEl.querySelector('.pf-status-icon');
    const statusMessageEl = statusEl.querySelector('.pf-status-message');
    const statusClearEl = statusEl.querySelector('.pf-status-clear');
    const statusFallbackEl = statusEl.querySelector('.pf-status-fallback');
    const buttonTextEl = btnSearch.querySelector('.pf-btn-text');
    const buttonLabel = buttonTextEl.textContent;
    const updatesEl     = byId('actualizaciones');
    const steps         = finderEl.querySelectorAll('.pf-step[data-step]');
    const USAGE_PARAM_NAME = selectUse?.dataset.paramName || '';

    // ─────────────────────────────────────────────
    // ESTADO LOCAL
    // Lista de combinaciones únicas {ancho, aspecto, aro}
    // extraídas de todos los productos de la colección
    // ─────────────────────────────────────────────
    let allCombinations = [];
    let measuresLoading = true;
    let resultsLoading = false;

    // ─────────────────────────────────────────────
    // HELPERS
    // ─────────────────────────────────────────────
    function showStatus(msg, type = 'info', showClear = false) {
      statusFallbackEl.hidden = true;
      const iconByType = { info: '✓', warning: '!', error: '!', empty: '–' };
      statusMessageEl.textContent = msg;
      statusIconEl.textContent = iconByType[type] || '✓';
      statusEl.className = `pf-status${type === 'info' ? '' : ` is-${type}`}${showClear ? ' has-clear' : ''}`;
      statusEl.style.display = 'flex';
    }

    function showMeasurementStatus(measurement, availability) {
      const measurementEl = document.createElement('strong');
      measurementEl.className = 'pf-status-measurement';
      measurementEl.textContent = measurement;

      showStatus('', 'info', true);
      statusMessageEl.append(
        'medida seleccionada: ',
        measurementEl,
        `. mostrando ${availability}.`
      );
    }

    function hideStatus() { statusEl.style.display = 'none'; }

    function publishEvent(name, data) {
      if (!window.Shopify?.analytics?.publish) return;
      try {
        const result = window.Shopify.analytics.publish(name, data);
        if (result?.catch) result.catch(() => {});
      } catch (error) {
        console.debug('[Tire Finder] Analytics event not published.', error);
      }
    }

    function setLoading(isLoading) {
      measuresLoading = isLoading;
      finderEl.setAttribute('aria-busy', String(measuresLoading || resultsLoading));
    }

    function navigateToResults(url) {
      const request = new CustomEvent('bikerz:tire-results-search', {
        bubbles: true,
        cancelable: true,
        detail: { url }
      });
      if (finderEl.dispatchEvent(request)) window.location.href = url;
    }

    function announceOptions(changedSelect) {
      if (!changedSelect) return;

      const fieldNames = {
        ancho: 'el ancho',
        aspecto: 'el perfil',
        aro: 'el aro'
      };
      const optionCount = (select) => Math.max(0, select.options.length - 1);

      updatesEl.textContent = `Opciones actualizadas después de cambiar ${fieldNames[changedSelect]}. ${optionCount(selectAncho)} opciones de ancho, ${optionCount(selectAspecto)} opciones de perfil y ${optionCount(selectAro)} opciones de aro disponibles.`;
    }

    function setStepActive() {
      steps.forEach(s => {
        const n = s.dataset.step;
        const isActive =
          (n === '1' && selectAncho.value) ||
          (n === '2' && selectAspecto.value) ||
          (n === '3' && selectAro.value) ||
          (n === '4' && selectUse?.value);

        s.classList.toggle('is-active', Boolean(isActive));
      });
    }

    function resetSelect(el, placeholder) {
      el.innerHTML = `<option value="">${placeholder}</option>`;
      el.disabled = true;
    }

    function sortNumeric(arr) {
      return arr.slice().sort((a, b) => parseFloat(a) - parseFloat(b));
    }

    function formatAnchoValue(value) {
      const num = Number(String(value).replace(',', '.'));
      if (!Number.isFinite(num)) return value;
      if (num >= 20) return String(Math.round(num));
      if (num < 20) return num.toFixed(2);
      return value;
    }

    function requiresProfile(value) {
      if (!REQUIRE_METRIC_PROFILE) return false;
      const num = Number(String(value).replace(',', '.'));
      return Number.isFinite(num) && num >= 20;
    }

    // Medidas americanas (ancho < 20: 2.50, 3.00, 3.50…) no tienen perfil: se oculta el paso
    // en vez de mostrar un select vacío, y los pasos visibles se renumeran (Ancho 1, Aro 2…).
    const cardEl = finderEl.querySelector('.pf-card');
    const profileStep = finderEl.querySelector('.pf-step[data-step="2"]');
    function updateProfileStep() {
      if (!cardEl || !profileStep) return;
      const num = Number(String(selectAncho.value).replace(',', '.'));
      const hide = Boolean(selectAncho.value) && Number.isFinite(num) && num < 20;
      if (hide && selectAspecto.value) selectAspecto.value = '';
      profileStep.hidden = hide;
      cardEl.classList.toggle('is-no-profile', hide);
      const visibleSteps = [...steps].filter(step => !step.hidden);
      cardEl.style.setProperty('--pf-visible-steps', String(visibleSteps.length));
      visibleSteps.forEach((step, index) => {
        const number = step.querySelector('.pf-step-number');
        if (number) number.textContent = String(index + 1);
      });
    }

    function getToken() {
      if (STOREFRONT_TOKEN && STOREFRONT_TOKEN.trim().length > 10) return STOREFRONT_TOKEN.trim();
      if (window.Shopify && window.Shopify.storefrontAccessToken) return window.Shopify.storefrontAccessToken;
      return null;
    }

    // ─────────────────────────────────────────────
    // GRAPHQL — Obtiene todos los productos de la colección
    // con sus metacampos de ancho, aspecto y aro (di_metro)
    // ─────────────────────────────────────────────
    async function fetchAllProducts(token) {
      let allProducts = [];
      let hasNextPage = true;
      let cursor = null;

      while (hasNextPage) {
        const afterClause = cursor ? `, after: "${cursor}"` : "";

        const query = `
          {
            collection(handle: "${COLLECTION_HANDLE}") {
              products(first: 250${afterClause}) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                nodes {
                  id
                  title
                  ancho: metafield(namespace: "${NAMESPACE_ANCHO}", key: "${KEY_ANCHO}") {
                    value
                  }
                  aspecto: metafield(namespace: "${NAMESPACE_ASPECTO}", key: "${KEY_ASPECTO}") {
                    value
                  }
                  aro: metafield(namespace: "${NAMESPACE_ARO}", key: "${KEY_ARO}") {
                    value
                  }
                }
              }
            }
          }
        `;

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': token
          },
          body: JSON.stringify({ query })
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const json = await response.json();

        if (json.errors) {
          throw new Error(json.errors.map(e => e.message).join(', '));
        }

        if (!json.data.collection) {
          throw new Error('Colección no encontrada. Verifica el handle en la configuración.');
        }

        const productsData = json.data.collection.products;
        allProducts = allProducts.concat(productsData.nodes);
        hasNextPage = productsData.pageInfo.hasNextPage;
        cursor = productsData.pageInfo.endCursor;
      }

      return allProducts;
    }

    // ─────────────────────────────────────────────
    // PROCESAR PRODUCTOS → Combinaciones únicas
    // Acepta productos con solo ancho + aro (medida americana)
    // o con los 3 campos (medida métrica)
    // ─────────────────────────────────────────────
    function parseCombinations(products) {
      const seen = new Set();
      const combinations = [];

      products.forEach(p => {
        const ancho   = p.ancho?.value?.trim()   || "";
        const aspecto = p.aspecto?.value?.trim() || ""; // puede estar vacío
        const aro     = p.aro?.value?.trim()     || "";

        // Mínimo requerido: aro
        if (!aro) return;

        const key = `${ancho}|${aspecto}|${aro}`;
        if (!seen.has(key)) {
          seen.add(key);
          combinations.push({ ancho, aspecto, aro });
        }
      });

      return combinations;
    }

    // ─────────────────────────────────────────────
    // REPOBLAR SELECTS — lógica inteligente:
    // Cada select muestra solo las opciones compatibles
    // con lo que hay seleccionado en los OTROS dos,
    // pero nunca se deshabilita. El valor actual se
    // conserva si sigue siendo válido.
    // ─────────────────────────────────────────────
    function repopulate(changedSelect) {
      const ancho   = selectAncho.value;
      const aspecto = selectAspecto.value;
      const aro     = selectAro.value;

      // Filtrar combinaciones según los campos que NO cambiaron
      function filtered(ignoring) {
        return allCombinations.filter(c => {
          const matchAncho   = (ignoring === 'ancho'   || !ancho   || c.ancho === ancho);
          const matchAspecto = (ignoring === 'aspecto' || !aspecto || c.aspecto === aspecto);
          const matchAro     = (ignoring === 'aro'     || !aro     || c.aro === aro);
          return matchAncho && matchAspecto && matchAro;
        });
      }

      // Rebuilds a select preserving current value if still valid
      function rebuild(el, values, placeholder, formatter) {
        const current = el.value;
        el.innerHTML = `<option value="">${placeholder}</option>`;
        values.forEach(val => {
          const opt = document.createElement('option');
          opt.value = val;
          opt.textContent = formatter ? formatter(val) : val;
          el.appendChild(opt);
        });
        el.disabled = values.length === 0;
        // Restore previous selection if still available
        if (values.includes(current)) el.value = current;
      }

      // Recalcular cada select ignorando a sí mismo
      if (changedSelect !== 'ancho') {
        const src = changedSelect === null ? allCombinations : filtered('ancho');
        const anchos = sortNumeric([...new Set(src.map(c => c.ancho).filter(Boolean))]);
        rebuild(selectAncho, anchos, '— Selecciona Ancho —', formatAnchoValue);
      }

      if (changedSelect !== 'aspecto') {
        const src = changedSelect === null ? allCombinations : filtered('aspecto');
        const aspectos = sortNumeric([...new Set(src.map(c => c.aspecto).filter(Boolean))]);
        const profilePlaceholder = requiresProfile(ancho) ? '— Selecciona Perfil —' : '— Cualquier perfil —';
        rebuild(selectAspecto, aspectos, profilePlaceholder);
      }

      if (changedSelect !== 'aro') {
        const src = changedSelect === null ? allCombinations : filtered('aro');
        const aros = sortNumeric([...new Set(src.map(c => c.aro))]);
        rebuild(selectAro, aros, '— Selecciona Aro —');
      }

      // Botón e indicadores visuales
      const r = selectAro.value;
      btnSearch.disabled = !r || (requiresProfile(selectAncho.value) && !selectAspecto.value);
      selectAspecto.setAttribute('aria-required', String(requiresProfile(selectAncho.value)));
      updateProfileStep();
      setStepActive();
      announceOptions(changedSelect);
    }

    // Carga inicial — todos los selects con todos sus valores
    function populateAll() {
      repopulate(null); // null = no se está cambiando ninguno, mostrar todo
    }

    function selectedMeasurement() {
      const ancho = selectAncho.value;
      const aspecto = selectAspecto.value;
      const aro = selectAro.value;
      if (!aro) return '';
      if (ancho && aspecto) return `${formatAnchoValue(ancho)}/${aspecto}-${aro}`;
      if (ancho) return `${formatAnchoValue(ancho)}-${aro}`;
      return aro;
    }

    function restoreSelectionFromUrl() {
      const params = new URLSearchParams(window.location.search);
      const singleValue = name => {
        const values = [...new Set(params.getAll(name))];
        return values.length === 1 ? values[0] : '';
      };
      const selected = {
        ancho: singleValue(`filter.p.m.${NAMESPACE_ANCHO}.${KEY_ANCHO}`),
        aspecto: singleValue(`filter.p.m.${NAMESPACE_ASPECTO}.${KEY_ASPECTO}`),
        aro: singleValue(`filter.p.m.${NAMESPACE_ARO}.${KEY_ARO}`),
        uso: USAGE_PARAM_NAME ? singleValue(USAGE_PARAM_NAME) : ''
      };

      selectAncho.value = '';
      selectAspecto.value = '';
      selectAro.value = '';
      if (selectUse) selectUse.value = '';
      repopulate(null);
      if ([...selectAncho.options].some(option => option.value === selected.ancho)) selectAncho.value = selected.ancho;
      if ([...selectAspecto.options].some(option => option.value === selected.aspecto)) selectAspecto.value = selected.aspecto;
      if ([...selectAro.options].some(option => option.value === selected.aro)) selectAro.value = selected.aro;
      if (selectUse && [...selectUse.options].some(option => option.value === selected.uso)) selectUse.value = selected.uso;
      repopulate(null);

      const hasFilters = [...params.keys()].some(name => name.startsWith('filter.'));
      if (!hasFilters) {
        hideStatus();
        return false;
      }
      if (resultsCount === 0) {
        showStatus('No encontramos coincidencias publicadas para esta medida con los filtros seleccionados. Puedes cambiar la medida o seguir navegando por el catálogo.', 'empty', true);
      } else {
        const hasMultipleMeasures = [
          `filter.p.m.${NAMESPACE_ANCHO}.${KEY_ANCHO}`,
          `filter.p.m.${NAMESPACE_ASPECTO}.${KEY_ASPECTO}`,
          `filter.p.m.${NAMESPACE_ARO}.${KEY_ARO}`
        ].some(name => new Set(params.getAll(name)).size > 1);
        const measurement = hasMultipleMeasures ? '' : selectedMeasurement();
        const availability = resultsCount === 1 ? '1 resultado' : `${resultsCount} resultados`;
        if (measurement) {
          showMeasurementStatus(measurement, availability);
        } else {
          showStatus(`Mostrando ${availability} con los filtros seleccionados.`, 'info', true);
        }
      }

      return true;
    }

    // ─────────────────────────────────────────────
    // INICIALIZAR
    // ─────────────────────────────────────────────
    async function init() {
      const token = getToken();

      if (!token) {
        showStatus('No pudimos cargar el buscador. Intenta nuevamente; la colección y sus filtros siguen disponibles.', 'error');
        selectAncho.innerHTML = '<option value="">Token requerido</option>';
        setLoading(false);
        return;
      }

      showStatus('Cargando medidas disponibles...', 'info');

      try {
        const products = await fetchAllProducts(token);
        allCombinations = parseCombinations(products);

        if (allCombinations.length === 0) {
          showStatus('No pudimos cargar el buscador. Intenta nuevamente; la colección y sus filtros siguen disponibles.', 'error');
          return;
        }

        hideStatus();
        populateAll();
        const restoredSelection = restoreSelectionFromUrl();
        if (!restoredSelection) {
          hideStatus();
        }

      } catch (err) {
        console.error('[Tire Finder] Error:', err);
        showStatus('No pudimos cargar el buscador. Intenta nuevamente; la colección y sus filtros siguen disponibles.', 'error');
        selectAncho.innerHTML = '<option value="">Error de carga</option>';
      } finally {
        setLoading(false);
      }
    }

    // ─────────────────────────────────────────────
    // EVENT LISTENERS — cada select actualiza los otros
    // ─────────────────────────────────────────────
    function handleSelectionChange(changedSelect) {
      repopulate(changedSelect);
      if (REQUIRE_METRIC_PROFILE && selectAncho.value && ((requiresProfile(selectAncho.value) && !selectAspecto.value) || !selectAro.value)) {
        showStatus('Completa perfil y aro para buscar la medida correcta.', 'warning');
      } else {
        hideStatus();
      }
    }

    selectAncho.addEventListener('change',   () => handleSelectionChange('ancho'));
    selectAspecto.addEventListener('change', () => handleSelectionChange('aspecto'));
    selectAro.addEventListener('change',     () => handleSelectionChange('aro'));
    selectUse?.addEventListener('change', () => setStepActive());

    finderEl.addEventListener('bikerz:tire-results-loading', () => {
      resultsLoading = true;
      finderEl.setAttribute('aria-busy', 'true');
      buttonTextEl.textContent = 'Buscando...';
      showStatus('Buscando neumáticos...', 'info');
    });
    function finishResultsLoading() {
      resultsLoading = false;
      finderEl.setAttribute('aria-busy', String(measuresLoading));
      buttonTextEl.textContent = buttonLabel;
    }
    finderEl.addEventListener('bikerz:tire-results-updated', event => {
      finishResultsLoading();
      resultsCount = event.detail.count;
      if (allCombinations.length) restoreSelectionFromUrl();
      else if (measuresLoading) showStatus('Cargando medidas disponibles...', 'info');
      else showStatus('No pudimos cargar el buscador. Intenta nuevamente; la colección y sus filtros siguen disponibles.', 'error');
      updatesEl.textContent = `${resultsCount} ${resultsCount === 1 ? 'resultado encontrado' : 'resultados encontrados'}.`;
    });
    finderEl.addEventListener('bikerz:tire-results-error', event => {
      finishResultsLoading();
      showStatus('No pudimos actualizar los resultados. Intenta buscar nuevamente o abre los resultados.', 'error');
      statusFallbackEl.href = event.detail.url;
      statusFallbackEl.hidden = false;
    });

    statusClearEl.addEventListener('click', () => {
      const params = new URLSearchParams();
      const currentParams = new URLSearchParams(window.location.search);
      ['preview_theme_id', 'view'].forEach(paramName => {
        const value = currentParams.get(paramName);
        if (value) params.append(paramName, value);
      });
      const query = params.toString();
      navigateToResults(`${COLLECTION_URL}${query ? `?${query}` : ''}#ProductGridContainer`);
    });

    // ─────────────────────────────────────────────
    // BÚSQUEDA — aplica solo los filtros con valor
    // Aro obligatorio; ancho y perfil opcionales
    // ─────────────────────────────────────────────
    btnSearch.addEventListener('click', () => {
      const ancho   = selectAncho.value;
      const aspecto = selectAspecto.value;
      const aro     = selectAro.value;
      const uso     = selectUse?.value || '';

      if (!aro || (requiresProfile(ancho) && !aspecto)) {
        showStatus('Completa perfil y aro para buscar la medida correcta.', 'warning');
        publishEvent('bikerz:tire_finder_incomplete', {
          source: FINDER_SOURCE,
          collection_handle: COLLECTION_HANDLE
        });
        return;
      }

      // Filtros de metacampos: ?filter.p.m.NAMESPACE.KEY=VALOR
      // Solo se añaden ancho y perfil si el usuario los seleccionó
      const params = new URLSearchParams();
      if (ancho) {
        params.append(`filter.p.m.${NAMESPACE_ANCHO}.${KEY_ANCHO}`, ancho);
      }
      if (aspecto) {
        params.append(`filter.p.m.${NAMESPACE_ASPECTO}.${KEY_ASPECTO}`, aspecto);
      }
      params.append(`filter.p.m.${NAMESPACE_ARO}.${KEY_ARO}`, aro);
      if (uso && USAGE_PARAM_NAME) {
        params.append(USAGE_PARAM_NAME, uso);
      }

      // Conserva el contexto técnico cuando la landing se revisa en un theme de vista previa.
      const currentParams = new URLSearchParams(window.location.search);
      ['preview_theme_id', 'view'].forEach(paramName => {
        const value = currentParams.get(paramName);
        if (value) params.append(paramName, value);
      });

      publishEvent('bikerz:tire_finder_search', {
        source: FINDER_SOURCE,
        collection_handle: COLLECTION_HANDLE,
        ancho,
        perfil: aspecto,
        aro,
        uso
      });

      navigateToResults(`${COLLECTION_URL}?${params.toString()}#ProductGridContainer`);
    });

    // ─────────────────────────────────────────────
    // ARRANCAR
    // ─────────────────────────────────────────────
    init();
  }

  function initAll() {
    document.querySelectorAll('[data-tire-finder]').forEach(initTireFinder);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll, { once: true });
  } else {
    initAll();
  }
  // Theme editor re-renders the section without reloading the page.
  document.addEventListener('shopify:section:load', initAll);

})();
