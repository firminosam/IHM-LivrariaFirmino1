/**
 * Livraria Sambambi - JavaScript da Home (Exame IHM)
 * Exclusivo da página Home.html: carrossel de "Novidades & Lançamentos",
 * slider de testemunhos, "Livros Mais Vistos" dinâmico e pesquisa do Hero.
 * Depende de common.js (deve ser incluído antes deste ficheiro).
 */

document.addEventListener("DOMContentLoaded", () => {
    initMarquees();          // Carrossel Contínuo apenas em "Novidades & Lançamentos"
    initHomeSliders();       // Slider dos Testemunhos
    initMaisVistosDynamic(); // "Livros Mais Vistos" dinâmico, sem carrossel
    initHeroSearch();        // Pesquisa rápida do Hero
});

/* ==========================================================================
   1. CARROSSEL CONTÍNUO HORIZONTAL "NOVIDADES & LANÇAMENTOS" (Esquerda para Direita)
   ========================================================================== */
function initMarquees() {
    const rows = document.querySelectorAll(".books__row--marquee");
    if (rows.length === 0) return;

    rows.forEach(booksRow => {
        const boxes = booksRow.querySelectorAll(".book__box");
        if (boxes.length === 0) return;

        // Criar o container da track do carrossel
        const track = document.createElement("div");
        track.className = "books__marquee-track";

        // Adicionar os originais
        boxes.forEach(box => {
            track.appendChild(box.cloneNode(true));
        });

        // Duplicar para loop contínuo sem emendas
        boxes.forEach(box => {
            track.appendChild(box.cloneNode(true));
        });

        // Substituir o conteúdo antigo pelo track animado
        booksRow.innerHTML = "";
        booksRow.appendChild(track);
    });
}

/* ==========================================================================
   2. SLIDER INTERATIVO DOS TESTEMUNHOS VIA DOTS
   ========================================================================== */
function initHomeSliders() {
    const testSection = document.querySelector(".testimonials__container");
    if (!testSection) return;

    const testGrid = testSection.querySelector(".testimonials__grid");
    const dots = testSection.querySelectorAll(".section__pagination .dot");
    const cards = testSection.querySelectorAll(".testimonial__card");

    if (!testGrid || dots.length === 0 || cards.length === 0) return;

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            dots.forEach(d => d.classList.remove("active"));
            dot.classList.add("active");

            if (window.innerWidth <= 992) {
                cards.forEach((card, i) => {
                    card.style.transition = "all 0.4s ease";
                    if (i === index) {
                        card.style.display = "block";
                        card.style.opacity = "1";
                    } else {
                        card.style.display = "none";
                        card.style.opacity = "0";
                    }
                });
            } else {
                cards.forEach((card, i) => {
                    card.style.transition = "all 0.4s ease";
                    if (i === index) {
                        card.style.transform = "translateY(-15px) scale(1.05)";
                        card.style.boxShadow = "0 10px 25px rgba(226, 177, 60, 0.2)";
                        card.style.borderColor = "var(--accent-color)";
                        card.style.opacity = "1";
                    } else {
                        card.style.transform = "translateY(0) scale(0.95)";
                        card.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                        card.style.borderColor = "transparent";
                        card.style.opacity = "0.7";
                    }
                });
            }
        });
    });

    if (window.innerWidth <= 992) {
        cards.forEach((card, i) => {
            card.style.display = i === 0 ? "block" : "none";
        });
    }
}

/* ==========================================================================
   3. "LIVROS MAIS VISTOS" DINÂMICO (SEM CARROSSEL)
   - Gera o selo de visualizações a partir de data-views
   - Permite "Carregar Mais" livros, injetados via JS (dados simulados)
   ========================================================================== */
function initMaisVistosDynamic() {
    const grid = document.getElementById("maisVistosGrid");
    if (!grid) return;

    // Adiciona o selo dinâmico "X visualizações" em cada livro já presente
    const addViewsBadge = (box) => {
        const views = box.getAttribute("data-views");
        const imageBox = box.querySelector(".book__image");
        if (!views || !imageBox || imageBox.querySelector(".book__views-badge")) return;

        const badge = document.createElement("span");
        badge.className = "book__views-badge";
        badge.innerHTML = `<i class="ri-eye-line"></i> ${Number(views).toLocaleString("pt-PT")}`;
        imageBox.appendChild(badge);
    };

    grid.querySelectorAll(".book__box").forEach(addViewsBadge);

    // Catálogo extra que é "carregado" dinamicamente pelo utilizador
    const extraBooks = [
        { img: "../media/5.jpg", title: "Estruturas de Dados", category: "Informática", views: 256 },
        { img: "../media/6.jpg", title: "Introdução ao Direito", category: "Direito", views: 213 },
        { img: "../media/7.jpg", title: "Macroeconomia", category: "Economia", views: 189 },
        { img: "../media/8.jpg", title: "Inteligência Artificial", category: "Tecnologia", views: 401 }
    ];

    const loadMoreBtn = document.getElementById("loadMoreVistos");
    if (!loadMoreBtn) return;

    let loaded = false;

    loadMoreBtn.addEventListener("click", () => {
        if (loaded) return;
        loadMoreBtn.classList.add("is-loading");
        loadMoreBtn.innerHTML = 'A carregar <i class="ri-loader-4-line"></i>';

        // Pequeno atraso simulado para dar sensação de carregamento dinâmico real
        setTimeout(() => {
            extraBooks.forEach(book => {
                const box = document.createElement("div");
                box.className = "book__box book__box--entering";
                box.setAttribute("data-views", book.views);
                box.innerHTML = `
                    <div class="book__image">
                        <img src="${book.img}" alt="${book.title}">
                    </div>
                    <div class="book__info">
                        <h4>${book.title}</h4>
                        <p>Categoria: ${book.category}</p>
                        <button class="btn__read">Fazer Leitura</button>
                    </div>
                `;
                grid.appendChild(box);
                addViewsBadge(box);
            });

            loaded = true;
            loadMoreBtn.classList.remove("is-loading");
            loadMoreBtn.setAttribute("disabled", "true");
            loadMoreBtn.innerHTML = 'Todos os Livros Carregados <i class="ri-check-line"></i>';
        }, 500);
    });
}

/* ==========================================================================
   4. PESQUISA RÁPIDA DO HERO (redireciona para o catálogo)
   ========================================================================== */
function initHeroSearch() {
    const searchForm = document.querySelector(".header form");
    if (!searchForm) return;

    searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const searchInput = searchForm.querySelector("input[type='text']");
        if (!searchInput) return;

        const rawQuery = searchInput.value.trim();
        const query = rawQuery.toLowerCase();

        if (!query) {
            showCustomModal(
                "Campo Vazio",
                "Por favor, preencha o campo de pesquisa antes de continuar. Digite o título do livro que procura.",
                "ri-error-warning-line"
            );
            searchInput.focus();
            return;
        }

        // Base de dados simulada de palavras-chave para livros
        const database = [
            { key: "calculo", page: "calculo" },
            { key: "diferencial", page: "calculo" },
            { key: "geometria", page: "calculo" },
            { key: "stewart", page: "calculo" },

            { key: "software", page: "software" },
            { key: "sommerville", page: "software" },
            { key: "engenharia de software", page: "software" },

            { key: "dados", page: "dados" },
            { key: "algoritmos", page: "dados" },
            { key: "estruturas", page: "dados" },
            { key: "osvaldo", page: "dados" },

            { key: "redes", page: "redes" },
            { key: "computadores", page: "redes" },
            { key: "kurose", page: "redes" },
            { key: "internet", page: "redes" },

            { key: "microeconomia", page: "microeconomia" },
            { key: "mankiw", page: "microeconomia" },

            { key: "finanças", page: "finanças" },
            { key: "ross", page: "finanças" },
            { key: "corporativas", page: "finanças" },

            { key: "contabilidade", page: "contabilidade" },
            { key: "harrison", page: "contabilidade" },
            { key: "financeira", page: "contabilidade" },

            { key: "econometria", page: "econometria" },
            { key: "gujarati", page: "econometria" },

            { key: "direito", page: "direito" },
            { key: "constitucional", page: "direito" },
            { key: "santos", page: "direito" },
            { key: "angolano", page: "direito" },

            { key: "civil", page: "civil" },
            { key: "joão", page: "civil" },

            { key: "internacional", page: "internacional" },
            { key: "publico", page: "internacional" },
            { key: "mazzuoli", page: "internacional" },

            { key: "penal", page: "penal" },
            { key: "greco", page: "penal" },

            { key: "sagrada", page: "sagrada" },
            { key: "esperança", page: "sagrada" },
            { key: "neto", page: "sagrada" },

            { key: "mayombe", page: "mayombe" },
            { key: "pepetela", page: "mayombe" },

            { key: "terra", page: "terra" },
            { key: "sonambula", page: "terra" },
            { key: "couto", page: "terra" },

            { key: "casmurro", page: "casmurro" },
            { key: "machado", page: "casmurro" },
            { key: "assis", page: "casmurro" },

            { key: "gestão", page: "gestão" },
            { key: "empresarial", page: "gestão" },

            { key: "inglês", page: "inglês" },
            { key: "inglesa", page: "inglês" },

            { key: "inteligência", page: "inteligência" },
            { key: "artificial", page: "inteligência" }
        ];

        // Verificar correspondência na base de dados (apenas para confirmar que existe no acervo)
        const match = database.find(item => query.includes(item.key) || item.key.includes(query));

        if (match) {
            // Se encontrar, redireciona para a página de livros levando o texto real pesquisado
            window.location.href = `./livros.html?search=${encodeURIComponent(rawQuery)}`;
        } else {
            // Se não encontrar, envia para notFound
            window.location.href = "./notFound.html";
        }
    });
}
