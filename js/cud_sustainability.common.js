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

  // ── Lightbox (singleton, created once on first use) ───────────────────────
  /**
   * ensureLightbox()
   *
   * Standalone lightbox utility. Safe to call multiple times — the overlay is
   * created only once and reused for every image on the page.
   *
   * HOW TO USE
   * ----------
   * Option A — automatic wiring (preferred)
   *   Add the class `tc-lightbox` to any <img> element.
   *   The Drupal behavior in this file will detect it on attach and wire the
   *   click handler automatically.
   *
   *   <img src="photo.jpg" alt="…" class="tc-lightbox" />
   *
   * Option B — manual / programmatic
   *   Call ensureLightbox() once to guarantee the overlay exists, then invoke
   *   the global bridge directly whenever you need to open it:
   *
   *   ensureLightbox();
   *   window._cudOpenLightbox(imageSrc, imageAlt);
   *
   * CLOSING
   *   • Click the × button (top-right)
   *   • Press Escape
   *   • Click anywhere outside the image (on the dark overlay)
   */
  var _lightboxReady = false;

  function ensureLightbox() {
    if (_lightboxReady) return;
    _lightboxReady = true;

    var overlay = document.createElement('div');
    overlay.id = 'cud-lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', Drupal.t('Image preview'));
    overlay.style.cssText =
      'display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9000;' +
      'background:rgba(0,0,0,.88);align-items:center;justify-content:center;cursor:zoom-out;' +
      'overscroll-behavior:contain;-webkit-tap-highlight-color:transparent;';

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', Drupal.t('Close'));
    closeBtn.style.cssText =
      'position:absolute;top:12px;right:12px;width:44px;height:44px;border-radius:50%;' +
      'background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.3);' +
      'color:#fff;font-size:18px;cursor:pointer;display:flex;align-items:center;' +
      'justify-content:center;transition:background .15s;touch-action:manipulation;' +
      '-webkit-tap-highlight-color:transparent;-webkit-appearance:none;border:none;';
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
    closeBtn.onmouseenter = function () { closeBtn.style.background = 'rgba(255,255,255,.28)'; };
    closeBtn.onmouseleave = function () { closeBtn.style.background = 'rgba(255,255,255,.15)'; };

    var lbImg = document.createElement('img');
    lbImg.id = 'cud-lightbox-img';
    lbImg.alt = '';
    lbImg.style.cssText =
      'max-width:90vw;max-height:88vh;object-fit:contain;border-radius:8px;' +
      'box-shadow:0 8px 40px rgba(0,0,0,.6);cursor:default;';
    lbImg.addEventListener('click', function (e) { e.stopPropagation(); });

    overlay.appendChild(closeBtn);
    overlay.appendChild(lbImg);
    document.body.appendChild(overlay);

    // Saved scroll position for iOS scroll-lock restore.
    var _lbScrollY = 0;

    function openLightbox(src, alt) {
      lbImg.src = src;
      lbImg.alt = alt || '';
      // iOS scroll-lock: freezing body position prevents background scroll.
      _lbScrollY = window.pageYOffset || document.documentElement.scrollTop;
      document.body.style.position = 'fixed';
      document.body.style.top = '-' + _lbScrollY + 'px';
      document.body.style.width = '100%';
      overlay.style.display = 'flex';
      closeBtn.focus();
    }
    function closeLightbox() {
      overlay.style.display = 'none';
      // Restore scroll position after iOS scroll-lock.
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, _lbScrollY);
      lbImg.src = '';
    }

    closeBtn.addEventListener('click', function (e) { e.stopPropagation(); closeLightbox(); });
    overlay.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.style.display === 'flex') { closeLightbox(); }
    });
    // Swipe down on the overlay to close (mobile gesture).
    var _lbTouchY = 0;
    overlay.addEventListener('touchstart', function (e) {
      _lbTouchY = e.touches[0].clientY;
    }, { passive: true });
    overlay.addEventListener('touchend', function (e) {
      if (e.changedTouches[0].clientY - _lbTouchY > 60) { closeLightbox(); }
    }, { passive: true });

    window._cudOpenLightbox = openLightbox;
  }

  /**
   * Common init behavior.
   *
   * Re-runs on AJAX page updates (context is the re-inserted DOM fragment).
   */
  Drupal.behaviors.cudSustainabilityCommon = {
    attach: function (context) {

      // ── Lightbox triggers (.tc-lightbox images) ────────────────────────
      ensureLightbox();
      context.querySelectorAll('img.tc-lightbox').forEach(function (el) {
        if (el.dataset.lightboxInit) return;
        el.dataset.lightboxInit = '1';
        el.style.cursor = 'zoom-in';
        el.addEventListener('click', function () {
          if (window._cudOpenLightbox) window._cudOpenLightbox(el.src, el.alt);
        });
      });

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
            'width:44px;height:44px;border-radius:50%;' +
            'background:rgba(255,255,255,0.92);border:1px solid #e2e8f0;' +
            'box-shadow:0 1px 4px rgba(0,0,0,.14);cursor:pointer;' +
            'transition:opacity .2s,background .15s;touch-action:manipulation;' +
            '-webkit-tap-highlight-color:transparent;-webkit-appearance:none;';
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
        var _touching = false;

        // scrollBehavior fallback: older Safari/iOS silently ignores { behavior:'smooth' }.
        function carouselScrollTo(left) {
          if ('scrollBehavior' in document.documentElement.style) {
            c.scrollTo({ left: left, behavior: 'smooth' });
          } else {
            c.scrollLeft = left;
          }
        }

        // Pause auto-advance while the user is touching the carousel.
        c.addEventListener('touchstart', function () { _touching = true; }, { passive: true });
        c.addEventListener('touchend', function () {
          setTimeout(function () { _touching = false; }, 2000);
        }, { passive: true });

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
          carouselScrollTo(items[idx].offsetLeft);
        }

        btnPrev.addEventListener('click', function () { goTo(idx - 1); });
        btnNext.addEventListener('click', function () { goTo(idx + 1); });
        c.addEventListener('scroll', updateArrows, { passive: true });
        window.addEventListener('resize', updateArrows);
        updateArrows();

        // Auto-advance every 3.5 s — skipped while user is touching.
        setInterval(function () {
          if (_touching || !scrollable()) return;
          var items = c.querySelectorAll('.tc-item');
          if (!items.length) return;
          idx = (idx + 1) % items.length;
          carouselScrollTo(items[idx].offsetLeft);
        }, 3500);
      });

      // ── Generic filterable list (select + cards/items) ─────────────────
      // Reusable wiring for any page that needs client-side category filtering.
      // Required: <select data-cud-filter-control ...>
      // Optional data attributes on select:
      //   data-cud-filter-target="#list-id"
      //   data-cud-filter-item-selector="[data-category]"
      //   data-cud-filter-item-attr="data-category"
      //   data-cud-filter-count-target="#count-id"
      //   data-cud-filter-count-singular="policy"
      //   data-cud-filter-count-plural="policies"
      context.querySelectorAll('select[data-cud-filter-control]').forEach(function (select) {
        if (select.dataset.cudFilterInit) return;
        select.dataset.cudFilterInit = '1';

        var targetSelector = select.getAttribute('data-cud-filter-target');
        var itemSelector = select.getAttribute('data-cud-filter-item-selector') ||
          '[data-cud-filter-value],[data-policy-category],[data-filter-category]';
        var itemAttr = select.getAttribute('data-cud-filter-item-attr');
        var countSelector = select.getAttribute('data-cud-filter-count-target');
        var singular = select.getAttribute('data-cud-filter-count-singular') || Drupal.t('item');
        var plural = select.getAttribute('data-cud-filter-count-plural') || Drupal.t('items');

        var list = targetSelector ? document.querySelector(targetSelector) : null;
        if (!list) return;

        var countEl = countSelector ? document.querySelector(countSelector) : null;

        function getItemValue(item) {
          if (itemAttr) {
            return item.getAttribute(itemAttr) || '';
          }
          return item.dataset.cudFilterValue || item.dataset.policyCategory || item.dataset.filterCategory || '';
        }

        function refreshFilteredList() {
          var selected = select.value;
          var count = 0;

          list.querySelectorAll(itemSelector).forEach(function (item) {
            var value = getItemValue(item);
            var visible = !selected || value === selected;
            item.hidden = !visible;
            if (visible) {
              count += 1;
            }
          });

          if (countEl) {
            countEl.textContent = count + ' ' + (count === 1 ? singular : plural);
          }
        }

        select.addEventListener('change', refreshFilteredList);
        refreshFilteredList();
      });

    }
  };

})(Drupal);
