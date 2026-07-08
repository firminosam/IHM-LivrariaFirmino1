/**
 * Livraria Sambambi - JavaScript da Página de Vendas (Exame IHM)
 * Exclusivo de Vendas.html: carrinho de compras completo (adicionar,
 * remover, alterar quantidade e finalizar compra com validação própria).
 * Depende de common.js (deve ser incluído antes deste ficheiro).
 */

document.addEventListener("DOMContentLoaded", () => {
    initCartActions();
});

let cart = [];

/* ==========================================================================
   1. INICIALIZAÇÃO DO CARRINHO
   ========================================================================== */
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

/* ==========================================================================
   2. CONSTRUÇÃO DA INTERFACE DO CARRINHO (DRAWER)
   ========================================================================== */
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

/* ==========================================================================
   3. FINALIZAÇÃO DA COMPRA (VALIDAÇÃO PRÓPRIA)
   ========================================================================== */
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
