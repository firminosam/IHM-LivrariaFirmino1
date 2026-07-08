/**
 * Livraria Sambambi - JavaScript Interativo (IHM Exame)
 * Desenvolvido para FirminoSambambi35662
 */

document.addEventListener("DOMContentLoaded", () => {
    // Inicializar Componentes Globais
    initResponsiveNav();
    initDarkMode();
    initBackToTop();
    initWhatsAppButton();
    initFormValidation();
    initBookReading();
    initDownloadConfirmation();
    initCartActions();
    initSearch(); // Sistema de Pesquisa e Simulação de Base de Dados

    // Inicializar Componentes de Páginas Específicas
    if (document.querySelector(".header") && document.getElementById("home")) {
        initMarquees();          // Carrossel Contínuo apenas em "Novidades & Lançamentos"
        initHomeSliders();       // Slider dos Testemunhos
        initMaisVistosDynamic(); // "Livros Mais Vistos" dinâmico, sem carrossel
    }
    if (document.getElementById("map")) {
        initGoogleMapAPI();
    }
    if (document.getElementById("storeStatus")) {
        initStoreStatus();       // Indicador dinâmico de Aberto/Fechado (Contactos)
    }
    if (document.querySelector(".gallery__grid")) {
        initGalleryLightbox();   // Lightbox interativo na galeria de Serviços
    }
    if (document.querySelector(".about__values")) {
        initAboutCounters();     // Contadores animados em Sobre Nós
    }
    if (document.querySelector(".policy__section")) {
        initPolicyTOC();         // Índice dinâmico com scroll-spy (Termos/Privacidade)
    }
    if (document.querySelector(".sitemap__section")) {
        initSitemapFilter();     // Pesquisa ao vivo no Mapa do Site
    }
    if (document.querySelector(".blog__container")) {
        initBlogFilters();       // Filtro de categorias dinâmico no Blog
    }

    // Animações dinâmicas ao rolar a página (deve correr depois de qualquer clonagem de DOM acima)
    initScrollReveal();

    // Executa destaque se vier de uma pesquisa
    initSearchHighlight();
});

/* ==========================================================================
   1.1 ANIMAÇÕES AO ROLAR A PÁGINA (SCROLL REVEAL)
   ========================================================================== */
function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length === 0) return;

    // Utilizadores que preferem menos animação veem tudo já visível
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
        revealElements.forEach(el => el.classList.add("active"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => observer.observe(el));

    // Rede de segurança: garante que nada fica invisível para sempre
    // (ex.: elementos que já estavam visíveis antes do observer arrancar)
    setTimeout(() => {
        revealElements.forEach(el => el.classList.add("active"));
    }, 1200);
}

/* ==========================================================================
   2. MENU DE NAVEGAÇÃO RESPONSIVO
   ========================================================================== */
function initResponsiveNav() {
    const menuBtn = document.getElementById("menu-btn");
    const navLinks = document.getElementById("nav-links");
    if (!menuBtn || !navLinks) return;

    const menuButtonIcon = menuBtn.querySelector("i");

    menuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        navLinks.classList.toggle("open");
        const isOpen = navLinks.classList.contains("open");
        menuButtonIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
    });

    // Fechar menu ao clicar em qualquer link
    navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("open");
            menuButtonIcon.setAttribute("class", "ri-menu-line");
        });
    });

    // Fechar ao clicar fora do menu
    document.addEventListener("click", (e) => {
        if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
            navLinks.classList.remove("open");
            menuButtonIcon.setAttribute("class", "ri-menu-line");
        }
    });
}

/* ==========================================================================
   2. DARK MODE (MODO ESCURO) - DINÂMICO
   ========================================================================== */
function initDarkMode() {
    const nav = document.querySelector("nav");

    // Criar o alternador de Dark Mode
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "dark-mode-toggle";
    toggleBtn.setAttribute("aria-label", "Alternar Modo Escuro");
    toggleBtn.innerHTML = '<i class="ri-moon-line"></i>';

    if (nav) {
        // Inserir na nav antes do menu mobile
        const menuBtn = document.getElementById("menu-btn");
        if (menuBtn) {
            menuBtn.parentNode.insertBefore(toggleBtn, menuBtn);
        } else {
            nav.appendChild(toggleBtn);
        }
    } else {
        // Páginas sem <nav> (ex: Login, Cadastro): botão flutuante próprio
        toggleBtn.classList.add("dark-mode-toggle--floating");
        document.body.appendChild(toggleBtn);
    }

    const htmlElement = document.documentElement;
    const icon = toggleBtn.querySelector("i");

    // Verificar preferência guardada no localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        htmlElement.classList.add("dark-mode");
        icon.setAttribute("class", "ri-sun-line");
    }

    // Evento de clique
    toggleBtn.addEventListener("click", () => {
        htmlElement.classList.toggle("dark-mode");
        const isDark = htmlElement.classList.contains("dark-mode");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        icon.setAttribute("class", isDark ? "ri-sun-line" : "ri-moon-line");
    });
}

/* ==========================================================================
   2.1 BOTÃO FLUTUANTE DO WHATSAPP
   ========================================================================== */
function initWhatsAppButton() {
    // Evitar duplicar o botão se o script for executado mais que uma vez
    if (document.querySelector(".whatsapp-float")) return;

    const whatsappNumber = "244934638979"; // +244 934 638 979 (sem espaços/símbolos)
    const defaultMessage = "Olá! Vim através do site da Livraria Sambambi e gostaria de saber mais informações.";

    const whatsappBtn = document.createElement("a");
    whatsappBtn.className = "whatsapp-float";
    whatsappBtn.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
    whatsappBtn.target = "_blank";
    whatsappBtn.rel = "noopener noreferrer";
    whatsappBtn.setAttribute("aria-label", "Falar connosco no WhatsApp");
    whatsappBtn.innerHTML = '<i class="ri-whatsapp-fill"></i>';

    document.body.appendChild(whatsappBtn);
}

/* ==========================================================================
   3. BOTÃO VOLTAR AO TOPO - DINÂMICO
   ========================================================================== */
function initBackToTop() {
    const backToTopBtn = document.createElement("button");
    backToTopBtn.className = "back-to-top";
    backToTopBtn.setAttribute("aria-label", "Voltar ao Topo");
    backToTopBtn.innerHTML = '<i class="ri-arrow-up-line"></i>';
    document.body.appendChild(backToTopBtn);

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add("show");
        } else {
            backToTopBtn.classList.remove("show");
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}

/* ==========================================================================
   4. VALIDAÇÃO DE FORMULÁRIOS (FUNÇÕES PRÓPRIAS)
   ========================================================================== */
function initFormValidation() {
    // 4.1 Validação do formulário de contactos
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const nameInput = document.getElementById("name");
            const emailInput = document.getElementById("email");
            const subjectInput = document.getElementById("subject");
            const messageInput = document.getElementById("message");

            let isValid = true;

            // Limpar erros anteriores
            clearErrors([nameInput, emailInput, subjectInput, messageInput]);

            // Validação de Nome (mínimo 3 caracteres)
            if (!nameInput.value.trim() || nameInput.value.trim().length < 3) {
                showError(nameInput, "nameError", "O nome completo deve ter pelo menos 3 caracteres.");
                isValid = false;
            }

            // Validação de E-mail (Regex próprio)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                showError(emailInput, "emailError", "Insira um endereço de e-mail válido (ex: estudante@ucan.edu).");
                isValid = false;
            }

            // Validação de Assunto
            if (!subjectInput.value.trim() || subjectInput.value.trim().length < 5) {
                showError(subjectInput, "subjectError", "O assunto deve conter pelo menos 5 caracteres.");
                isValid = false;
            }

            // Validação de Mensagem
            if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
                showError(messageInput, "messageError", "A sua mensagem deve conter pelo menos 10 caracteres.");
                isValid = false;
            }

            if (isValid) {
                const successMsg = document.getElementById("formSuccess");
                if (successMsg) {
                    successMsg.textContent = "Mensagem enviada com sucesso! Entraremos em contacto brevemente.";
                    successMsg.style.display = "block";
                    contactForm.reset();
                    setTimeout(() => {
                        successMsg.style.display = "none";
                    }, 5000);
                }
            }
        });
    }

    // 4.2 Validação do formulário de Login
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const emailInput = document.getElementById("email");
            const passwordInput = document.getElementById("password");

            let isValid = true;

            clearErrors([emailInput, passwordInput]);

            // Validar E-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                showError(emailInput, "emailError", "Por favor, introduza um e-mail válido.");
                isValid = false;
            }

            // Validar Senha (mínimo 6 caracteres)
            if (!passwordInput.value || passwordInput.value.length < 6) {
                showError(passwordInput, "passwordError", "A palavra-passe deve conter pelo menos 6 caracteres.");
                isValid = false;
            }

            if (isValid) {
                // Simular login bem-sucedido
                const loginBox = document.querySelector(".login-box");
                loginBox.innerHTML = `
                    <div style="text-align: center; padding: 2rem 0;">
                        <i class="ri-checkbox-circle-line" style="font-size: 4rem; color: #e2b13c; display: block; margin-bottom: 1.5rem;"></i>
                        <h2 style="margin-bottom: 1rem;">Bem-vindo de volta!</h2>
                        <p style="color: var(--text-light);">Sessão iniciada com sucesso. A redirecionar para a página inicial...</p>
                    </div>
                `;
                setTimeout(() => {
                    window.location.href = "../html/Home.html";
                }, 2000);
            }
        });
    }

    // 4.2.1 Validação do formulário de Cadastro (Criar Conta)
    const cadastroForm = document.getElementById("cadastroForm");
    if (cadastroForm) {
        cadastroForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const emailInput = document.getElementById("cadastroEmail");
            const contactoInput = document.getElementById("cadastroContacto");
            const passwordInput = document.getElementById("cadastroSenha");

            let isValid = true;

            clearErrors([emailInput, contactoInput, passwordInput]);

            // Validar E-mail
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                showError(emailInput, "cadastroEmailError", "Por favor, introduza um e-mail válido.");
                isValid = false;
            }

            // Validar Contacto (apenas dígitos, entre 9 e 13 caracteres, aceita "+")
            const contactoRegex = /^\+?[0-9]{9,13}$/;
            if (!contactoInput.value.trim() || !contactoRegex.test(contactoInput.value.trim())) {
                showError(contactoInput, "cadastroContactoError", "Introduza um número de contacto válido (ex: 934638979).");
                isValid = false;
            }

            // Validar Senha (mínimo 6 caracteres)
            if (!passwordInput.value || passwordInput.value.length < 6) {
                showError(passwordInput, "cadastroSenhaError", "A palavra-passe deve conter pelo menos 6 caracteres.");
                isValid = false;
            }

            if (isValid) {
                const cadastroBox = document.querySelector(".login-box");
                cadastroBox.innerHTML = `
                    <div style="text-align: center; padding: 2rem 0;">
                        <i class="ri-checkbox-circle-line" style="font-size: 4rem; color: #e2b13c; display: block; margin-bottom: 1.5rem;"></i>
                        <h2 style="margin-bottom: 1rem;">Cliente cadastrado com sucesso!</h2>
                        <p style="color: var(--text-light);">A sua conta foi criada. A redirecionar para o login...</p>
                    </div>
                `;
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            }
        });
    }

    // 4.3 Validação dos formulários de Newsletter (Footer)
    document.querySelectorAll(".newsletter__form").forEach(form => {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const emailInput = form.querySelector("input[type='email']");
            if (!emailInput) return;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
                alert("Por favor, introduza um e-mail válido para subscrição.");
                return;
            }

            // Mostrar mensagem de sucesso personalizada via modal
            showCustomModal(
                "Inscrição Confirmada!",
                `Obrigado por subscrever a nossa newsletter com o e-mail: <strong>${emailInput.value.trim()}</strong>. Irá receber as nossas novidades académicas brevemente!`,
                "ri-mail-check-line"
            );
            form.reset();
        });
    });
}

function showError(inputElement, errorSpanId, message) {
    inputElement.classList.add("input-error");
    const errorSpan = document.getElementById(errorSpanId);
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.classList.add("visible");
    }
}

function clearErrors(inputElements) {
    inputElements.forEach(input => {
        if (input) {
            input.classList.remove("input-error");
        }
    });
    document.querySelectorAll(".error-msg").forEach(span => {
        span.textContent = "";
        span.classList.remove("visible");
    });
}

/* ==========================================================================
   5. MAPA INTERATIVO (GOOGLE MAPS API + FALLBACK)
   ========================================================================== */
function initGoogleMapAPI() {
    const mapContainer = document.getElementById("map");
    if (!mapContainer) return;

    // Carrega diretamente o Google Maps Embed (não requer chave de API e carrega
    // de forma consistente em qualquer navegador, sem depender de scripts externos
    // que podem falhar). Localização: Universidade Católica de Angola (UCAN).
    mapContainer.innerHTML = `
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3942.3423719057416!2d13.257783315354964!3d-8.889097993617737!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a51f165e305e94f%3A0xe54ef864817a151b!2sUniversidade%20Cat%C3%B3lica%20de%20Angola!5e0!3m2!1spt-PT!2sao!4v1688750000000!5m2!1spt-PT!2sao"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Localização da Livraria Sambambi no Google Maps">
        </iframe>
    `;
}

/* ==========================================================================
   6. CARROSSÉIS, SLIDERS E MARQUEE (HOME PAGE)
   ========================================================================== */

// 6.1 Carrossel Automático de Fundo removido para manter imagem estática do Hero

// 6.2 Carrossel Contínuo Horizontal (Novidades & Lançamentos + Livros Mais Vistos) - Esquerda para Direita
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

// 6.3 Slider Interativo dos Testemunhos via Dots
function initHomeSliders() {
    // Slider: Testemunhos
    const testSection = document.querySelector(".testimonials__container");
    if (testSection) {
        const testGrid = testSection.querySelector(".testimonials__grid");
        const dots = testSection.querySelectorAll(".section__pagination .dot");
        const cards = testSection.querySelectorAll(".testimonial__card");

        if (testGrid && dots.length > 0 && cards.length > 0) {
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
    }
}

/* ==========================================================================
   7. SISTEMA DE PESQUISA & BASE DE DADOS SIMULADA
   ========================================================================== */
function initSearch() {
    // 7.0 Formulário de pesquisa da PÁGINA DE LIVROS: filtragem real, em tempo real, sem recarregar
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

    // 7.0.1 Barra lateral de categorias: clicar limpa a pesquisa ativa e destaca a categoria
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

    // Intercetar submissão do formulário de pesquisa da HOMEPAGE (Hero)
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

/* ==========================================================================
   7.1 FILTRAGEM REAL DO CATÁLOGO (simula uma base de dados de livros)
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

// 7.2 Aplicar filtragem automática se a página de livros for carregada com ?search= (vindo da Home)
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

/* ==========================================================================
   8. LEITURA DE LIVROS (PDF MAPPING) E MODAL PERSONALIZADA
   ========================================================================== */
function initBookReading() {
    const pdfMapping = {
        "estruturas de dados": "../media/livros/Estrutura de Dados.pdf",
        "algoritmos e estruturas de dados": "../media/livros/Estrutura de Dados.pdf",
        "introdução ao direito": "../media/livros/Introdução ao Direito.pdf",
        "introdução ao direito penal": "../media/livros/Introdução ao Direito.pdf",
        "direito constitucional angolano": "../media/livros/Introdução ao Direito.pdf",
        "código civil comentado": "../media/livros/Introdução ao Direito.pdf",
        "direito internacional público": "../media/livros/Introdução ao Direito.pdf",
        "macroeconomia": "../media/livros/Macro Economia.pdf",
        "macroeconomia moderna": "../media/livros/Macro Economia.pdf",
        "inteligência artificial": "../media/livros/Inteligência Artificial.pdf",
        "engenharia de software": "../media/livros/Engenharia de Software.pdf",
        "introdução à engenharia de software": "../media/livros/Engenharia de Software.pdf",
        "cálculo diferencial": "../media/livros/Calculo Diferncial.pdf",
        "cálculo e geometria analítica": "../media/livros/Calculo Diferncial.pdf",
        "gestão empresarial": "../media/livros/Gestão Empresarial.pdf",
        "língua inglesa": "../media/livros/Lingua Inglesa.pdf",
        "princípios de microeconomia": "../media/livros/Econometria aplicada.pdf",
        "finanças corporativas": "../media/livros/Finanças Corporativas.pdf",
        "contabilidade financeira": "../media/livros/Contabilidade Financeira.pdf",
        "econometria aplicada": "../media/livros/Econometria aplicada.pdf"
    };

    document.body.addEventListener("click", (e) => {
        if (e.target.classList.contains("btn__read")) {
            e.preventDefault();

            const bookBox = e.target.closest(".book__box") || e.target.closest(".book__info");
            if (!bookBox) return;

            const titleElement = bookBox.querySelector("h4");
            if (!titleElement) return;

            const bookTitle = titleElement.textContent.trim();
            const normalizedTitle = bookTitle.toLowerCase();

            let pdfPath = null;
            for (const key in pdfMapping) {
                if (normalizedTitle.includes(key) || key.includes(normalizedTitle)) {
                    pdfPath = pdfMapping[key];
                    break;
                }
            }

            if (pdfPath) {
                window.open(pdfPath, "_blank");
            } else {
                showCustomModal(
                    "Obras Digitais Brevemente",
                    `O livro <strong>"${bookTitle}"</strong> está disponível apenas em formato físico. Visite o pavilhão central da Livraria Sambambi no campus da UCAN ou contacte-nos pelo WhatsApp para efetuar a sua reserva.`,
                    "ri-book-3-line"
                );
            }
        }
    });
}

/* ==========================================================================
   9. MODAL DINÂMICA E PERSONALIZADA
   ========================================================================== */
function initDownloadConfirmation() {
    const pdfMapping = {
        "estruturas de dados": "../media/livros/Estrutura de Dados.pdf",
        "algoritmos e estruturas de dados": "../media/livros/Estrutura de Dados.pdf",
        "introducao ao direito": "../media/livros/Introdução ao Direito.pdf",
        "introducao ao direito penal": "../media/livros/Introdução ao Direito.pdf",
        "direito constitucional angolano": "../media/livros/Introdução ao Direito.pdf",
        "codigo civil comentado": "../media/livros/Introdução ao Direito.pdf",
        "direito internacional publico": "../media/livros/Introdução ao Direito.pdf",
        "macroeconomia": "../media/livros/Macro Economia.pdf",
        "macroeconomia moderna": "../media/livros/Macro Economia.pdf",
        "inteligencia artificial": "../media/livros/Inteligência Artificial.pdf",
        "engenharia de software": "../media/livros/Engenharia de Software.pdf",
        "introducao a engenharia de software": "../media/livros/Engenharia de Software.pdf",
        "calculo diferencial": "../media/livros/Calculo Diferncial.pdf",
        "calculo e geometria analitica": "../media/livros/Calculo Diferncial.pdf",
        "gestao empresarial": "../media/livros/Gestão Empresarial.pdf",
        "lingua inglesa": "../media/livros/Lingua Inglesa.pdf",
        "principios de microeconomia": "../media/livros/Econometria aplicada.pdf",
        "financas corporativas": "../media/livros/Finanças Corporativas.pdf",
        "contabilidade financeira": "../media/livros/Contabilidade Financeira.pdf",
        "econometria aplicada": "../media/livros/Econometria aplicada.pdf"
    };

    function normalize(str) {
        return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    document.body.addEventListener("click", (e) => {
        const downloadBtn = e.target.closest(".btn__download");
        if (!downloadBtn) return;

        e.preventDefault();

        const bookBox = downloadBtn.closest(".book__box") || downloadBtn.closest(".book__info");
        if (!bookBox) return;

        const titleElement = bookBox.querySelector("h4");
        if (!titleElement) return;

        const bookTitle = titleElement.textContent.trim();
        const normalizedTitle = normalize(bookTitle);

        const wantsDownload = window.confirm('Pretende baixar o livro "' + bookTitle + '"?');
        if (!wantsDownload) return;

        let pdfPath = null;
        for (const key in pdfMapping) {
            const normalizedKey = normalize(key);
            if (normalizedTitle.includes(normalizedKey) || normalizedKey.includes(normalizedTitle)) {
                pdfPath = pdfMapping[key];
                break;
            }
        }

        if (pdfPath) {
            window.open(pdfPath, "_blank");
        } else {
            showCustomModal(
                "Download Indisponivel",
                'O livro <strong>"' + bookTitle + '"</strong> ainda nao tem uma versao em PDF disponivel para download. Visite o pavilhao central da Livraria Sambambi ou contacte-nos pelo WhatsApp.',
                "ri-download-cloud-2-line"
            );
        }
    });
}

/* ==========================================================================
   9. CARRINHO DE COMPRAS REAL (Loja de E-books - Vendas.html)
   ========================================================================== */
let cart = [];

function initCartActions() {
    const addCartButtons = document.querySelectorAll(".btn__add-cart");
    if (addCartButtons.length === 0) return; // Só ativa nesta página (Vendas.html)

    buildCartUI();

    document.body.addEventListener("click", (e) => {
        const cartBtn = e.target.closest(".btn__add-cart");
        if (!cartBtn) return;

        e.preventDefault();

        const title = cartBtn.getAttribute("data-title");
        const price = Number(cartBtn.getAttribute("data-price"));
        const bookBox = cartBtn.closest(".book__box");
        const img = bookBox ? bookBox.querySelector("img") : null;
        const imgSrc = img ? img.getAttribute("src") : "";

        addToCart(title, price, imgSrc);
    });
}

function addToCart(title, price, imgSrc) {
    const existing = cart.find(item => item.title === title);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ title, price, imgSrc, qty: 1 });
    }
    renderCart();
    openCart();
}

function changeQty(index, delta) {
    if (!cart[index]) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    renderCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCart();
}

function formatKz(value) {
    return value.toLocaleString("pt-PT") + " Kz";
}

function buildCartUI() {
    if (document.getElementById("cartDrawer")) return;

    const overlay = document.createElement("div");
    overlay.className = "cart-overlay";
    overlay.id = "cartOverlay";
    document.body.appendChild(overlay);

    const drawer = document.createElement("aside");
    drawer.className = "cart-drawer";
    drawer.id = "cartDrawer";
    drawer.innerHTML = `
        <div class="cart-drawer__header">
            <h3><i class="ri-shopping-cart-2-line"></i> O Meu Carrinho</h3>
            <button class="cart-drawer__close" id="cartCloseBtn">&times;</button>
        </div>
        <div class="cart-drawer__items" id="cartItemsList"></div>
        <div class="cart-drawer__empty" id="cartEmptyMsg">
            <i class="ri-shopping-cart-line"></i>
            <p>O seu carrinho está vazio.<br>Adicione livros para continuar.</p>
        </div>
        <div class="cart-drawer__summary" id="cartSummary" style="display:none;">
            <div class="cart-drawer__total">
                <span>Total</span>
                <strong id="cartTotalValue">0 Kz</strong>
            </div>
            <form id="checkoutForm" class="checkout-form" novalidate>
                <h4>Finalizar Compra</h4>
                <div class="input__group">
                    <input type="text" id="checkoutNome" placeholder="Nome">
                </div>
                <span class="error-msg" id="checkoutNomeError"></span>
                <div class="input__group">
                    <input type="text" id="checkoutSobrenome" placeholder="Sobrenome">
                </div>
                <span class="error-msg" id="checkoutSobrenomeError"></span>
                <div class="input__group">
                    <input type="text" id="checkoutContacto" placeholder="Contacto (telefone ou email)">
                </div>
                <span class="error-msg" id="checkoutContactoError"></span>
                <button type="submit" class="btn__checkout">Finalizar Compra</button>
            </form>
        </div>
    `;
    document.body.appendChild(drawer);

    const floatBtn = document.createElement("button");
    floatBtn.className = "cart-float";
    floatBtn.id = "cartFloatBtn";
    floatBtn.setAttribute("aria-label", "Abrir carrinho");
    floatBtn.innerHTML = '<i class="ri-shopping-cart-2-line"></i><span class="cart-float__badge" id="cartBadge">0</span>';
    document.body.appendChild(floatBtn);

    floatBtn.addEventListener("click", openCart);
    overlay.addEventListener("click", closeCart);
    document.getElementById("cartCloseBtn").addEventListener("click", closeCart);

    document.getElementById("checkoutForm").addEventListener("submit", (e) => {
        e.preventDefault();
        handleCheckout();
    });
}

function openCart() {
    document.getElementById("cartDrawer").classList.add("open");
    document.getElementById("cartOverlay").classList.add("open");
}

function closeCart() {
    document.getElementById("cartDrawer").classList.remove("open");
    document.getElementById("cartOverlay").classList.remove("open");
}

function renderCart() {
    const list = document.getElementById("cartItemsList");
    const emptyMsg = document.getElementById("cartEmptyMsg");
    const summary = document.getElementById("cartSummary");
    const badge = document.getElementById("cartBadge");
    const totalValue = document.getElementById("cartTotalValue");
    if (!list) return;

    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    badge.textContent = totalItems;

    if (cart.length === 0) {
        list.innerHTML = "";
        emptyMsg.classList.add("show");
        summary.style.display = "none";
        return;
    }

    emptyMsg.classList.remove("show");
    summary.style.display = "block";

    list.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.imgSrc}" alt="${item.title}">
            <div class="cart-item__info">
                <h5>${item.title}</h5>
                <span class="cart-item__price">${formatKz(item.price * item.qty)}</span>
                <div class="cart-item__qty">
                    <button type="button" onclick="changeQty(${index}, -1)"><i class="ri-subtract-line"></i></button>
                    <span>${item.qty}</span>
                    <button type="button" onclick="changeQty(${index}, 1)"><i class="ri-add-line"></i></button>
                </div>
            </div>
            <button type="button" class="cart-item__remove" onclick="removeFromCart(${index})"><i class="ri-delete-bin-line"></i></button>
        </div>
    `).join("");

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    totalValue.textContent = formatKz(total);
}

function handleCheckout() {
    if (cart.length === 0) {
        showCustomModal("Carrinho Vazio", "Adicione pelo menos um livro ao carrinho antes de finalizar a compra.", "ri-shopping-cart-line");
        return;
    }

    const nomeInput = document.getElementById("checkoutNome");
    const sobrenomeInput = document.getElementById("checkoutSobrenome");
    const contactoInput = document.getElementById("checkoutContacto");

    let isValid = true;
    clearErrors([nomeInput, sobrenomeInput, contactoInput]);

    // Nome: obrigatório, apenas letras/espaços, mínimo 2 caracteres
    const nomeRegex = /^[A-Za-zÀ-ÿ\s]{2,}$/;
    const nome = nomeInput.value.trim();
    if (!nome || !nomeRegex.test(nome)) {
        showError(nomeInput, "checkoutNomeError", "Introduza um nome válido (apenas letras, mínimo 2 caracteres).");
        isValid = false;
    }

    // Sobrenome: mesmas regras do nome
    const sobrenomeRegex = /^[A-Za-zÀ-ÿ\s]{2,}$/;
    const sobrenome = sobrenomeInput.value.trim();
    if (!sobrenome || !sobrenomeRegex.test(sobrenome)) {
        showError(sobrenomeInput, "checkoutSobrenomeError", "Introduza um sobrenome válido (apenas letras, mínimo 2 caracteres).");
        isValid = false;
    }

    // Contacto: aceita e-mail válido OU número de telefone válido (9-13 dígitos, "+" opcional)
    const contacto = contactoInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telefoneRegex = /^\+?[0-9]{9,13}$/;
    if (!contacto || (!emailRegex.test(contacto) && !telefoneRegex.test(contacto))) {
        showError(contactoInput, "checkoutContactoError", "Introduza um e-mail válido ou um número de telefone válido (ex: 934638979).");
        isValid = false;
    }

    if (!isValid) return;

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    showCustomModal(
        "Compra Finalizada com Sucesso!",
        `Obrigado, <strong>${nome} ${sobrenome}</strong>! A sua encomenda de <strong>${totalItems} livro(s)</strong> no valor de <strong>${formatKz(total)}</strong> foi recebida. Entraremos em contacto através de <strong>${contacto}</strong> com os links de download.`,
        "ri-checkbox-circle-line"
    );

    cart = [];
    renderCart();
    document.getElementById("checkoutForm").reset();
    clearErrors([nomeInput, sobrenomeInput, contactoInput]);
    closeCart();
}

function showCustomModal(title, bodyHtml, iconClass = "ri-information-line") {
    const existingModal = document.querySelector(".custom-modal");
    if (existingModal) existingModal.remove();

    const modal = document.createElement("div");
    modal.className = "custom-modal";
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <div class="modal-icon"><i class="${iconClass}"></i></div>
            <h3 class="modal-title">${title}</h3>
            <div class="modal-body">${bodyHtml}</div>
            <button class="modal-btn">Entendido</button>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => {
        modal.classList.add("open");
    }, 10);

    const closeModal = () => {
        modal.classList.remove("open");
        setTimeout(() => {
            modal.remove();
        }, 300);
    };

    modal.querySelector(".modal-close").addEventListener("click", closeModal);
    modal.querySelector(".modal-btn").addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });
}

/* ==========================================================================
   10. "LIVROS MAIS VISTOS" DINÂMICO (SEM CARROSSEL)
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
   11. LIGHTBOX DINÂMICO PARA A GALERIA (PÁGINA DE SERVIÇOS)
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

/* ==========================================================================
   12. CONTADORES ANIMADOS (PÁGINA SOBRE NÓS)
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

/* ==========================================================================
   13. ÍNDICE DINÂMICO COM SCROLL-SPY (TERMOS DE USO / POLÍTICA DE PRIVACIDADE)
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

/* ==========================================================================
   14. PESQUISA DINÂMICA NO MAPA DO SITE
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

/* ==========================================================================
   15. FILTRO DINÂMICO DE CATEGORIAS DO BLOG
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

/* ==========================================================================
   16. ESTADO DA LOJA EM TEMPO REAL (ABERTO / FECHADO) - PÁGINA DE CONTACTOS
   ========================================================================== */
function initStoreStatus() {
    const statusEl = document.getElementById("storeStatus");
    if (!statusEl) return;

    const now = new Date();
    const day = now.getDay(); // 0 = Domingo ... 6 = Sábado
    const hour = now.getHours() + now.getMinutes() / 60;

    let isOpen = false;
    if (day >= 1 && day <= 5) {
        isOpen = hour >= 8 && hour < 18;
    } else if (day === 6) {
        isOpen = hour >= 9 && hour < 13;
    }

    statusEl.classList.add(isOpen ? "store__status--open" : "store__status--closed");
    statusEl.innerHTML = isOpen
        ? '<i class="ri-checkbox-circle-fill"></i> Estamos Abertos Agora'
        : '<i class="ri-close-circle-fill"></i> Estamos Fechados de Momento';
}