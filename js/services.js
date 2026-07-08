/**
 * Livraria Sambambi - JavaScript da Página de Serviços (Exame IHM)
 * Exclusivo de services.html: lightbox interativo da galeria.
 * Depende de common.js (deve ser incluído antes deste ficheiro).
 */

document.addEventListener("DOMContentLoaded", () => {
    initGalleryLightbox();
});

/* ==========================================================================
   LIGHTBOX DINÂMICO PARA A GALERIA
   ========================================================================== */
function initGalleryLightbox() {
    const cards = document.querySelectorAll(".gallery__card");
    if (cards.length === 0) return;

    cards.forEach(card => {
        card.style.cursor = "zoom-in";
        card.addEventListener("click", () => {
            const img = card.querySelector("img");
            const title = card.querySelector("h4") ? card.querySelector("h4").textContent : "";
            const desc = card.querySelector("p") ? card.querySelector("p").textContent : "";
            if (!img) return;

            showCustomModal(
                title,
                `<img src="${img.src}" alt="${img.alt}" style="width:100%; border-radius:8px; margin-bottom:1rem;"><p>${desc}</p>`,
                "ri-image-line"
            );
        });
    });
}
