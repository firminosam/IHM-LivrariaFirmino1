/**
 * Livraria Sambambi - JavaScript da Página de Login (Exame IHM)
 * Exclusivo de login.html: validação do formulário (função própria).
 * Depende de common.js (deve ser incluído antes deste ficheiro).
 */

document.addEventListener("DOMContentLoaded", () => {
    initLoginForm();
});

/* ==========================================================================
   VALIDAÇÃO DO FORMULÁRIO DE LOGIN
   ========================================================================== */
function initLoginForm() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

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
