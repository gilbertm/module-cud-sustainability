/**
 * @file
 * Drives [data-cud-tabs] tab panels.
 *
 * Markup contract:
 *   [data-cud-tabs]            — root container
 *   [data-cud-tab="<id>"]      — tab button  (role="tab")
 *   [data-cud-panel="<id>"]    — tab panel   (role="tabpanel")
 *
 * Active tab button:  aria-selected="true"  + bottom border visible
 * Inactive tab button: aria-selected="false" + "hidden" removed from panel
 *
 * Keyboard: ArrowLeft / ArrowRight cycle through tabs; Home / End jump.
 */
(function (Drupal) {
  'use strict';

  Drupal.behaviors.cudTabs = {
    attach(context) {
      const roots = context.querySelectorAll
        ? Array.from(context.querySelectorAll('[data-cud-tabs]'))
        : [];

      // Also handle when context itself is a tabs root.
      if (context.dataset && context.dataset.cudTabs !== undefined) {
        roots.push(context);
      }

      roots.forEach(function (root) {
        if (root.__cudTabsInit) return;
        root.__cudTabsInit = true;

        const buttons = Array.from(root.querySelectorAll('[data-cud-tab]'));
        if (!buttons.length) return;

        function activate(btn) {
          buttons.forEach(function (b) {
            const isActive = b === btn;
            b.setAttribute('aria-selected', isActive ? 'true' : 'false');

            // Toggle bottom indicator opacity via Tailwind class on its <span>.
            const indicator = b.querySelector('span[class*="bottom-0"]');
            if (indicator) {
              if (isActive) {
                indicator.classList.remove('opacity-0');
              } else {
                indicator.classList.add('opacity-0');
              }
            }

            // Toggle text colour.
            if (isActive) {
              b.classList.add('text-[#b13634]');
              b.classList.remove('text-slate-500', 'hover:text-slate-700');
            } else {
              b.classList.remove('text-[#b13634]');
              b.classList.add('text-slate-500', 'hover:text-slate-700');
            }

            // Show / hide panel.
            const panelId = b.getAttribute('data-cud-tab');
            const panel = root.querySelector('[data-cud-panel="' + panelId + '"]');
            if (panel) {
              if (isActive) {
                panel.classList.remove('hidden');
              } else {
                panel.classList.add('hidden');
              }
            }
          });
        }

        buttons.forEach(function (btn, idx) {
          btn.addEventListener('click', function () {
            activate(btn);
          });

          btn.addEventListener('keydown', function (e) {
            let target = null;
            if (e.key === 'ArrowRight') {
              target = buttons[(idx + 1) % buttons.length];
            } else if (e.key === 'ArrowLeft') {
              target = buttons[(idx - 1 + buttons.length) % buttons.length];
            } else if (e.key === 'Home') {
              target = buttons[0];
            } else if (e.key === 'End') {
              target = buttons[buttons.length - 1];
            }
            if (target) {
              e.preventDefault();
              target.focus();
              activate(target);
            }
          });
        });
      });
    },
  };
})(Drupal);
