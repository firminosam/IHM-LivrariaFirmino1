/**
 * Livraria Sambambi - JavaScript do Mapa do Site (Exame IHM)
 * Exclusivo de mapaSite.html: pesquisa/filtro dinâmico das páginas listadas.
 * Depende de common.js (deve ser incluído antes deste ficheiro).
 */

document.addEventListener("DOMContentLoaded", () => {
    initSitemapFilter();
});

/* ==========================================================================
   PESQUISA DINÂMICA NO MAPA DO SITE
   ========================================================================== */
function initSitemapFilter() {
    const section = document.querySelector(".sitemap__section");
    if (!section) return;

    const links = section.querySelectorAll(".sitemap__container a, .sitemap__col a, a");
    if (links.length === 0) return;

    const searchBox = document.createElement("div");
    searchBox.className = "sitemap__search";
    searchBox.innerHTML = `
        <span><i class="ri-search-line"></i></span>
        <input type="text" id="sitemapSearchInput" placeholder="Filtrar páginas do site...">
    `;

    const heading = section.querySelector("h2");
    if (heading) {
        heading.insertAdjacentElement("afterend", searchBox);
    }

    const input = document.getElementById("sitemapSearchInput");
    input.addEventListener("input", () => {
        const query = input.value.trim().toLowerCase();
        links.forEach(link => {
            const li = link.closest("li") || link;
            const match = link.textContent.toLowerCase().includes(query);
            li.style.display = match ? "" : "none";
        });
    });
}
