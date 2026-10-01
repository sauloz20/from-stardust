const storySection = document.querySelector(".story-section");
const storyVideo = document.querySelector("#story-video");
const chapters = [...document.querySelectorAll(".chapter")];
const timelinePoints = [...document.querySelectorAll(".timeline-point")];
const timelineProgress = document.querySelector(".timeline-progress");
const progressValue = document.querySelector("#progress-value");
const universe = document.querySelector(".universe");
const earth = document.querySelector(".earth");
const life = document.querySelector(".life");
const human = document.querySelector(".human");
const bigBangCore = document.querySelector(".big-bang-core");
const bigBangRings = [...document.querySelectorAll(".big-bang-ring")];
const particlesContainer = document.querySelector(".particles");
const restartButton = document.querySelector("#restart");

let progress = 0;
let currentStep = -1;
let targetVideoTime = 0;
let videoLoopStarted = false;
const particles = [];
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

function clamp(value, min = 0, max = 1) {
    return Math.min(max, Math.max(min, value));
}

function createParticles() {
    if (!particlesContainer) return;

    const fragment = document.createDocumentFragment();

    for (let index = 0; index < 80; index += 1) {
        const particle = document.createElement("div");
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * 500;
        const size = 1 + Math.random() * 3;

        particle.className = "particle";
        particle.dataset.angle = String(angle);
        particle.dataset.distance = String(distance);
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        particles.push(particle);
        fragment.appendChild(particle);
    }

    particlesContainer.appendChild(fragment);
}

function updateChapter(step) {
    chapters.forEach((chapter, index) => {
        chapter.classList.toggle("active", index === step);
    });

    timelinePoints.forEach((point, index) => {
        point.classList.toggle("active", index === step);
        point.setAttribute("aria-current", index === step ? "step" : "false");
        point.style.top = `${(index / Math.max(1, timelinePoints.length - 1)) * 100}%`;
    });
}

function updateProgress(nextProgress) {
    progress = clamp(nextProgress);

    const percentage = Math.round(progress * 100);
    const totalSteps = Math.max(1, chapters.length - 1);
    const step = Math.min(
        totalSteps,
        Math.floor(progress * chapters.length)
    );

    if (progressValue) {
        progressValue.textContent = `${percentage}%`;
    }

    if (timelineProgress) {
        timelineProgress.style.height = `${percentage}%`;
    }

    if (step !== currentStep) {
        currentStep = step;
        updateChapter(step);
    }

    updateVisuals();
}

function updateVisuals() {
    if (
        storyVideo &&
        storyVideo.readyState >= 1 &&
        Number.isFinite(storyVideo.duration) &&
        !prefersReducedMotion
    ) {
        targetVideoTime = progress * storyVideo.duration;
    }

    const bigBangProgress = clamp(progress / 0.20);
    const coreOpacity = clamp(bigBangProgress * 3);
    const coreScale = Math.max(0, 1 - bigBangProgress * 0.5);

    if (bigBangCore) {
        bigBangCore.style.opacity = coreOpacity;
        bigBangCore.style.transform =
            `translate(-50%, -50%) scale(${coreScale})`;
    }

    bigBangRings.forEach((ring, index) => {
        const delay = index * 0.12;
        const ringProgress = clamp(
            (bigBangProgress - delay) / (1 - delay)
        );
        const scale = ringProgress * 1000;
        const opacity = Math.max(0, 0.5 - ringProgress * 0.5);

        ring.style.opacity = opacity;
        ring.style.transform =
            `translate(-50%, -50%) scale(${scale})`;
    });

    particles.forEach((particle) => {
        const angle = Number(particle.dataset.angle);
        const distance = Number(particle.dataset.distance);
        const currentDistance = distance * bigBangProgress;
        const x = Math.cos(angle) * currentDistance;
        const y = Math.sin(angle) * currentDistance;

        particle.style.opacity = clamp(bigBangProgress * 2);
        particle.style.transform = `translate(${x}px, ${y}px)`;
    });

    const earthProgress = clamp((progress - 0.25) / 0.25);
    const lifeProgress = clamp((progress - 0.48) / 0.20);
    const humanProgress = clamp((progress - 0.72) / 0.20);

    if (earth) {
        earth.style.opacity = earthProgress;
        earth.style.transform =
            `translateY(-50%) scale(${earthProgress})`;
    }

    if (life) {
        life.style.opacity = lifeProgress;
        life.style.transform =
            `translateY(-50%) scale(${lifeProgress})`;
    }

    if (human) {
        human.style.opacity = humanProgress;
        human.style.transform =
            `translateY(${100 - humanProgress * 100}%) scale(${0.7 + humanProgress * 0.3})`;
    }
}

function animateVideo() {
    if (
        storyVideo &&
        storyVideo.readyState >= 2 &&
        Number.isFinite(storyVideo.duration)
    ) {
        if (prefersReducedMotion) {
            storyVideo.currentTime = 0;
        } else {
            const difference = targetVideoTime - storyVideo.currentTime;

            if (Math.abs(difference) > 0.01) {
                storyVideo.currentTime += difference * 0.22;
            }
        }
    }

    requestAnimationFrame(animateVideo);
}

function getSectionScrollTop(step) {
    const sectionTop =
        storySection.getBoundingClientRect().top + window.scrollY;
    const scrollDistance = Math.max(
        0,
        storySection.offsetHeight - window.innerHeight
    );

    return sectionTop + (step / (chapters.length - 1)) * scrollDistance;
}

function scrollToChapter(index) {
    const top = getSectionScrollTop(index);

    window.scrollTo({
        top,
        behavior: prefersReducedMotion ? "auto" : "smooth"
    });
}

function initScrollTrigger() {
    if (window.gsap && window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);

        gsap.to({ value: 0 }, {
            value: 1,
            ease: "none",
            scrollTrigger: {
                trigger: storySection,
                start: "top top",
                end: "bottom bottom",
                scrub: prefersReducedMotion ? false : 0.35,
                onUpdate: (self) => updateProgress(self.progress)
            }
        });

        ScrollTrigger.refresh();
        return;
    }

    let framePending = false;

    const fallbackUpdate = () => {
        if (framePending) return;
        framePending = true;

        requestAnimationFrame(() => {
            framePending = false;
            const rect = storySection.getBoundingClientRect();
            const distance = storySection.offsetHeight - window.innerHeight;
            updateProgress(clamp(-rect.top / distance));
        });
    };

    window.addEventListener("scroll", fallbackUpdate, { passive: true });
    window.addEventListener("resize", fallbackUpdate);
    fallbackUpdate();
}

createParticles();
updateProgress(0);
initScrollTrigger();

if (storyVideo) {
    storyVideo.addEventListener("loadedmetadata", () => {
        targetVideoTime = progress * storyVideo.duration;
        if (!videoLoopStarted) {
            videoLoopStarted = true;
            animateVideo();
        }
    }, { once: true });

    if (storyVideo.readyState >= 1 && !videoLoopStarted) {
        videoLoopStarted = true;
        animateVideo();
    }
}

timelinePoints.forEach((point, index) => {
    point.addEventListener("click", () => scrollToChapter(index));
});

if (restartButton) {
    restartButton.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });
    });
}

window.addEventListener("load", () => {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
});
