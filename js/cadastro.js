/**
 * Livraria Sambambi - JavaScript da Página de Cadastro (Exame IHM)
 * Exclusivo de Cadastro.html: validação do formulário (função própria).
 * Depende de common.js (deve ser incluído antes deste ficheiro).
 */

document.addEventListener("DOMContentLoaded", () => {
    initCadastroForm();
});

/* ==========================================================================
   VALIDAÇÃO DO FORMULÁRIO DE CADASTRO (CRIAR CONTA)
   ========================================================================== */
function initCadastroForm() {
    const cadastroForm = document.getElementById("cadastroForm");
    if (!cadastroForm) return;

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
