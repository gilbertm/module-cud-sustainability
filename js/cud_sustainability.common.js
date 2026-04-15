/**
 * @file
 * cud_sustainability.common.js
 *
 * General-purpose behaviors for the CUD Sustainability module.
 * Attached via the `cud_sustainability/page` library on every
 * sustainability page.
 */
(function (Drupal) {
  'use strict';

  /**
   * Common init behavior.
   *
   * Re-runs on AJAX page updates (context is the re-inserted DOM fragment).
   */
  Drupal.behaviors.cudSustainabilityCommon = {
    attach: function (context) {

      // ── Responsive carousel (tc-carousel) ──────────────────────────────
      // Handles any #tc-carousel element: sets item widths via CSS
      // (the <style> block in the template owns breakpoints) and
      // auto-advances every 3.5 s on mobile/tablet.
      context.querySelectorAll('#tc-carousel').forEach(function (c) {
        if (c.dataset.tcInit) return;
        c.dataset.tcInit = '1';

        var idx = 0;
        setInterval(function () {
          var items = c.querySelectorAll('.tc-item');
          if (!items.length || c.scrollWidth <= c.clientWidth + 4) return;
          idx = (idx + 1) % items.length;
          c.scrollTo({ left: items[idx].offsetLeft, behavior: 'smooth' });
        }, 3500);
      });

    }
  };

})(Drupal);
