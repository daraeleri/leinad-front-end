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


// faq toggle

document.querySelectorAll('.faq-btn').forEach((btn)=>{
    btn.addEventListener('click',()=>{
        const item = btn.closest('.faq-item');
        const answer = item.querySelector('.faq-answer');
        const plus = item.querySelector('icon-plus');
        const minus = item.querySelector('.icon-minus');
        console.log({ item, answer, plus, minus });
        
        const isOpen = answer.classList.toggle('hidden') === false;
        plus.classList.toggle('hidden',isOpen);
        minus.classList.toggle('hidden',!isOpen);
        btn.setAttribute('aria-expanded',isOpen);
    });
});