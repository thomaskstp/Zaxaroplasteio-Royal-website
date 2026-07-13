/* ================================================================
   Ζαχαροπλαστείο Royal — animations.js
   Loaded on every page (after i18n.js). Two independent features:
     1. Hero carousel — crossfades the five hero photos, with dots.
     2. Scroll reveal — fades sections up as they enter the viewport.
   Both are progressive enhancements and both bow out when the user
   asks for reduced motion.
   ================================================================ */
(function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* ============================================================
       1. Hero carousel
       Advances the .is-active class across the stacked .hero-slide
       images (the CSS crossfades them). Builds clickable dots,
       auto-advances every 5s and pauses while hovered/focused.
       ============================================================ */
    function initCarousel() {
        var carousel = document.querySelector(".hero-carousel");
        if (!carousel) return;

        var slides = Array.prototype.slice.call(
            carousel.querySelectorAll(".hero-slide")
        );
        if (slides.length < 2) return;

        var current = 0;
        var timer = null;
        var INTERVAL = 5000;

        // Build the dot controls.
        var dots = document.createElement("div");
        dots.className = "hero-dots";
        var dotButtons = slides.map(function (_, i) {
            var dot = document.createElement("button");
            dot.type = "button";
            dot.className = "hero-dot" + (i === 0 ? " is-active" : "");
            dot.setAttribute("aria-label", "Slide " + (i + 1));
            dot.addEventListener("click", function () {
                show(i);
                restart();
            });
            dots.appendChild(dot);
            return dot;
        });

        var frame = carousel.closest(".hero-frame") || carousel.parentElement;
        frame.appendChild(dots);

        function show(next) {
            slides[current].classList.remove("is-active");
            dotButtons[current].classList.remove("is-active");
            current = (next + slides.length) % slides.length;
            slides[current].classList.add("is-active");
            dotButtons[current].classList.add("is-active");
        }

        function advance() {
            show(current + 1);
        }

        function start() {
            if (prefersReducedMotion) return;
            timer = window.setInterval(advance, INTERVAL);
        }

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        function restart() {
            stop();
            start();
        }

        // Pause the rotation while the user is looking closely.
        frame.addEventListener("mouseenter", stop);
        frame.addEventListener("mouseleave", start);
        frame.addEventListener("focusin", stop);
        frame.addEventListener("focusout", start);

        start();
    }

    /* ============================================================
       2. Scroll reveal
       Adds .reveal (which hides the element) only now that JS is
       running — so no-JS visitors still see everything — then adds
       .is-visible the first time each element scrolls into view.
       Elements are staggered within their own parent so each row or
       grid cascades from its own start.
       ============================================================ */
    function initReveal() {
        if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

        // [selector, per-item stagger in ms]
        var groups = [
            [".features-header", 0],
            [".feature-item", 110],
            [".products-header", 0],
            [".product-card", 110],
            [".story-image", 0],
            [".story-text", 0],
            [".page-hero-eyebrow", 0],
            [".page-hero-title", 90],
            [".page-hero-sub", 90],
            [".service-media", 0],
            [".service-title", 90],
            [".about-copy", 0],
            [".about-philosophy-eyebrow", 0],
            [".value-item", 110],
            [".quote-text", 0],
            [".quote-signature", 120],
            [".contact-info", 0],
            [".contact-form", 120]
        ];

        var observer = new IntersectionObserver(
            function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
        );

        groups.forEach(function (group) {
            var selector = group[0];
            var step = group[1];
            var indexByParent = new Map();

            document.querySelectorAll(selector).forEach(function (el) {
                el.classList.add("reveal");

                if (step) {
                    var parent = el.parentElement;
                    var idx = indexByParent.get(parent) || 0;
                    // Cap the cascade so lower rows don't wait too long.
                    el.style.transitionDelay = Math.min(idx, 4) * step + "ms";
                    indexByParent.set(parent, idx + 1);
                }

                observer.observe(el);
            });
        });
    }

    initCarousel();
    initReveal();
})();
