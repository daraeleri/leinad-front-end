/*
 * Fonctionnalités : horizontal accordion
 *
 *  - desktop (>= 1024px): the section is pinned and each feature opens as you scroll
 *    (GSAP + ScrollTrigger, with Lenis smooth scroll). Clicking a column scrolls to that feature.
 *  - phone / tablet: vertical accordion, tap to open.
 *  - GSAP/Lenis not loaded (CDN blocked) or "reduce motion" on: plain click accordion.
 *    The open / closed state always lives in `data-active`, the layout for each state is in the markup.
 */
(function () {
    const section = document.querySelector('[data-features]');
    if (!section) return;

    const list = section.querySelector('[data-features-list]');
    const items = [...list.querySelectorAll('[data-feature]')];
    const tabs = items.map((el) => el.querySelector('button'));
    const panels = items.map((el) => el.querySelector('[role="region"]'));
    const parts = items.map((el) => [...el.querySelectorAll('[data-part]')]);
    const N = items.length;

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasLibs = Boolean(window.gsap && window.ScrollTrigger);
    const animated = hasLibs && !reduceMotion;

    // how much scrolling each feature gets while the section is pinned (in viewport heights)
    const STEP = 0.5;

    let active = Math.max(0, items.findIndex((el) => el.dataset.active === 'true'));

    /** state only: data-active drives every style, aria-expanded drives assistive tech */
    function paint(next) {
        active = next;
        items.forEach((el, i) => {
            const on = i === next;
            el.dataset.active = String(on);
            tabs[i].setAttribute('aria-expanded', String(on));
            // on desktop the open column hides its own tab, keep it out of the tab order
            tabs[i].tabIndex = on && desktopQuery.matches ? -1 : 0;
            // closed panels: out of the accessibility tree and not clickable
            panels[i].inert = !on;
        });
    }
    paint(active);

    /* ---------- no animation libraries / reduced motion: click only ---------- */
    if (!animated) {
        tabs.forEach((tab, i) => tab.addEventListener('click', () => paint(i)));
        desktopQuery.addEventListener('change', () => paint(active));
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    /* ---------- Lenis smooth scroll, driven by the GSAP ticker ---------- */
    let lenis = null;
    if (window.Lenis) {
        lenis = new Lenis({ duration: 1.1, smoothWheel: true });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);

        // in-page links (#tarifs, #valeurs ...) glide instead of jumping
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link || link.getAttribute('href').length < 2) return;
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            const offset = -(parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
            lenis.scrollTo(target, { offset });
        });
    }

    function scrollToY(y) {
        if (lenis) lenis.scrollTo(y, { duration: 1 });
        else window.scrollTo({ top: y, behavior: 'smooth' });
    }

    /** width the open column ends up with, so its content never re-wraps while it grows */
    function setOpenWidth() {
        const collapsed = tabs[0].offsetWidth;
        list.style.setProperty('--open-w', list.clientWidth - (N - 1) * collapsed + 'px');
    }

    const mm = gsap.matchMedia();

    mm.add(
        { desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)' },
        (context) => {
            const { desktop } = context.conditions;

            /* ----- desktop: pinned, one feature opens per scroll step ----- */
            if (desktop) {
                setOpenWidth();

                function open(next) {
                    const prev = active;
                    if (next === prev) return;
                    paint(next);

                    gsap.to(items[prev], { flexGrow: 0, duration: 0.8, ease: 'power3.inOut', overwrite: 'auto' });
                    gsap.to(items[next], { flexGrow: 1, duration: 0.8, ease: 'power3.inOut', overwrite: 'auto' });
                    gsap.fromTo(
                        parts[next],
                        { autoAlpha: 0, y: 24 },
                        { autoAlpha: 1, y: 0, duration: 0.55, delay: 0.25, stagger: 0.08, ease: 'power2.out', overwrite: 'auto' }
                    );
                }

                const trigger = ScrollTrigger.create({
                    trigger: section,
                    start: 'top top',
                    end: () => '+=' + Math.round(N * STEP * window.innerHeight),
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    onRefresh: (self) => open(Math.min(N - 1, Math.floor(self.progress * N))),
                    onUpdate: (self) => open(Math.min(N - 1, Math.floor(self.progress * N))),
                });

                const onResize = () => setOpenWidth();
                ScrollTrigger.addEventListener('refreshInit', onResize);

                const onClick = tabs.map((tab, i) => {
                    const handler = () => {
                        if (i === active) return;
                        // aim for the middle of that feature's slice of the pinned scroll distance
                        scrollToY(trigger.start + ((i + 0.5) / N) * (trigger.end - trigger.start));
                    };
                    tab.addEventListener('click', handler);
                    return handler;
                });

                return () => {
                    ScrollTrigger.removeEventListener('refreshInit', onResize);
                    tabs.forEach((tab, i) => tab.removeEventListener('click', onClick[i]));
                    list.style.removeProperty('--open-w');
                    paint(active);
                };
            }

            /* ----- phone / tablet: tap to open, panels grow in height ----- */
            function openMobile(next) {
                const prev = active;
                if (next === prev) return;
                const prevPanel = panels[prev];
                const nextPanel = panels[next];

                // pin the closing panel at its current height, otherwise the CSS (closed = 0) snaps it shut
                gsap.set(prevPanel, { height: prevPanel.offsetHeight });
                paint(next);

                gsap.to(prevPanel, { height: 0, duration: 0.5, ease: 'power2.inOut', overwrite: 'auto' });
                gsap.fromTo(
                    nextPanel,
                    { height: 0 },
                    {
                        height: 'auto',
                        duration: 0.5,
                        ease: 'power2.inOut',
                        overwrite: 'auto',
                        onComplete: () => {
                            // keep the opened row in view if the one above it closed
                            const top = tabs[next].getBoundingClientRect().top;
                            if (top < 80) scrollToY(window.scrollY + top - 90);
                        },
                    }
                );
            }

            const onClick = tabs.map((tab, i) => {
                const handler = () => openMobile(i);
                tab.addEventListener('click', handler);
                return handler;
            });

            return () => {
                tabs.forEach((tab, i) => tab.removeEventListener('click', onClick[i]));
                paint(active);
            };
        }
    );

    // images and fonts change the layout: measure again once everything has loaded
    window.addEventListener('load', () => ScrollTrigger.refresh());
})();
