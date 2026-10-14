document.addEventListener("DOMContentLoaded", function () {

// ========================================
// CONFIGURAÇÃO DO WHATSAPP
// ========================================

const WHATSAPP = "5511976384851";

function obterNumeroWhatsApp() {
    return WHATSAPP.replace(/\D/g, "");
}

function abrirWhatsApp(mensagem) {
    const numero = obterNumeroWhatsApp();

    if (!/^55\d{10,11}$/.test(numero)) {
        alert("Verifique o número do WhatsApp do restaurante.");
        return;
    }

    const url =
        "https://api.whatsapp.com/send?phone=" +
        numero +
        "&text=" +
        encodeURIComponent(mensagem);

    window.open(url, "_blank");
}

    // ========================================
    // ELEMENTOS DO CARDÁPIO
    // ========================================

    const menuGrid = document.querySelector(".menu-grid");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const orderButtons = document.querySelectorAll(
        ".menu-card .order-btn"
    );

    // ========================================
    // CARRINHO
    // ========================================

    let carrinho = [];

    // ========================================
    // BOTÃO FLUTUANTE DO CARRINHO
    // ========================================

    const cartToggle = document.createElement("button");

    cartToggle.type = "button";
    cartToggle.className = "cart-toggle";
    cartToggle.setAttribute("aria-label", "Abrir meu carrinho");
    cartToggle.setAttribute("aria-expanded", "false");

    cartToggle.innerHTML = `
        <i class="fa-solid fa-cart-shopping"></i>
        <span>Meu pedido</span>
        <span class="cart-count">0</span>
    `;

    // ========================================
    // FUNDO ESCURO
    // ========================================

    const cartOverlay = document.createElement("div");

    cartOverlay.className = "cart-overlay";
    cartOverlay.id = "cart-overlay";
    cartOverlay.setAttribute("aria-hidden", "true");

    // ========================================
    // PAINEL LATERAL DO CARRINHO
    // ========================================

    const cartSection = document.createElement("section");

    cartSection.id = "pedido";
    cartSection.className = "cart-section";
    cartSection.setAttribute("aria-label", "Meu carrinho");
    cartSection.setAttribute("aria-hidden", "true");

    cartSection.innerHTML = `
        <div class="cart-header">
            <div>
                <span class="section-label">Sabor & Mesa</span>
                <h2>Meu pedido</h2>
            </div>

            <button
                type="button"
                class="cart-close"
                aria-label="Fechar carrinho"
            >
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>

        <div id="cart-items" class="cart-items">
            <p class="cart-empty">
                Seu carrinho está vazio.
                Escolha seus pratos no cardápio!
            </p>
        </div>

        <div class="cart-summary">
            <h3>
                Total:
                <span id="cart-total">R$ 0,00</span>
            </h3>

            <form id="order-form" class="order-form">

                <h3>Dados para finalizar o pedido</h3>

                <label for="cliente-nome">Nome completo</label>
                <input
                    type="text"
                    id="cliente-nome"
                    name="nome"
                    autocomplete="name"
                    placeholder="Digite seu nome completo"
                    required
                >

                <label for="tipo-entrega">
                    Entrega ou retirada?
                </label>

                <select id="tipo-entrega" name="entrega" required>
                    <option value="">Selecione uma opção</option>
                    <option value="Entrega">Entrega</option>
                    <option value="Retirada no local">
                        Retirada no local
                    </option>
                </select>

                <div id="endereco-container" hidden>

                    <label for="cliente-endereco">
                        Endereço de entrega
                    </label>

                    <textarea
                        id="cliente-endereco"
                        name="endereco"
                        rows="3"
                        placeholder="Rua, número, bairro e complemento"
                    ></textarea>

                    <label for="cliente-cep">CEP</label>

                    <input
                        type="text"
                        id="cliente-cep"
                        name="cep"
                        placeholder="00000-000"
                        inputmode="numeric"
                        maxlength="9"
                    >

                </div>

                <label for="forma-pagamento">
                    Forma de pagamento
                </label>

                <select id="forma-pagamento" name="pagamento" required>
                    <option value="">Selecione uma opção</option>
                    <option value="Pix">Pix</option>
                    <option value="Débito">Cartão de débito</option>
                    <option value="Crédito">Cartão de crédito</option>
                    <option value="VR">Vale-refeição (VR)</option>
                </select>

                <label for="observacoes">
                    Observações (opcional)
                </label>

                <textarea
                    id="observacoes"
                    name="observacoes"
                    rows="2"
                    placeholder="Alguma observação sobre o pedido?"
                ></textarea>

                <button
                    type="submit"
                    id="checkout"
                    class="btn btn-gold checkout-btn"
                    disabled
                >
                    <i class="fa-brands fa-whatsapp"></i>
                    Finalizar pedido pelo WhatsApp
                </button>

            </form>
        </div>
    `;

    // ========================================
    // ADICIONAR CARRINHO À PÁGINA
    // ========================================

    document.body.appendChild(cartOverlay);
    document.body.appendChild(cartSection);
    document.body.appendChild(cartToggle);

    // ========================================
    // REFERÊNCIAS DOS ELEMENTOS
    // ========================================

    const cartItems = cartSection.querySelector("#cart-items");
    const cartTotal = cartSection.querySelector("#cart-total");
    const cartCount = cartToggle.querySelector(".cart-count");
    const checkoutButton = cartSection.querySelector("#checkout");
    const cartClose = cartSection.querySelector(".cart-close");

    const orderForm = cartSection.querySelector("#order-form");
    const deliverySelect = cartSection.querySelector("#tipo-entrega");
    const addressContainer =
        cartSection.querySelector("#endereco-container");
    const addressInput =
        cartSection.querySelector("#cliente-endereco");
    const cepInput = cartSection.querySelector("#cliente-cep");

    const pagamentoSelect =
        cartSection.querySelector("#forma-pagamento");

    const nomeInput = cartSection.querySelector("#cliente-nome");
    const observacoesInput = cartSection.querySelector("#observacoes");

    // ========================================
    // ABRIR E FECHAR CARRINHO
    // ========================================

    function abrirCarrinho() {
        cartSection.classList.add("open");
        cartOverlay.classList.add("open");

        cartToggle.setAttribute("aria-expanded", "true");
        cartSection.setAttribute("aria-hidden", "false");
        cartOverlay.setAttribute("aria-hidden", "false");

        document.body.classList.add("cart-open");
    }

    function fecharCarrinho() {
        cartSection.classList.remove("open");
        cartOverlay.classList.remove("open");

        cartToggle.setAttribute("aria-expanded", "false");
        cartSection.setAttribute("aria-hidden", "true");
        cartOverlay.setAttribute("aria-hidden", "true");

        document.body.classList.remove("cart-open");
    }

    cartToggle.addEventListener("click", abrirCarrinho);
    cartClose.addEventListener("click", fecharCarrinho);
    cartOverlay.addEventListener("click", fecharCarrinho);

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            fecharCarrinho();
        }
    });

    // ========================================
    // FORMATAÇÃO DE PREÇOS
    // ========================================

    function formatarMoeda(valor) {
        return valor.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
    }

    function obterPreco(texto) {
        const valor = texto
            .replace(/[^\d,.-]/g, "")
            .replace(/\./g, "")
            .replace(",", ".");

        return Number(valor);
    }

    // ========================================
    // ADICIONAR PRATOS AO CARRINHO
    // ========================================

    orderButtons.forEach(function (button) {
        button.type = "button";

        button.innerHTML = `
            <i class="fa-solid fa-cart-plus"></i>
            Adicionar ao pedido
        `;

        button.addEventListener("click", function () {
            const card = button.closest(".menu-card");

            if (!card) return;

            const nome = card.querySelector("h3")?.textContent.trim();
            const precoTexto =
                card.querySelector(".price")?.textContent.trim();

            if (!nome || !precoTexto) {
                alert("Não foi possível identificar o prato ou seu preço.");
                return;
            }

            const preco = obterPreco(precoTexto);

            if (!Number.isFinite(preco) || preco <= 0) {
                alert("Verifique o preço deste prato.");
                return;
            }

            const itemExistente = carrinho.find(function (item) {
                return item.nome === nome;
            });

            if (itemExistente) {
                itemExistente.quantidade++;
            } else {
                carrinho.push({
                    nome: nome,
                    preco: preco,
                    quantidade: 1
                });
            }

            renderizarCarrinho();
            abrirCarrinho();
        });
    });

    // ========================================
    // ATUALIZAR CARRINHO E TOTAL
    // ========================================

    function renderizarCarrinho() {
        cartItems.innerHTML = "";

        if (carrinho.length === 0) {
            cartItems.innerHTML = `
                <p class="cart-empty">
                    Seu carrinho está vazio.
                    Escolha seus pratos no cardápio!
                </p>
            `;

            cartTotal.textContent = formatarMoeda(0);
            cartCount.textContent = "0";
            checkoutButton.disabled = true;
            orderForm.hidden = true;

            return;
        }

        orderForm.hidden = false;

        let total = 0;
        let quantidadeTotal = 0;

        carrinho.forEach(function (item, index) {
            const subtotal = item.preco * item.quantidade;

            total += subtotal;
            quantidadeTotal += item.quantidade;

            const article = document.createElement("article");
            article.className = "cart-item";

            const details = document.createElement("div");
            details.className = "cart-item-info";

            const title = document.createElement("h3");
            title.textContent = item.nome;

            const price = document.createElement("p");
            price.textContent = `${formatarMoeda(item.preco)} cada`;

            const subtotalElement = document.createElement("strong");
            subtotalElement.textContent =
                `Subtotal: ${formatarMoeda(subtotal)}`;

            details.append(title, price, subtotalElement);

            const controls = document.createElement("div");
            controls.className = "cart-item-controls";

            const decreaseButton = document.createElement("button");
            decreaseButton.type = "button";
            decreaseButton.className = "quantity-btn";
            decreaseButton.dataset.action = "diminuir";
            decreaseButton.dataset.index = index;
            decreaseButton.textContent = "−";
            decreaseButton.setAttribute(
                "aria-label",
                `Diminuir quantidade de ${item.nome}`
            );

            const quantity = document.createElement("span");
            quantity.className = "cart-quantity";
            quantity.textContent = item.quantidade;

            const increaseButton = document.createElement("button");
            increaseButton.type = "button";
            increaseButton.className = "quantity-btn";
            increaseButton.dataset.action = "aumentar";
            increaseButton.dataset.index = index;
            increaseButton.textContent = "+";
            increaseButton.setAttribute(
                "aria-label",
                `Aumentar quantidade de ${item.nome}`
            );

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "remove-item-btn";
            removeButton.dataset.action = "remover";
            removeButton.dataset.index = index;
            removeButton.textContent = "Remover";

            controls.append(
                decreaseButton,
                quantity,
                increaseButton,
                removeButton
            );

            article.append(details, controls);
            cartItems.appendChild(article);
        });

        cartTotal.textContent = formatarMoeda(total);
        cartCount.textContent = quantidadeTotal;
        checkoutButton.disabled = false;
    }

    // ========================================
    // AUMENTAR, DIMINUIR E REMOVER PRATOS
    // ========================================

    cartItems.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-action]");

        if (!button) return;

        const index = Number(button.dataset.index);
        const action = button.dataset.action;
        const item = carrinho[index];

        if (!item) return;

        if (action === "aumentar") {
            item.quantidade++;
        }

        if (action === "diminuir") {
            item.quantidade--;

            if (item.quantidade <= 0) {
                carrinho.splice(index, 1);
            }
        }

        if (action === "remover") {
            carrinho.splice(index, 1);
        }

        renderizarCarrinho();
    });

    // ========================================
    // ENTREGA OU RETIRADA
    // ========================================

    deliverySelect.addEventListener("change", function () {
        const precisaEndereco = deliverySelect.value === "Entrega";

        addressContainer.hidden = !precisaEndereco;
        addressInput.required = precisaEndereco;
        cepInput.required = precisaEndereco;

        if (!precisaEndereco) {
            addressInput.value = "";
            cepInput.value = "";
        }
    });

    // ========================================
    // FORMATAÇÃO DO CEP
    // ========================================

    cepInput.addEventListener("input", function () {
        let numeros = cepInput.value.replace(/\D/g, "").slice(0, 8);

        if (numeros.length > 5) {
            numeros = numeros.slice(0, 5) + "-" + numeros.slice(5);
        }

        cepInput.value = numeros;
    });

    // ========================================
    // FINALIZAR PEDIDO PELO WHATSAPP
    // ========================================

    orderForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (carrinho.length === 0) {
            alert("Adicione pelo menos um prato ao pedido.");
            return;
        }

        if (!orderForm.reportValidity()) {
            return;
        }

        const numero = obterNumeroWhatsApp();

        if (!/^55\d{10,11}$/.test(numero)) {
            alert("Verifique o número do WhatsApp do restaurante.");
            return;
        }

        const nome = nomeInput.value.trim();
        const tipoEntrega = deliverySelect.value;
        const endereco = addressInput.value.trim();
        const cep = cepInput.value.trim();
        const pagamento = pagamentoSelect.value;
        const observacoes = observacoesInput.value.trim();

        const ehEntrega = tipoEntrega === "Entrega";

        if (ehEntrega && !endereco) {
            alert("Informe o endereço de entrega.");
            addressInput.focus();
            return;
        }

        if (ehEntrega && !/^\d{5}-?\d{3}$/.test(cep)) {
            alert("Informe um CEP válido, como 00000-000.");
            cepInput.focus();
            return;
        }

        let total = 0;

        const itensMensagem = carrinho.map(function (item) {
            const subtotal = item.preco * item.quantidade;

            total += subtotal;

            return `${item.quantidade}x ${item.nome} - ${formatarMoeda(subtotal)}`;
        });

        const mensagem = [
            "Olá! Gostaria de finalizar meu pedido pelo site Sabor & Mesa.",
            "",
            "DADOS DO CLIENTE",
            `Nome: ${nome}`,
            "",
            "PEDIDO",
            ...itensMensagem,
            "",
            `TOTAL: ${formatarMoeda(total)}`,
            "",
            "ENTREGA E PAGAMENTO",
            `Modalidade: ${tipoEntrega}`,
            `Endereço: ${ehEntrega ? endereco : "Retirada no local"}`,
            `CEP: ${ehEntrega ? cep : "Não se aplica"}`,
            `Pagamento: ${pagamento}`,
            `Observações: ${observacoes || "Nenhuma"}`
        ].join("\n");

        abrirWhatsApp(mensagem);
    });

    // ========================================
    // FILTROS DE CATEGORIAS
    // ========================================

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const categoria = button.dataset.category;

            filterButtons.forEach(function (filter) {
                filter.classList.remove("active");
                filter.setAttribute("aria-pressed", "false");
            });

            button.classList.add("active");
            button.setAttribute("aria-pressed", "true");

            document.querySelectorAll(".menu-card").forEach(function (card) {
                const categoriaPrato = card.dataset.category;

                card.hidden = (
                    categoria !== "todos" &&
                    categoriaPrato !== categoria
                );
            });
        });
    });

    // ========================================
    // BOTÕES DE CONTATO DO WHATSAPP
    // ========================================

    document.querySelectorAll(".whatsapp-link").forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();

            const mensagem =
                "Olá! Gostaria de saber mais sobre o Sabor & Mesa.";

            abrirWhatsApp(mensagem);
        });
    });

    // ========================================
    // INICIALIZAÇÃO
    // ========================================

    renderizarCarrinho();

});
