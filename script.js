const WHATSAPP_PHONE = "972597571597";

const cart = [];
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

const heroOrderBtn = document.getElementById("hero-order-btn");
const headerOrderBtn = document.getElementById("header-order-btn");
const contactWhatsAppBtn = document.getElementById("contact-whatsapp");
const checkoutBtn = document.getElementById("checkout-whatsapp");
const clearCartBtn = document.getElementById("clear-cart");

function buildWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;
}

function openWhatsApp(message) {
  window.open(buildWhatsAppUrl(message), "_blank", "noopener");
}

function createSingleProductMessage(productName, productPrice) {
  return `مرحبا، أريد طلب ${productName} - السعر: ${productPrice} شيكل`;
}

function updateCartUI() {
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    const empty = document.createElement("li");
    empty.className = "cart-empty";
    empty.textContent = "لا توجد منتجات في السلة بعد.";
    cartItemsEl.appendChild(empty);
    cartTotalEl.textContent = "0 شيكل";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.name} - ${item.price} شيكل</span>
      <button class="btn btn-small btn-outline remove-item" data-index="${index}">حذف</button>
    `;

    cartItemsEl.appendChild(li);
  });

  cartTotalEl.textContent = `${total} شيكل`;
}

function addToCart(name, price) {
  cart.push({ name, price: Number(price) });
  updateCartUI();
}

function handleProductActions() {
  const productCards = document.querySelectorAll(".product-card");

  productCards.forEach((card) => {
    const name = card.dataset.name;
    const price = Number(card.dataset.price);

    const orderBtn = card.querySelector(".order-product");
    const addBtn = card.querySelector(".add-to-cart");

    orderBtn.addEventListener("click", () => {
      openWhatsApp(createSingleProductMessage(name, price));
    });

    addBtn.addEventListener("click", () => {
      addToCart(name, price);
    });
  });
}


function sendCartToWhatsApp() {
  if (cart.length === 0) {
    alert("السلة فارغة. أضف منتجا واحدا على الأقل.");
    return;
  }

  const lines = cart.map((item, index) => `${index + 1}- ${item.name} (${item.price} شيكل)`);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const message = `مرحبا، أريد طلب المنتجات التالية:%0A${lines.join("%0A")}%0Aالمجموع: ${total} شيكل`;
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${message}`, "_blank", "noopener");
}

function setupGeneralButtons() {
  const generalMessage = "مرحبا، أريد الطلب من مطعم فلافل المذاق الذهبي";

  [heroOrderBtn, headerOrderBtn, contactWhatsAppBtn].forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      openWhatsApp(generalMessage);
    });
  });

  checkoutBtn.addEventListener("click", sendCartToWhatsApp);

  clearCartBtn.addEventListener("click", () => {
    cart.length = 0;
    updateCartUI();
  });

  cartItemsEl.addEventListener("click", (event) => {
    const removeBtn = event.target.closest(".remove-item");

    if (!removeBtn) {
      return;
    }

    const index = Number(removeBtn.dataset.index);
    cart.splice(index, 1);
    updateCartUI();
  });
}

function setupFooterYear() {
  const yearEl = document.getElementById("year");
  yearEl.textContent = new Date().getFullYear();
}

handleProductActions();
setupGeneralButtons();
setupFooterYear();
updateCartUI();
