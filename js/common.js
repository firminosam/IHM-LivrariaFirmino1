/**
 * Livraria Sambambi - JavaScript Comum (Exame IHM)
 * Funcionalidades usadas em TODAS as páginas do site:
 * Menu responsivo, Dark Mode, Botão Voltar ao Topo, Botão WhatsApp,
 * Modal personalizada, Validação de Newsletter, Leitura/Download de livros
 * e as animações de "revelar ao rolar" (scroll reveal).
 *
 * Este ficheiro deve ser incluído em TODAS as páginas, antes do
 * JavaScript específico de cada página (ex: livros.js, blog.js, etc.)
 */

document.addEventListener("DOMContentLoaded", () => {
    initResponsiveNav();
    initDarkMode();
    initBackToTop();
    initWhatsAppButton();
    initBookReading();
    initDownloadConfirmation();
    initNewsletterForms();
    initScrollReveal();
});

/* ==========================================================================
   1. ANIMAÇÕES AO ROLAR A PÁGINA (SCROLL REVEAL)
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
    // (ex.: elementos que já estavam visíveis antes do observer arrancar,
    // ou que foram clonados por outro script de página depois deste correr)
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
   3. DARK MODE (MODO ESCURO) - DINÂMICO
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
   4. BOTÃO FLUTUANTE DO WHATSAPP
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
   5. BOTÃO VOLTAR AO TOPO - DINÂMICO
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
   6. FUNÇÕES AUXILIARES DE VALIDAÇÃO DE FORMULÁRIOS (usadas por outras páginas)
   ========================================================================== */
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
   7. VALIDAÇÃO DOS FORMULÁRIOS DE NEWSLETTER (Presentes no Footer de Todas as Páginas)
   ========================================================================== */
function initNewsletterForms() {
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

/* ==========================================================================
   8. MODAL DINÂMICA E PERSONALIZADA (usada em várias páginas)
   ========================================================================== */
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
   9. LEITURA DE LIVROS (PDF MAPPING) - Presente na Home e no Catálogo
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
   10. CONFIRMAÇÃO DE DOWNLOAD DE LIVROS
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
