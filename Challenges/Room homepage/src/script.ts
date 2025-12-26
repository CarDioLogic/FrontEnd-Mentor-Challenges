const heroNextBtn = document.getElementById("hero-next-btn")!;
const heroPreviousBtn = document.getElementById("hero-previous-btn")!;
const hamburgerIcon = document.getElementById("hamburger-icon")!;
const navContainer = document.getElementById("nav-container")!;
let callToActionSpan = document.querySelector("#call-to-action-btn span")!;
let heroTitle = document.getElementById("hero-title")!;
let heroDescription = document.getElementById("hero-description")!;


let currentItemSelected = 0;

let heroContentItems: heroContent[] = [
    {
        title: "Discover innovative ways to decorate",
        description: "We provide unmatched quality, comfort, and style for property owners across the country. Our experts combine form and function in bringing your vision to life. Create a room in your own style with our collection and make your property a reflection of you and what you love.",
        callToAction: " Shop now",
        heroImageDesktop: "desktop-image-hero-1",
        heroImageMobile: "mobile-image-hero-1"
    },
    {
        title: "We are available all across the globe",
        description: "With stores all over the world, it's easy for you to find furniture for your home or place of business. Locally, we’re in most major cities throughout the country. Find the branch nearest you using our store locator. Any questions? Don't hesitate to contact us today.",
        callToAction: " Shop now",
        heroImageDesktop: "desktop-image-hero-2",
        heroImageMobile: "mobile-image-hero-2"
    },
    {
        title: "Manufactured with the best materials",
        description: "Our modern furniture store provide a high level of quality. Our company has invested in advanced technology to ensure that every product is made as perfect and as consistent as possible. With three decades of experience in this industry, we understand what customers want for their home and office.",
        callToAction: " Shop now",
        heroImageDesktop: "desktop-image-hero-3",
        heroImageMobile: "mobile-image-hero-3"
    }
]


document.addEventListener("DOMContentLoaded", () => {
    init();
    setupEvents();
});

function setupEvents(){
   heroNextBtn.addEventListener("click", () => {
        currentItemSelected++;
        if(currentItemSelected > heroContentItems.length - 1){
            currentItemSelected = 0;
        }

        renderHeroSectionContent(heroContentItems[currentItemSelected]);
    });

    heroPreviousBtn.addEventListener("click", () => {
        currentItemSelected--;
        if(currentItemSelected < 0){
            currentItemSelected = heroContentItems.length - 1;
        }
        renderHeroSectionContent(heroContentItems[currentItemSelected]);
    });

    hamburgerIcon.addEventListener("click", () => {
        navContainer.classList.toggle("nav-open");
    });
}

function init(){
    currentItemSelected = 0;
    renderHeroSectionContent(heroContentItems[currentItemSelected]);
}

function renderHeroSectionContent(heroContent: heroContent|undefined){
    heroTitle.textContent = heroContent?.title ?? "";
    heroDescription.textContent = heroContent?.description ?? "";
    callToActionSpan.textContent = heroContent?.callToAction ?? "";

    const el = document.querySelector<HTMLElement>(".hero-bg-image")!;
    
    if(!el) return;

    el.style.setProperty("--hero-bg-desktop", `url('images/${heroContent?.heroImageDesktop}.jpg')`);
    el.style.setProperty("--hero-bg-mobile", `url('images/${heroContent?.heroImageMobile}.jpg')`);
}

interface heroContent {
    title:string,
    description:string,
    callToAction:string,
    heroImageDesktop:string,
    heroImageMobile:string,
}