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


// section 3 js
const infos = {
    excel: {
        name: "LEINAD ERP",
        text: "Dites adieu aux tableurs : une gestion complète, FNE incluse, avec vos données déjà importées.",
        button: "Decouvrir LEINAD ERP",
    },

    erp: {
        name: "LEINAD ERP",
        text: "Une seule plateforme pour les ventes, le stock, la facturation, la caisse et la certification FNE.",
        button: "Decouvrir LEINAD ERP",
    },

    pos: {
        name: "LEINAD CONNECT",
        text: "Gardez votre caisse : LEINAD la relie à la FNE et chaque ticket est certifié.",
        button: "Decouvrir LEINAD CONNECT",
    },
    sage: {
        name: "LEINAD CONNECT",
        text: "Gardez votre logiciel : LEINAD le connecte à la FNE sans rien changer à vos habitudes.",
        button: "Decouvrir LEINAD CONNECT",
    },
};

const cards = document.querySelectorAll(".left-cards");
const card_info = document.getElementById("account-name");
const card_text = document.getElementById("account-text");
const card_btn = document.getElementById("btn-name");

cards.forEach((card) => {
    card.addEventListener("click", () => {
        const info = infos[card.getAttribute("key")];

        card_info.textContent = info.name;
        card_text.textContent = info.text;
        card_btn.textContent = info.button;

        cards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active")

    });
})

// tous en un votre entreprise

const stackCards = [...document.querySelectorAll("[data-stack]")];

function updateStack() {
    stackCards.forEach((card, i) => {
        const next = stackCards[i + 1];
        if (!next) return; // the last card always stays open

        const stickyTop = parseFloat(getComputedStyle(next).top);
        const nextIsStuck = next.getBoundingClientRect().top <= stickyTop + 1;

        card.toggleAttribute("data-collapsed", nextIsStuck);
    });
}

window.addEventListener("scroll", updateStack, { passive: true });
window.addEventListener("resize", updateStack);
updateStack();


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

