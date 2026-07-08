/**
 * Livraria Sambambi - JavaScript da Página de Livros (Exame IHM)
 * Exclusivo de livros.html: pesquisa/filtragem em tempo real do catálogo,
 * barra lateral de categorias e destaque de resultados vindos da Home.
 * Depende de common.js (deve ser incluído antes deste ficheiro).
 */

document.addEventListener("DOMContentLoaded", () => {
    initLivrosSearch();
    initSearchHighlight();
});

/* ==========================================================================
   1. PESQUISA E FILTRAGEM EM TEMPO REAL DO CATÁLOGO
   ========================================================================== */
function initLivrosSearch() {
    // 1.1 Formulário de pesquisa: filtragem real, sem recarregar a página
    const livrosSearchForm = document.getElementById("livrosSearchForm");
    if (livrosSearchForm) {
        const livrosSearchInput = document.getElementById("livrosSearchInput");

        // A filtragem só deve ocorrer quando o utilizador clicar em "Pesquisar" (submeter o formulário)
        livrosSearchForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const rawQuery = livrosSearchInput.value.trim();

            if (!rawQuery) {
                showCustomModal(
                    "Campo Vazio",
                    "Por favor, preencha o campo de pesquisa antes de clicar em Pesquisar.",
                    "ri-error-warning-line"
                );
                livrosSearchInput.focus();
                return;
            }

            const totalMatches = filterBooks(rawQuery);

            // Se não encontrar nenhum livro correspondente, envia para a página 404
            if (totalMatches === 0) {
                window.location.href = "notFound.html";
            }
        });

        const clearBtn = document.getElementById("clearSearchBtn");
        if (clearBtn) {
            clearBtn.addEventListener("click", () => {
                livrosSearchInput.value = "";
                filterBooks("");
                livrosSearchInput.focus();
            });
        }
    }

    // 1.2 Barra lateral de categorias: clicar limpa a pesquisa ativa e destaca a categoria
    const categoryLinks = document.querySelectorAll(".category__list a");
    if (categoryLinks.length > 0) {
        categoryLinks.forEach(link => {
            link.addEventListener("click", () => {
                categoryLinks.forEach(l => l.classList.remove("active"));
                link.classList.add("active");

                const livrosSearchInputEl = document.getElementById("livrosSearchInput");
                if (livrosSearchInputEl) livrosSearchInputEl.value = "";
                filterBooks("");
            });
        });
    }
}

/* ==========================================================================
   2. FILTRAGEM REAL DO CATÁLOGO (simula uma base de dados de livros)
   ========================================================================== */
function filterBooks(rawQuery) {
    const query = rawQuery.trim().toLowerCase();
    const bookBoxes = document.querySelectorAll(".book__box");
    const showcases = document.querySelectorAll(".showcase__container");
    const banner = document.getElementById("searchActiveBanner");
    const bannerText = document.getElementById("searchActiveText");
    const noResults = document.getElementById("noResultsMessage");
    const promoBanner = document.querySelector(".promo__banner");
    if (bookBoxes.length === 0) return 0; // não estamos na página de livros

    // Sem pesquisa: repor tudo ao estado normal
    if (!query) {
        bookBoxes.forEach(box => box.classList.remove("is-hidden-by-filter"));
        showcases.forEach(sc => sc.classList.remove("is-hidden-by-filter"));
        if (banner) banner.classList.remove("show");
        if (noResults) noResults.classList.remove("show");
        if (promoBanner) promoBanner.style.display = "";
        return bookBoxes.length;
    }

    let totalMatches = 0;

    bookBoxes.forEach(box => {
        const title = box.querySelector("h4") ? box.querySelector("h4").textContent.toLowerCase() : "";
        const author = box.querySelector("p") ? box.querySelector("p").textContent.toLowerCase() : "";
        const alt = box.querySelector("img") ? box.querySelector("img").alt.toLowerCase() : "";

        const isMatch = title.includes(query) || author.includes(query) || alt.includes(query);

        box.classList.toggle("is-hidden-by-filter", !isMatch);
        if (isMatch) totalMatches++;
    });

    // Ocultar categorias inteiras que ficaram sem nenhum livro visível
    showcases.forEach(sc => {
        const visibleBooks = sc.querySelectorAll(".book__box:not(.is-hidden-by-filter)");
        sc.classList.toggle("is-hidden-by-filter", visibleBooks.length === 0);
    });

    if (promoBanner) promoBanner.style.display = "none";

    if (banner && bannerText) {
        bannerText.innerHTML = totalMatches > 0
            ? `<i class="ri-search-line"></i> A mostrar <strong>${totalMatches}</strong> resultado(s) para "<strong>${rawQuery.trim()}</strong>"`
            : `<i class="ri-search-line"></i> Pesquisa por "<strong>${rawQuery.trim()}</strong>"`;
        banner.classList.add("show");
    }

    if (noResults) {
        noResults.classList.toggle("show", totalMatches === 0);
    }

    // Realçar visualmente o(s) livro(s) encontrados
    if (totalMatches > 0) {
        const firstMatch = document.querySelector(".book__box:not(.is-hidden-by-filter)");
        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: "smooth", block: "center" });
            firstMatch.classList.add("highlight-book");
            setTimeout(() => firstMatch.classList.remove("highlight-book"), 3000);
        }
    }

    return totalMatches;
}

/* ==========================================================================
   3. APLICAR FILTRAGEM AUTOMÁTICA SE A PÁGINA FOR ABERTA COM ?search= (vindo da Home)
   ========================================================================== */
function initSearchHighlight() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    if (!searchParam || !window.location.pathname.toLowerCase().includes("livros.html")) return;

    const query = decodeURIComponent(searchParam);

    // Preencher a caixa de pesquisa da página de livros com o termo procurado
    const livrosSearchInput = document.getElementById("livrosSearchInput");
    if (livrosSearchInput) livrosSearchInput.value = query;

    setTimeout(() => {
        filterBooks(query);
    }, 300);
}
