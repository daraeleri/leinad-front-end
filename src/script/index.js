const btn = document.getElementById('menu-btn');
const menu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');

btn.addEventListener('click', () => {
    const isHidden = menu.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden', !isHidden);
    iconClose.classList.toggle('hidden', isHidden);

});


const slider = document.getElementById("slider");

const step = () => slider.firstElementChild.offsetWidth + 16

document.getElementById("next").addEventListener("click", () => {
    slider.scrollBy({ left: step() });
});

document.getElementById("prev").addEventListener("click", () => {
    slider.scrollBy({ left: -step() });
});


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
    }
}

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

