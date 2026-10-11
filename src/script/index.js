const nav = document.getElementById('site-nav');
const btn = document.getElementById('menu-btn');
const menu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');

// navbar: transparent at the top of the page, frosted once scrolled
const updateNavScroll = () => {
    nav.dataset.scrolled = String(window.scrollY > 8);
};
updateNavScroll();
window.addEventListener('scroll', updateNavScroll, { passive: true });

// navbar: phone / tablet menu
const setMenu = (open) => {
    menu.classList.toggle('hidden', !open);
    iconOpen.classList.toggle('hidden', open);
    iconClose.classList.toggle('hidden', !open);
    btn.setAttribute('aria-expanded', String(open));
    nav.dataset.open = String(open);
};

btn.addEventListener('click', () => {
    setMenu(menu.classList.contains('hidden'));
});

// close with Escape, after choosing a link, or when the desktop layout takes over
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenu(false);
});
menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) setMenu(false);
});
window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches) setMenu(false);
});


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


// faq toggle
document.querySelectorAll('.faq-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const plus = item.querySelector('icon-plus');
        const minus = item.querySelector('.icon-minus');
        console.log({ item, answer, plus, minus });

        const isOpen = answer.classList.toggle('hidden') === false;
        plus.classList.toggle('hidden', isOpen);
        minus.classList.toggle('hidden', !isOpen);
        btn.setAttribute('aria-expanded', isOpen);
    });
});

