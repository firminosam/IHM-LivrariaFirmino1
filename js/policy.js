/**
 * Livraria Sambambi - JavaScript das Páginas de Políticas (Exame IHM)
 * Partilhado por termosUso.html e politicaPrivacidade.html:
 * gera um índice dinâmico com scroll-spy a partir dos títulos <h2>.
 * Depende de common.js (deve ser incluído antes deste ficheiro).
 */

document.addEventListener("DOMContentLoaded", () => {
    initPolicyTOC();
});

/* ==========================================================================
   ÍNDICE DINÂMICO COM SCROLL-SPY
   ========================================================================== */
function initPolicyTOC() {
    const container = document.querySelector(".policy__container");
    if (!container) return;

    const headings = container.querySelectorAll("h2");
    if (headings.length === 0) return;

    // Gera IDs a partir do texto de cada h2 (slugify simples)
    const slugify = (text) => text
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const tocList = document.createElement("ul");
    tocList.className = "policy__toc-list";

    headings.forEach(h2 => {
        if (!h2.id) h2.id = slugify(h2.textContent);
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = `#${h2.id}`;
        a.textContent = h2.textContent;
        li.appendChild(a);
        tocList.appendChild(li);

        a.addEventListener("click", (e) => {
            e.preventDefault();
            document.getElementById(h2.id).scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    const toc = document.createElement("nav");
    toc.className = "policy__toc";
    toc.innerHTML = `<h5><i class="ri-list-check-2"></i> Índice Rápido</h5>`;
    toc.appendChild(tocList);

    container.insertBefore(toc, container.children[1] || null);

    // Scroll-spy: destaca o link da secção visível
    const links = tocList.querySelectorAll("a");
    const spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const link = toc.querySelector(`a[href="#${entry.target.id}"]`);
            if (!link) return;
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove("active"));
                link.classList.add("active");
            }
        });
    }, { rootMargin: "-20% 0px -70% 0px" });

    headings.forEach(h2 => spyObserver.observe(h2));
}
