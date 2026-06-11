/**
 * ds-toggle.js
 * Shared Aero ↔ Shadcn toggle logic.
 * Reads data-root (default: "root") and data-default (default: "aero") from the
 * <script> tag so each page can customize without editing this file.
 *
 * Usage on any page:
 *   <script src="ds-toggle.js" data-root="root" data-default="aero"></script>
 *
 * Exposes: window.DS.setMode('aero' | 'shadcn')
 */
(function () {
  const tag = document.currentScript;
  const ROOT_ID = (tag && tag.dataset.root) || 'root';
  const DEFAULT_MODE = (tag && tag.dataset.default) || 'aero';

  function setMode(mode) {
    const root = document.getElementById(ROOT_ID);
    if (!root) return;

    const btnAero = document.getElementById('btn-aero');
    const btnShadcn = document.getElementById('btn-shadcn');

    if (mode === 'shadcn') {
      root.classList.add('shadcn');
      btnShadcn && btnShadcn.classList.add('active');
      btnAero && btnAero.classList.remove('active');
    } else {
      root.classList.remove('shadcn');
      btnAero && btnAero.classList.add('active');
      btnShadcn && btnShadcn.classList.remove('active');
    }

    try { localStorage.setItem('ds-mode', mode); } catch (_) {}
  }

  // Restore last-used mode (or default)
  function init() {
    let saved;
    try { saved = localStorage.getItem('ds-mode'); } catch (_) {}
    setMode(saved || DEFAULT_MODE);
  }

  window.DS = { setMode };

  // Run init after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
