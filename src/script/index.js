
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

gsap.set(slides, { autoAlpha: 0 });
gsap.set(slides[0], { autoAlpha: 1 });

const tl = gsap.timeline({ repeat: -1 });

slides.forEach((slide, i) => {
    const next = slides[(i + 1) % slides.length];

    tl.to(slide, { autoAlpha: 0, duration: 1, ease: "power1.inOut" }, "+=3")
        .to(next, { autoAlpha: 1, duration: 1, ease: "power1.inOut" }, "<");
})

// hero text
gsap.registerPlugin(SplitText);
let split, animation;


function setup() {
    animation && animation.revert();
    split && split.revert();
    split = SplitText.create(".text", { type: "lines" });

    animation = gsap.from(split.lines, {
        rotationX: -100,
        transformOrigin: "50% 50% -160px",
        opacity: 0,
        duration: 0.8,
        ease: "power3",
        stagger: 0.25
    })

}
document.fonts.ready.then(setup);
window.addEventListener("resize", setup)


// section two fadeIn cards on scroll
gsap.registerPlugin(ScrollTrigger);

const left = document.querySelector(".leftCard");
const right = document.querySelector(".rightCard");

gsap.from(".leftCard",{
    xPercent:-120,
    opacity:0,
    duration:0.8,
    ease:"power3.out",
    stagger:0.15,
    scrollTrigger:{
        trigger:".leftCard",
        toggleActions:"restart none none none",
        start:"top 80%",
        markers:true
    }
})

gsap.from(".rightCard",{
    xPercent:120,
    opacity:0,
    duration:1,
    ease:"power3.out",
    scrollTrigger:{
        trigger:".rightCard",
        toggleActions:"restart none none none",
        start:"top 80%",
        markers:true
    },
});

window.addEventListener("load",()=>ScrollTrigger.refresh());