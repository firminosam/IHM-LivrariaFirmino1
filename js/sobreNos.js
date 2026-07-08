/**
 * Livraria Sambambi - JavaScript da Página Sobre Nós (Exame IHM)
 * Exclusivo de sobreNos.html: contadores animados de estatísticas.
 * Depende de common.js (deve ser incluído antes deste ficheiro).
 */

document.addEventListener("DOMContentLoaded", () => {
    initAboutCounters();
});

/* ==========================================================================
   CONTADORES ANIMADOS
   ========================================================================== */
function initAboutCounters() {
    const counters = document.querySelectorAll(".counter__number");
    if (counters.length === 0) return;

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute("data-target"), 10) || 0;
        const duration = 1500;
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const value = Math.floor(progress * target);
            el.textContent = value.toLocaleString("pt-PT");
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = target.toLocaleString("pt-PT") + (el.getAttribute("data-suffix") || "");
            }
        };
        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    counters.forEach(counter => observer.observe(counter));
}
