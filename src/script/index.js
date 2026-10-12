const btn = document.getElementById('menu-btn');
const menu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');
const navbar = document.querySelector('.navbar-scroll nav');

function updateMenuAria() {
    btn.setAttribute('aria-expanded', !menu.classList.contains('hidden'));
}

btn.addEventListener('click', () => {
    const willShow = menu.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden', !willShow);
    iconClose.classList.toggle('hidden', willShow);
    updateMenuAria();
});

// close mobile menu on link click
document.querySelectorAll('.nav-link-mobile').forEach((link) => {
    link.addEventListener('click', () => {
        menu.classList.add('hidden');
        iconOpen.classList.remove('hidden');
        iconClose.classList.add('hidden');
        updateMenuAria();
    });
});

// navbar: transparent at the very top (over the hero), solid light grey after scrolling
const NAVBAR_SCROLL_THRESHOLD = 8;
const NAVBAR_SOLID_CLASSES = ['bg-neutral-100', 'shadow-sm'];

function updateNavbarScroll() {
    const isScrolled = window.scrollY > NAVBAR_SCROLL_THRESHOLD;

    navbar.classList.toggle('bg-transparent', !isScrolled);
    NAVBAR_SOLID_CLASSES.forEach((name) => navbar.classList.toggle(name, isScrolled));
}

window.addEventListener('scroll', updateNavbarScroll, { passive: true });
window.addEventListener('resize', updateNavbarScroll);
updateNavbarScroll();


// const slider = document.getElementById("slider");

// const step = () => slider.firstElementChild.offsetWidth + 16

// document.getElementById("next").addEventListener("click", () => {
//     slider.scrollBy({ left: step() });
// });

// document.getElementById("prev").addEventListener("click", () => {
//     slider.scrollBy({ left: -step() });
// });


// situation selector: pick what looks like you, the recommendation card follows
const situations = {
    excel: {
        kind: "erp",
        name: "LEINAD ERP",
        text: "Dites adieu aux tableurs : une gestion complète, FNE incluse, avec vos données déjà importées.",
        button: "Découvrir LEINAD ERP",
        href: "#fonctionnalites",
    },
    erp: {
        kind: "erp",
        name: "LEINAD ERP",
        text: "Une seule plateforme pour les ventes, le stock, la facturation, la caisse et la certification FNE.",
        button: "Découvrir LEINAD ERP",
        href: "#fonctionnalites",
    },
    pos: {
        kind: "connect",
        name: "LEINAD CONNECT",
        text: "Gardez votre caisse : LEINAD la relie à la FNE et chaque ticket est certifié.",
        button: "Découvrir LEINAD CONNECT",
        href: "#connect",
    },
    sage: {
        kind: "connect",
        name: "LEINAD CONNECT",
        text: "Gardez votre logiciel : LEINAD le connecte à la FNE sans rien changer à vos habitudes.",
        button: "Découvrir LEINAD CONNECT",
        href: "#connect",
    },
};

const situationOptions = document.querySelectorAll("[data-situation]");
const situationPanel = document.querySelector("[data-situation-panel]");

if (situationPanel) {
    const nameEl = situationPanel.querySelector("[data-situation-name]");
    const textEl = situationPanel.querySelector("[data-situation-text]");
    const ctaEl = situationPanel.querySelector("[data-situation-cta]");
    const ctaLabel = ctaEl.querySelector("[data-cta-label]");

    situationOptions.forEach((option) => {
        option.addEventListener("click", () => {
            const info = situations[option.dataset.situation];
            if (!info) return;

            situationOptions.forEach((o) => o.setAttribute("aria-pressed", String(o === option)));

            const apply = () => {
                situationPanel.dataset.kind = info.kind;
                nameEl.textContent = info.name;
                textEl.textContent = info.text;
                ctaLabel.textContent = info.button;
                ctaEl.setAttribute("href", info.href);
            };

            // fade the text out and back in when GSAP is there, otherwise just swap it
            const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (window.gsap && !reduce) {
                gsap.timeline()
                    .to([nameEl, textEl], { autoAlpha: 0, y: 8, duration: 0.15, ease: "power1.in", overwrite: true })
                    .add(apply)
                    .to([nameEl, textEl], { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" });
            } else {
                apply();
            }
        });
    });
}

// faq : items (open / closed is driven by data-state, styles live in input.css)
const faqItems = document.querySelectorAll('.faq-item');
const faqCats = document.querySelectorAll('.faq-cat');

function setFaqState(item, open) {
    item.dataset.state = open ? 'open' : 'closed';
    const question = item.querySelector('.faq-question');
    if (question) question.setAttribute('aria-expanded', String(open));
}

faqItems.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
        setFaqState(item, item.dataset.state !== 'open');
    });
});

// faq : category filter
faqCats.forEach((cat) => {
    cat.addEventListener('click', () => {
        const wanted = cat.dataset.category;

        faqCats.forEach((other) => other.setAttribute('aria-pressed', String(other === cat)));

        faqItems.forEach((item) => {
            item.hidden = wanted !== 'all' && item.dataset.category !== wanted;
        });
    });
});

