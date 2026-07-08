/**
 * Livraria Sambambi - JavaScript da Página de Contactos (Exame IHM)
 * Exclusivo de contactos.html: validação do formulário de contacto,
 * mapa interativo (Google Maps) e indicador de Aberto/Fechado.
 * Depende de common.js (deve ser incluído antes deste ficheiro).
 */

document.addEventListener("DOMContentLoaded", () => {
    initContactForm();
    initGoogleMapAPI();
    initStoreStatus();
});

/* ==========================================================================
   1. VALIDAÇÃO DO FORMULÁRIO DE CONTACTOS (FUNÇÕES PRÓPRIAS)
   ========================================================================== */
function initContactForm() {
    const contactForm = document.getElementById("contactForm");
    if (!contactForm) return;

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

/* ==========================================================================
   2. MAPA INTERATIVO (GOOGLE MAPS API + FALLBACK)
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
   3. ESTADO DA LOJA EM TEMPO REAL (ABERTO / FECHADO)
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
