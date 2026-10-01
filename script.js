
// ========================================
// FROM STARDUST
// Scrollytelling V2
// ========================================


// ========================================
// ELEMENTOS
// ========================================

const storySection =
    document.querySelector(".story-section");

const chapters =
    document.querySelectorAll(".chapter");

const timelinePoints =
    document.querySelectorAll(".timeline-point");

const timelineProgress =
    document.querySelector(".timeline-progress");

const progressValue =
    document.querySelector("#progress-value");

const universe =
    document.querySelector(".universe");

const earth =
    document.querySelector(".earth");

const life =
    document.querySelector(".life");

const human =
    document.querySelector(".human");

const bigBang =
    document.querySelector(".big-bang");

const bigBangCore =
    document.querySelector(".big-bang-core");

const bigBangRings =
    document.querySelectorAll(".big-bang-ring");

const particlesContainer =
    document.querySelector(".particles");


const restartButton =
    document.querySelector("#restart");


// ========================================
// ESTADO
// ========================================

let progress = 0;

let currentStep = 0;


// ========================================
// CALCULAR PROGRESSO
// ========================================

function updateProgress() {

    const sectionTop =
        storySection.offsetTop;

    const sectionHeight =
        storySection.offsetHeight;

    const viewportHeight =
        window.innerHeight;


    const scrollPosition =
        window.scrollY;


    const scrollStart =
        sectionTop;


    const scrollEnd =
        sectionTop +
        sectionHeight -
        viewportHeight;


    progress =
        (scrollPosition - scrollStart) /
        (scrollEnd - scrollStart);


    progress =
        Math.max(
            0,
            Math.min(
                1,
                progress
            )
        );


    updateInterface();

}


// ========================================
// ATUALIZAR INTERFACE
// ========================================

function updateInterface() {

    const percentage =
        Math.round(
            progress * 100
        );


    // ------------------------------------
    // PORCENTAGEM
    // ------------------------------------

    progressValue.textContent =
        `${percentage}% `;


    // ------------------------------------
    // TIMELINE
    // ------------------------------------

    timelineProgress.style.height =
        `${percentage}% `;


    // ------------------------------------
    // CAPÃTULO ATUAL
    // ------------------------------------

    const totalSteps =
        chapters.length - 1;


    const step =
        Math.min(
            totalSteps,
            Math.floor(
                progress * (totalSteps + 0.999)
            )
        );


    if (step !== currentStep) {

        currentStep = step;

        updateChapter(step);
    }

    // ------------------------------------
    // ELEMENTOS VISUAIS
    // ------------------------------------

    updateVisuals();

}


// ========================================
// ATUALIZAR CAPÃTULO
// ========================================

function updateChapter(step) {

    chapters.forEach(
        (chapter, index) => {

            chapter.classList.toggle(
                "active",
                index === step
            );

        }
    );


    timelinePoints.forEach(
        (point, index) => {

            point.classList.toggle(
                "active",
                index === step
            );

        }
    );

}


// ========================================
// ATUALIZAR VISUAIS
// ========================================

const storyVideo =
    document.querySelector("#story-video");

const particles = [];

function createParticles() {

    const particleCount = 80;

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < particleCount; i++) {

        const particle = document.createElement("div");

        const angle =
            Math.random() * Math.PI * 2;

        const distance =
            100 + Math.random() * 500;

        const size =
            1 + Math.random() * 3;

        particle.classList.add("particle");
        particle.dataset.angle = angle;
        particle.dataset.distance = distance;

        particle.style.width =
            `${size}px`;

        particle.style.height =
            `${size}px`;

        particles.push(particle);
        fragment.appendChild(particle);
    }

    particlesContainer.appendChild(fragment);
}

createParticles();

let targetVideoTime = 0;

function updateVisuals() {
    // ====================================
    // VÍDEO CONTROLADO PELO SCROLL
    // ====================================

    if (
        storyVideo &&
        storyVideo.readyState >= 2 &&
        Number.isFinite(storyVideo.duration)
    ) {

        targetVideoTime =
            progress * storyVideo.duration;

    }
    // ====================================
    // BIG BANG
    // ====================================

    const bigBangProgress =
        Math.max(
            0,
            Math.min(
                1,
                progress / 0.20
            )
        );

    // ------------------------------------
    // NÚCLEO
    // ------------------------------------

    const coreOpacity =
        Math.max(
            0,
            Math.min(
                1,
                bigBangProgress * 3
            )
        );

    const coreScale =
        Math.max(
            0,
            1 - bigBangProgress * 0.5
        );

    bigBangCore.style.opacity =
        coreOpacity;

    bigBangCore.style.transform = `
        translate(-50%, -50%)
        scale(${coreScale})
    `;

    // ------------------------------------
    // ANÉIS
    // ------------------------------------

    bigBangRings.forEach(
        (ring, index) => {

            const delay =
                index * 0.12;

            const ringProgress =
                Math.max(
                    0,
                    Math.min(
                        1,
                        (bigBangProgress - delay) /
                        (1 - delay)
                    )
                );

            const scale =
                ringProgress * 1000;

            const opacity =
                Math.max(
                    0,
                    0.5 - ringProgress * 0.5
                );

            ring.style.opacity =
                opacity;

            ring.style.transform = `
                translate(-50%, -50%)
                scale(${scale})
            `;
        }
    );

    // ------------------------------------
    // PARTÍCULAS
    // ------------------------------------

    particles.forEach(
        (particle) => {

            const angle =
                Number(
                    particle.dataset.angle
                );

            const distance =
                Number(
                    particle.dataset.distance
                );

            const currentDistance =
                distance *
                bigBangProgress;

            const x =
                Math.cos(angle) *
                currentDistance;

            const y =
                Math.sin(angle) *
                currentDistance;

            const opacity =
                Math.max(
                    0,
                    Math.min(
                        1,
                        bigBangProgress * 2
                    )
                );

            particle.style.opacity =
                opacity;

            particle.style.transform = `
                translate(
                    ${x}px,
                    ${y}px
                )
            `;
        }
    );

    // ====================================
    // TERRA
    // ====================================

    const earthStart =
        0.25;

    const earthProgress =
        Math.max(
            0,
            Math.min(
                1,
                (progress - earthStart) /
                0.25
            )
        );

    earth.style.opacity =
        earthProgress;

    earth.style.transform = `
        translateY(-50%)
        scale(${earthProgress})
    `;

    // ====================================
    // VIDA
    // ====================================

    const lifeStart =
        0.48;

    const lifeProgress =
        Math.max(
            0,
            Math.min(
                1,
                (progress - lifeStart) /
                0.20
            )
        );

    life.style.opacity =
        lifeProgress;

    life.style.transform = `
        translateY(-50%)
        scale(${lifeProgress})
    `;

    // ====================================
    // HUMANO
    // ====================================

    const humanStart =
        0.72;

    const humanProgress =
        Math.max(
            0,
            Math.min(
                1,
                (progress - humanStart) /
                0.20
            )
        );

    human.style.opacity =
        humanProgress;

    human.style.transform = `
        translateY(
            ${100 - humanProgress * 100}%
        )
        scale(
            ${0.7 + humanProgress * 0.3}
        )
    `;
}

function animateVideo() {

    if (
        storyVideo &&
        storyVideo.readyState >= 2 &&
        Number.isFinite(storyVideo.duration)
    ) {

        const difference =
            targetVideoTime - storyVideo.currentTime;

        if (Math.abs(difference) > 0.01) {
            storyVideo.currentTime +=
                difference * 0.18;
        }
    }

    requestAnimationFrame(animateVideo);
}

if (storyVideo) {
    storyVideo.addEventListener(
        "loadedmetadata",
        animateVideo,
        { once: true }
    );
}


// ========================================
// SCROLL
// ========================================

let updateFramePending = false;

function requestProgressUpdate() {

    if (updateFramePending) return;

    updateFramePending = true;

    requestAnimationFrame(
        () => {
            updateFramePending = false;
            updateProgress();
        }
    );
}

window.addEventListener(
    "scroll",
    requestProgressUpdate,
    {
        passive: true
    }
);


// ========================================
// RESIZE
// ========================================

window.addEventListener(
    "resize",
    requestProgressUpdate
);


// ========================================
// TIMELINE â€” CLIQUE
// ========================================

timelinePoints.forEach(
    (point, index) => {

        point.addEventListener(
            "click",
            () => {

                const sectionTop =
                    storySection.offsetTop;

                const sectionHeight =
                    storySection.offsetHeight;

                const viewportHeight =
                    window.innerHeight;


                const scrollDistance =
                    sectionHeight -
                    viewportHeight;


                const targetProgress =
                    index /
                    (chapters.length - 1);


                const targetScroll =
                    sectionTop +
                    targetProgress *
                    scrollDistance;


                window.scrollTo({

                    top: targetScroll,

                    behavior: "smooth"

                });

            }
        );

    }
);


// ========================================
// VOLTAR AO COMEÃ‡O
// ========================================

restartButton.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);


// ========================================
// INICIALIZAÃ‡ÃƒO
// ========================================

updateProgress();
