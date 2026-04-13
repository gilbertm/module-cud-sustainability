/**
 * @file
 * Drupal behavior for CUD Sustainability carousels.
 *
 * Drives [data-cud-carousel] containers. Each carousel consists of:
 *   [data-cud-carousel-track]   — the scrolling flex row
 *   [data-cud-carousel-slide]*  — individual slides (min-w-full)
 *   [data-cud-carousel-prev]    — previous button (optional)
 *   [data-cud-carousel-next]    — next button  (optional)
 *   [data-cud-carousel-dot="N"] — dot indicators (optional)
 */
(function (Drupal) {
  'use strict';

  Drupal.behaviors.cudResearchCarousel = {
    attach: function (context) {
      var carousels = context.querySelectorAll('[data-cud-carousel]');

      carousels.forEach(function (carousel) {
        if (carousel.dataset.cudCarouselInit) return;
        carousel.dataset.cudCarouselInit = '1';

        var track = carousel.querySelector('[data-cud-carousel-track]');
        var slides = carousel.querySelectorAll('[data-cud-carousel-slide]');
        var prevBtn = carousel.querySelector('[data-cud-carousel-prev]');
        var nextBtn = carousel.querySelector('[data-cud-carousel-next]');
        var dots = carousel.querySelectorAll('[data-cud-carousel-dot]');
        var progressBar = carousel.querySelector('[data-cud-carousel-progress-bar]');
        var counter = carousel.querySelector('[data-cud-carousel-count]');
        var toggleBtn = carousel.querySelector('[data-cud-carousel-toggle]');
        var autoplayDelay = parseInt(carousel.getAttribute('data-cud-carousel-autoplay') || '5000', 10);
        if (isNaN(autoplayDelay) || autoplayDelay < 1500) {
          autoplayDelay = 5000;
        }

        if (!track || slides.length < 2) return;

        var current = 0;
        var autoplayTimer = null;
        var isPaused = false;
        var isUserPaused = false;
        var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        carousel.setAttribute('tabindex', '0');

        function restartProgress() {
          if (!progressBar) return;

          progressBar.style.transition = 'none';
          progressBar.style.width = '0%';

          if (prefersReducedMotion || isPaused || isUserPaused) {
            return;
          }

          // Force style flush before animating width again.
          progressBar.offsetWidth;
          progressBar.style.transition = 'width ' + autoplayDelay + 'ms linear';
          progressBar.style.width = '100%';
        }

        function goTo(index) {
          current = (index + slides.length) % slides.length;
          track.style.transform = 'translateX(-' + (current * 100) + '%)';

          slides.forEach(function (slide, i) {
            slide.setAttribute('aria-hidden', i === current ? 'false' : 'true');
          });

          if (counter) {
            counter.textContent = (current + 1) + ' / ' + slides.length;
          }

          dots.forEach(function (dot, i) {
            var isActive = i === current;
            dot.classList.toggle('w-8', isActive);
            dot.classList.toggle('w-2', !isActive);
            dot.classList.toggle('bg-white', isActive);
            dot.classList.toggle('bg-white/50', !isActive);
          });

          restartProgress();
        }

        function startAutoplay() {
          if (prefersReducedMotion || isUserPaused) return;
          clearInterval(autoplayTimer);
          autoplayTimer = setInterval(function () {
            goTo(current + 1);
          }, autoplayDelay);
          isPaused = false;
          restartProgress();
        }

        function setToggleVisual(paused) {
          if (!toggleBtn) return;
          var iconPause = toggleBtn.querySelector('[data-icon-pause]');
          var iconPlay = toggleBtn.querySelector('[data-icon-play]');
          if (paused) {
            toggleBtn.setAttribute('aria-label', 'Play carousel');
            toggleBtn.setAttribute('aria-pressed', 'true');
            if (iconPause) iconPause.classList.add('hidden');
            if (iconPlay) iconPlay.classList.remove('hidden');
          } else {
            toggleBtn.setAttribute('aria-label', 'Pause carousel');
            toggleBtn.setAttribute('aria-pressed', 'false');
            if (iconPause) iconPause.classList.remove('hidden');
            if (iconPlay) iconPlay.classList.add('hidden');
          }
        }

        function stopAutoplay() {
          clearInterval(autoplayTimer);
          isPaused = true;
          if (progressBar) {
            progressBar.style.transition = 'none';
          }
        }

        if (toggleBtn) {
          toggleBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            isUserPaused = !isUserPaused;
            if (isUserPaused) {
              stopAutoplay();
            } else {
              startAutoplay();
            }
            setToggleVisual(isUserPaused);
          });
        }

        if (prevBtn) {
          prevBtn.addEventListener('click', function () {
            stopAutoplay();
            goTo(current - 1);
            startAutoplay();
          });
        }

        if (nextBtn) {
          nextBtn.addEventListener('click', function () {
            stopAutoplay();
            goTo(current + 1);
            startAutoplay();
          });
        }

        dots.forEach(function (dot) {
          dot.addEventListener('click', function () {
            stopAutoplay();
            goTo(parseInt(dot.dataset.cudCarouselDot, 10));
            startAutoplay();
          });
        });

        // Pause autoplay on hover / focus.
        carousel.addEventListener('mouseenter', stopAutoplay);
        carousel.addEventListener('focusin', stopAutoplay);
        carousel.addEventListener('mouseleave', startAutoplay);
        carousel.addEventListener('focusout', function (e) {
          if (!carousel.contains(e.relatedTarget)) {
            startAutoplay();
          }
        });

        carousel.addEventListener('keydown', function (event) {
          if (event.key === 'ArrowLeft') {
            event.preventDefault();
            stopAutoplay();
            goTo(current - 1);
            startAutoplay();
          }
          else if (event.key === 'ArrowRight') {
            event.preventDefault();
            stopAutoplay();
            goTo(current + 1);
            startAutoplay();
          }
        });

        document.addEventListener('visibilitychange', function () {
          if (document.hidden) {
            stopAutoplay();
          }
          else {
            startAutoplay();
          }
        });

        // Touch / swipe support.
        var touchStartX = 0;
        carousel.addEventListener('touchstart', function (e) {
          touchStartX = e.changedTouches[0].screenX;
          stopAutoplay();
        }, { passive: true });
        carousel.addEventListener('touchend', function (e) {
          var diff = touchStartX - e.changedTouches[0].screenX;
          if (Math.abs(diff) > 40) {
            goTo(current + (diff > 0 ? 1 : -1));
          }
          startAutoplay();
        }, { passive: true });

        goTo(0);
        startAutoplay();
      });
    }
  };

  Drupal.behaviors.cudResearchNavigation = {
    attach: function (context) {
      var navContainers = context.querySelectorAll('#logo-navigation, #logo-navigation-daisyui');
      if (!navContainers.length) return;

      navContainers.forEach(function (navContainer) {
        if (navContainer.dataset.cudNavInit) return;

        var toggleBtn = navContainer.querySelector('[data-sustainability-nav-toggle]');
        var navPanels = navContainer.querySelector('[data-sustainability-nav-panels]');
        if (!toggleBtn || !navPanels) return;

        navContainer.dataset.cudNavInit = '1';
        var daisyDropdownItems = navContainer.querySelectorAll('.sustainability-primary-item.dropdown');

        function closeAllDaisyDropdowns(exceptItem) {
          daisyDropdownItems.forEach(function (item) {
            if (item !== exceptItem) {
              item.classList.remove('is-dropdown-open');
              var trigger = item.querySelector('.sustainability-primary-item__link');
              if (trigger) {
                trigger.setAttribute('aria-expanded', 'false');
              }
            }
          });
        }

        function setDaisyDropdownOpen(item, isOpen) {
          if (!item) {
            return;
          }

          item.classList.toggle('is-dropdown-open', isOpen);
          var trigger = item.querySelector('.sustainability-primary-item__link');
          if (trigger) {
            trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          }
        }

        daisyDropdownItems.forEach(function (item) {
          var trigger = item.querySelector('.sustainability-primary-item__link');
          if (!trigger) {
            return;
          }

          trigger.setAttribute('aria-haspopup', 'true');
          trigger.setAttribute('aria-expanded', 'false');

          trigger.addEventListener('click', function (event) {
            var isDesktopView = window.matchMedia('(min-width: 1024px)').matches;
            if (isDesktopView) {
              return;
            }

            event.preventDefault();
            event.stopPropagation();
            var willOpen = !item.classList.contains('is-dropdown-open');
            closeAllDaisyDropdowns(item);
            setDaisyDropdownOpen(item, willOpen);
          });

          item.addEventListener('mouseenter', function () {
            if (!window.matchMedia('(min-width: 1024px)').matches) {
              return;
            }

            closeAllDaisyDropdowns(item);
            setDaisyDropdownOpen(item, true);
          });

          item.addEventListener('mouseleave', function () {
            if (!window.matchMedia('(min-width: 1024px)').matches) {
              return;
            }

            setDaisyDropdownOpen(item, false);
          });

          item.addEventListener('focusin', function () {
            if (!window.matchMedia('(min-width: 1024px)').matches) {
              return;
            }

            closeAllDaisyDropdowns(item);
            setDaisyDropdownOpen(item, true);
          });

          item.addEventListener('focusout', function (event) {
            if (!window.matchMedia('(min-width: 1024px)').matches) {
              return;
            }

            if (!item.contains(event.relatedTarget)) {
              setDaisyDropdownOpen(item, false);
            }
          });
        });

        function setOpenState(isOpen) {
          navContainer.classList.toggle('is-nav-open', isOpen);
          toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
          if (!isOpen) {
            closeAllDaisyDropdowns();
          }
          var overlay = document.querySelector('[data-sustainability-nav-overlay]');
          if (overlay) {
            overlay.classList.toggle('is-active', isOpen);
            overlay.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
          }
        }

        toggleBtn.addEventListener('click', function () {
          setOpenState(!navContainer.classList.contains('is-nav-open'));
        });

        var navOverlay = document.querySelector('[data-sustainability-nav-overlay]');
        if (navOverlay && !navOverlay.dataset.cudOverlayInit) {
          navOverlay.dataset.cudOverlayInit = '1';
          navOverlay.addEventListener('click', function () {
            setOpenState(false);
          });
        }

        navPanels.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', function () {
            if (window.matchMedia('(max-width: 1023.98px)').matches) {
              setOpenState(false);
            }
          });
        });

        document.addEventListener('keydown', function (event) {
          if (event.key === 'Escape') {
            setOpenState(false);
            closeAllSubmenus();
            closeAllDaisyDropdowns();
          }
        });

        var desktopMediaQuery = window.matchMedia('(min-width: 1024px)');
        var panelByItem = new WeakMap();
        var panelOrigin = new WeakMap();

        navContainer.querySelectorAll('[data-sustainability-submenu]').forEach(function (item) {
          var panel = item.querySelector('[data-sustainability-submenu-panel]');
          if (panel) {
            panelByItem.set(item, panel);
          }
        });

        function isDesktop() {
          return desktopMediaQuery.matches;
        }

        function ensurePanelPortal() {
          var portal = document.querySelector('[data-sustainability-mega-portal]');
          if (!portal) {
            portal = document.createElement('div');
            portal.setAttribute('data-sustainability-mega-portal', '');
            portal.className = 'sustainability-mega-panel-portal';
            document.body.appendChild(portal);
          }
          return portal;
        }

      function getPanelForItem(item) {
        return panelByItem.get(item) || null;
      }

      function positionDetachedPanel(panel) {
        var navRect = navContainer.getBoundingClientRect();
        panel.style.top = (navRect.bottom + 8) + 'px';
        panel.style.left = navRect.left + 'px';
        panel.style.width = navRect.width + 'px';
      }

      function detachPanel(item) {
        if (!isDesktop()) {
          return;
        }

        var panel = getPanelForItem(item);
        if (!panel) {
          return;
        }

        if (!panelOrigin.has(panel)) {
          panelOrigin.set(panel, {
            parent: panel.parentNode,
            nextSibling: panel.nextSibling
          });
        }

        var portal = ensurePanelPortal();
        if (panel.parentNode !== portal) {
          portal.appendChild(panel);
        }

        panel.classList.add('is-detached-mega-panel');
        panel.style.display = 'block';
        positionDetachedPanel(panel);
      }

      function restorePanel(item) {
        var panel = getPanelForItem(item);
        if (!panel) {
          return;
        }

        var origin = panelOrigin.get(panel);
        if (origin && origin.parent) {
          if (origin.nextSibling && origin.nextSibling.parentNode === origin.parent) {
            origin.parent.insertBefore(panel, origin.nextSibling);
          } else {
            origin.parent.appendChild(panel);
          }
        }

        panel.classList.remove('is-detached-mega-panel');
        panel.style.display = '';
        panel.style.top = '';
        panel.style.left = '';
        panel.style.width = '';
      }

      function repositionOpenDetachedPanel() {
        if (!isDesktop()) {
          return;
        }

        var openItem = navContainer.querySelector('[data-sustainability-submenu].is-submenu-open');
        if (!openItem) {
          return;
        }

        var panel = getPanelForItem(openItem);
        if (!panel || !panel.classList.contains('is-detached-mega-panel')) {
          return;
        }

        positionDetachedPanel(panel);
      }

      function setItemOpenState(item, isOpen) {
        var itemToggle = item.querySelector('[data-sustainability-submenu-toggle]');
        item.classList.toggle('is-submenu-open', isOpen);
        if (itemToggle) {
          itemToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }

        if (isOpen) {
          detachPanel(item);
        } else {
          restorePanel(item);
        }
      }

      function closeAllSubmenus(exceptItem) {
        navContainer.querySelectorAll('[data-sustainability-submenu].is-submenu-open').forEach(function (openedItem) {
          if (openedItem !== exceptItem) {
            setItemOpenState(openedItem, false);
          }
        });
      }

      function handleSubmenuToggle(item, event) {
        if (!item) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        var willOpen = !item.classList.contains('is-submenu-open');
        closeAllSubmenus(item);
        setItemOpenState(item, willOpen);
      }

      // Direct bindings as primary path (works even if delegated target logic fails).
      navContainer.querySelectorAll('[data-sustainability-submenu-toggle]').forEach(function (itemToggle) {
        itemToggle.addEventListener('click', function (event) {
          var item = itemToggle.closest('[data-sustainability-submenu]');
          handleSubmenuToggle(item, event);
        });
      });

      // Desktop UX: first click on a parent link opens megamenu instead of navigating away.
      // Second click follows the link once submenu is already open.
      navContainer.querySelectorAll('[data-sustainability-submenu] .sustainability-primary-item__link').forEach(function (parentLink) {
        parentLink.addEventListener('click', function (event) {
          if (!window.matchMedia('(min-width: 1024px)').matches) {
            return;
          }

          var item = parentLink.closest('[data-sustainability-submenu]');
          if (!item) {
            return;
          }

          if (!item.classList.contains('is-submenu-open')) {
            handleSubmenuToggle(item, event);
          }
        });
      });

      // Use delegation so toggle behavior remains reliable if markup changes.
      navContainer.addEventListener('click', function (event) {
        var itemToggle = event.target.closest('[data-sustainability-submenu-toggle]');
        if (!itemToggle || !navContainer.contains(itemToggle)) {
          return;
        }

        var item = itemToggle.closest('[data-sustainability-submenu]');
        if (!item) {
          return;
        }

        handleSubmenuToggle(item, event);
      });

      document.addEventListener('click', function (event) {
        var portal = document.querySelector('[data-sustainability-mega-portal]');
        var clickedInsideDetachedPanel = portal && portal.contains(event.target);
        if (!navContainer.contains(event.target) && !clickedInsideDetachedPanel) {
          closeAllSubmenus();
          closeAllDaisyDropdowns();
        }
      });

      window.addEventListener('scroll', repositionOpenDetachedPanel, { passive: true });
      window.addEventListener('resize', function () {
        if (window.matchMedia('(min-width: 1024px)').matches) {
          closeAllDaisyDropdowns();
        }

        if (!isDesktop()) {
          closeAllSubmenus();
          return;
        }

        repositionOpenDetachedPanel();
      });
      });
    }
  };

})(Drupal);
