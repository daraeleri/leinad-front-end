const btn = document.getElementById('menu-btn');
const menu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');

btn.addEventListener('click', () => {
    const isHidden = menu.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden', !isHidden);
    iconClose.classList.toggle('hidden', isHidden);

});


// for the marquee
const track = document.getElementById('marquee');

[...track.children].forEach(card=>{
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden','true')
    track.appendChild(copy);
});