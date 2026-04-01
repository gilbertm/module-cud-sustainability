/**
 * @file
 * Drupal behavior for CUD Sustainability accessibility toolbar and language selector.
 *
 * Font size:   persisted in localStorage as 'cud_sustainability_font_step' (int, ±3 range).
 * High contrast: persisted in localStorage as 'cud_sustainability_contrast' ('1' or '').
 * Language selector: lightweight dropdown, closes on outside click / Escape.
 */
(function (Drupal, document) {
  'use strict';

  // ── Font-size ──────────────────────────────────────────────────────────────

  var FONT_KEY = 'cud_sustainability_font_step';
  var FONT_MIN = -3;
  var FONT_MAX = 3;
  var FONT_STEP_PX = 1; // px change per step

  function getFontStep() {
    var stored = parseInt(localStorage.getItem(FONT_KEY), 10);
    return isNaN(stored) ? 0 : Math.min(FONT_MAX, Math.max(FONT_MIN, stored));
  }

  function applyFontStep(step) {
    var page = document.querySelector('.cud-sustainability-page-layout');
    if (!page) return;
    if (step === 0) {
      page.style.fontSize = '';
    } else {
      page.style.fontSize = (16 + step * FONT_STEP_PX) + 'px';
    }
    localStorage.setItem(FONT_KEY, step);
  }

  // ── High contrast ──────────────────────────────────────────────────────────

  var CONTRAST_KEY = 'cud_sustainability_contrast';
  var CONTRAST_CLASS = 'cud-sustainability-high-contrast';

  function getContrastOn() {
    return localStorage.getItem(CONTRAST_KEY) === '1';
  }

  function applyContrast(on) {
    var page = document.querySelector('.cud-sustainability-page-layout');
    if (!page) return;
    page.classList.toggle(CONTRAST_CLASS, on);
    localStorage.setItem(CONTRAST_KEY, on ? '1' : '');

    var btn = document.querySelector('[data-sustainability-contrast]');
    if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
  }

  // ── Behavior ───────────────────────────────────────────────────────────────

  Drupal.behaviors.cudResearchAccessibility = {
    attach: function (context) {
      // Apply persisted preferences on every attach (covers ajax rebuilds).
      applyFontStep(getFontStep());
      applyContrast(getContrastOn());

      // Font buttons.
      var fontBtns = context.querySelectorAll('[data-sustainability-font]');
      fontBtns.forEach(function (btn) {
        if (btn.dataset.cudA11yInit) return;
        btn.dataset.cudA11yInit = '1';

        btn.addEventListener('click', function () {
          var action = btn.getAttribute('data-sustainability-font');
          var step = getFontStep();
          if (action === 'increase') step = Math.min(FONT_MAX, step + 1);
          else if (action === 'decrease') step = Math.max(FONT_MIN, step - 1);
          else step = 0;
          applyFontStep(step);
        });
      });

      // Contrast toggle.
      var contrastBtn = context.querySelector('[data-sustainability-contrast]');
      if (contrastBtn && !contrastBtn.dataset.cudContrastInit) {
        contrastBtn.dataset.cudContrastInit = '1';
        contrastBtn.addEventListener('click', function () {
          applyContrast(!getContrastOn());
        });
      }

      // ── Language selector dropdown ────────────────────────────────────────
      var selectors = context.querySelectorAll('[data-sustainability-lang-selector]');
      selectors.forEach(function (selector) {
        if (selector.dataset.cudLangInit) return;
        selector.dataset.cudLangInit = '1';

        var toggle = selector.querySelector('[data-sustainability-lang-toggle]');
        var list = selector.querySelector('.sustainability-lang-selector__list');
        if (!toggle || !list) return;

        function openDropdown() {
          list.classList.add('is-open');
          toggle.setAttribute('aria-expanded', 'true');
        }

        function closeDropdown() {
          list.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
        }

        toggle.addEventListener('click', function () {
          var isOpen = list.classList.contains('is-open');
          isOpen ? closeDropdown() : openDropdown();
        });

        document.addEventListener('click', function (e) {
          if (!selector.contains(e.target)) closeDropdown();
        });

        document.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') closeDropdown();
        });
      });
    }
  };

})(Drupal, document);
