/**
 * Livraria Sambambi - JavaScript da Página de Blog (Exame IHM)
 * Exclusivo de blog.html: filtro dinâmico de categorias dos artigos.
 * Depende de common.js (deve ser incluído antes deste ficheiro).
 */

document.addEventListener("DOMContentLoaded", () => {
    initBlogFilters();
});

/* ==========================================================================
   FILTRO DINÂMICO DE CATEGORIAS DO BLOG
   ========================================================================== */
function initBlogFilters() {
    const container = document.querySelector(".blog__container");
    if (!container) return;

    const cards = Array.from(container.querySelectorAll(".blog__card"));
    if (cards.length === 0) return;

    // Descobrir categorias únicas presentes nos artigos
    const categories = [...new Set(cards.map(card => {
        const cat = card.querySelector(".blog__category");
        return cat ? cat.textContent.trim() : null;
    }).filter(Boolean))];

    const filterBar = document.createElement("div");
    filterBar.className = "blog__filters";

    const allBtn = document.createElement("button");
    allBtn.className = "blog__filter-btn active";
    allBtn.textContent = "Todos os Artigos";
    allBtn.dataset.filter = "all";
    filterBar.appendChild(allBtn);

    categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.className = "blog__filter-btn";
        btn.textContent = cat;
        btn.dataset.filter = cat;
        filterBar.appendChild(btn);
    });

    container.insertAdjacentElement("beforebegin", filterBar);

    filterBar.addEventListener("click", (e) => {
        const btn = e.target.closest(".blog__filter-btn");
        if (!btn) return;

        filterBar.querySelectorAll(".blog__filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const filter = btn.dataset.filter;
        cards.forEach(card => {
            const cat = card.querySelector(".blog__category");
            const cardCategory = cat ? cat.textContent.trim() : "";
            const show = filter === "all" || cardCategory === filter;
            card.style.display = show ? "" : "none";
        });
    });
}
