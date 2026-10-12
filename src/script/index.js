
const btn = document.getElementById('menu-btn');
const menu = document.getElementById('mobile-menu');
const iconOpen = document.getElementById('icon-open');
const iconClose = document.getElementById('icon-close');

btn.addEventListener('click', () => {
    const isHidden = menu.classList.toggle('hidden');
    iconOpen.classList.toggle('hidden', !isHidden);
    iconClose.classList.toggle('hidden', isHidden);

});

// hero image slide
const slides = gsap.utils.toArray(".hero-slide");

gsap.set(slides,{autoAlpha:0});
gsap.set(slides[0],{autoAlpha:1});

const tl = gsap.timeline({repeat:-1});

slides.forEach((slide,i)=>{
    const next = slides[(i+1)%slides.length];

    tl.to(slide,{autoAlpha:0,duration:1,ease:"power1.inOut"},"+=3")
        .to(next,{autoAlpha:1,duration:1,ease:"power1.inOut"},"<");
})



