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
      context.querySelectorAll('#tc-carousel').forEach(function (c) {
        if (c.dataset.tcInit) return;
        c.dataset.tcInit = '1';

        // Wrap in a relative container so arrows can be absolutely positioned.
        var wrapper = document.createElement('div');
        wrapper.style.cssText = 'position:relative';
        c.parentNode.insertBefore(wrapper, c);
        wrapper.appendChild(c);

        // Build a prev/next arrow button.
        function makeBtn(dir) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.setAttribute('aria-label', dir === 'prev' ? Drupal.t('Previous') : Drupal.t('Next'));
          var side = dir === 'prev' ? 'left:8px' : 'right:8px';
          btn.style.cssText = 'position:absolute;top:50%;' + side + ';transform:translateY(-50%);' +
            'z-index:10;display:flex;align-items:center;justify-content:center;' +
            'width:30px;height:30px;border-radius:50%;' +
            'background:rgba(255,255,255,0.92);border:1px solid #e2e8f0;' +
            'box-shadow:0 1px 4px rgba(0,0,0,.14);cursor:pointer;' +
            'transition:opacity .2s,background .15s;';
          var icon = dir === 'prev' ? 'left' : 'right';
          btn.innerHTML = '<i class="fa-solid fa-chevron-' + icon + '" style="font-size:11px;color:#475569" aria-hidden="true"></i>';
          btn.onmouseenter = function () { btn.style.background = 'white'; };
          btn.onmouseleave = function () { btn.style.background = 'rgba(255,255,255,0.92)'; };
          return btn;
        }

        var btnPrev = makeBtn('prev');
        var btnNext = makeBtn('next');
        wrapper.appendChild(btnPrev);
        wrapper.appendChild(btnNext);

        var idx = 0;

        function scrollable() {
          return c.scrollWidth > c.clientWidth + 4;
        }

        function updateArrows() {
          var show = scrollable();
          var atStart = c.scrollLeft <= 4;
          var atEnd = c.scrollLeft >= c.scrollWidth - c.clientWidth - 4;
          btnPrev.style.opacity = (show && !atStart) ? '1' : '0';
          btnPrev.style.pointerEvents = (show && !atStart) ? 'auto' : 'none';
          btnNext.style.opacity = (show && !atEnd) ? '1' : '0';
          btnNext.style.pointerEvents = (show && !atEnd) ? 'auto' : 'none';
        }

        function goTo(i) {
          var items = c.querySelectorAll('.tc-item');
          if (!items.length) return;
          idx = (i + items.length) % items.length;
          c.scrollTo({ left: items[idx].offsetLeft, behavior: 'smooth' });
        }

        btnPrev.addEventListener('click', function () { goTo(idx - 1); });
        btnNext.addEventListener('click', function () { goTo(idx + 1); });
        c.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows);
        updateArrows();

        // Auto-advance every 3.5 s when not all items are visible.
        setInterval(function () {
          if (!scrollable()) return;
          var items = c.querySelectorAll('.tc-item');
          if (!items.length) return;
          idx = (idx + 1) % items.length;
          c.scrollTo({ left: items[idx].offsetLeft, behavior: 'smooth' });
        }, 3500);
      });

    }
  };

})(Drupal);
