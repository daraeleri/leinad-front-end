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

document.getElementById("next").addEventListener("click",()=>{
    slider.scrollBy({left:step()});
});

document.getElementById("prev").addEventListener("click",()=>{
    slider.scrollBy({left:-step()});
});