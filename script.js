const productsByCategory = {
  accessories: [
    { id: "p1", name: "Canvas Tote Bag", price: 24 },
    { id: "p2", name: "Ceramic Mug", price: 14 },
    { id: "p5", name: "Notebook Set", price: 12 },
    { id: "p6", name: "Sunglasses", price: 32 },
    { id: "p7", name: "Water Bottle", price: 20 },
    { id: "p9", name: "Leather Wallet", price: 38 },
    { id: "p10", name: "Knit Beanie", price: 16 },
  ],
  electronics: [
    { id: "p3", name: "Wireless Earbuds", price: 59 },
    { id: "p8", name: "Table Lamp", price: 45 },
    { id: "p11", name: "Bluetooth Speaker", price: 49 },
    { id: "p12", name: "Smart Watch", price: 89 },
    { id: "p13", name: "Portable Charger", price: 27 },
  ],
  plants: [
    { id: "p4", name: "Desk Plant", price: 18 },
    { id: "p14", name: "Succulent Trio", price: 22 },
    { id: "p15", name: "Fiddle Leaf Fig", price: 42 },
    { id: "p16", name: "Herb Garden Kit", price: 29 },
  ],
};

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%23e3e6ee'/%3E%3C/svg%3E";

const PRODUCT_IMAGES = {
  p1: ["images/products/p1/1.jpg", "images/products/p1/2.jpg", "images/products/p1/3.jpg"],
  p2: ["images/products/p2/1.jpg", "images/products/p2/2.jpg", "images/products/p2/3.jpg"],
  p3: ["images/products/p3/1.jpg", "images/products/p3/2.jpg", "images/products/p3/3.jpg"],
  p4: ["images/products/p4/1.jpg", "images/products/p4/2.jpg", "images/products/p4/3.jpg"],
  p5: ["images/products/p5/1.jpg", "images/products/p5/2.jpg", "images/products/p5/3.jpg"],
  p6: ["images/products/p6/1.jpg", "images/products/p6/2.jpg", "images/products/p6/3.jpg"],
  p7: ["images/products/p7/1.jpg", "images/products/p7/2.jpg", "images/products/p7/3.jpg"],
  p8: ["images/products/p8/1.jpg", "images/products/p8/2.jpg", "images/products/p8/3.jpg"],
  p9: ["images/products/p9/1.jpg", "images/products/p9/2.jpg", "images/products/p9/3.jpg"],
  p10: ["images/products/p10/1.jpg", "images/products/p10/2.jpg", "images/products/p10/3.jpg"],
  p11: ["images/products/p11/1.jpg", "images/products/p11/2.jpg", "images/products/p11/3.jpg"],
  p12: ["images/products/p12/1.jpg", "images/products/p12/2.jpg", "images/products/p12/3.png"],
  p13: ["images/products/p13/1.jpg", "images/products/p13/2.jpg", "images/products/p13/3.jpg"],
  p14: ["images/products/p14/1.jpg", "images/products/p14/2.jpg", "images/products/p14/3.jpg"],
  p15: ["images/products/p15/1.jpg", "images/products/p15/2.jpg", "images/products/p15/3.jpg"],
  p16: ["images/products/p16/1.jpg", "images/products/p16/2.jpg", "images/products/p16/3.jpg"],
};

const products = Object.entries(productsByCategory).flatMap(([category, items]) =>
  items.map((item) => ({ ...item, category, images: PRODUCT_IMAGES[item.id] }))
);

const CART_KEY = "cart";
const THEME_KEY = "theme";
let activeCategory = "all";
let searchQuery = "";

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.setAttribute("aria-pressed", String(theme === "dark"));
    toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  applyTheme(current === "dark" ? "light" : "dark");
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

function renderProducts() {
  const grid = document.getElementById("product-grid");
  const query = searchQuery.trim().toLowerCase();

  const visible = products.filter((p) => {
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    const matchesQuery = query === "" || p.name.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  if (visible.length === 0) {
    grid.innerHTML = `<p class="product-empty">No products match your search.</p>`;
    return;
  }

  grid.innerHTML = visible
    .map(
      (p) => `
    <div class="product-card" data-id="${p.id}">
      <div class="product-image">
        <img class="product-image-main" src="${p.images[0]}" alt="${p.name}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'" />
      </div>
      <div class="product-info">
        <div class="product-title-row">
          <div class="product-name">${p.name}</div>
          <div class="image-selector" role="group" aria-label="Choose photo for ${p.name}">
            ${p.images
              .map(
                (img, i) => `
              <button
                type="button"
                class="image-swatch${i === 0 ? " active" : ""}"
                data-id="${p.id}"
                data-index="${i}"
                style="background-image:url('${img}')"
                aria-label="Show photo ${i + 1} of ${p.name}"
                aria-pressed="${i === 0}"
              ></button>`
              )
              .join("")}
          </div>
        </div>
        <div class="product-price">${formatCurrency(p.price)}</div>
        <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
      </div>
    </div>`
    )
    .join("");
}

function selectProductImage(swatch) {
  const card = swatch.closest(".product-card");
  const product = products.find((p) => p.id === swatch.dataset.id);
  if (!card || !product) return;

  const index = Number(swatch.dataset.index);
  const mainImg = card.querySelector(".product-image-main");
  mainImg.src = product.images[index] || FALLBACK_IMAGE;

  card.querySelectorAll(".image-swatch").forEach((el) => {
    const isActive = el === swatch;
    el.classList.toggle("active", isActive);
    el.setAttribute("aria-pressed", String(isActive));
  });
}

function addToCart(id) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
  renderCart();
}

function changeQty(id, delta) {
  const cart = getCart();
  if (!cart[id]) return;
  cart[id] += delta;
  if (cart[id] <= 0) delete cart[id];
  saveCart(cart);
  renderCart();
}

function cartCount(cart) {
  return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function cartSubtotal(cart) {
  return Object.entries(cart).reduce((sum, [id, qty]) => {
    const product = products.find((p) => p.id === id);
    return sum + (product ? product.price * qty : 0);
  }, 0);
}

function renderCart() {
  const cart = getCart();
  const itemsEl = document.getElementById("cart-items");
  const countEl = document.getElementById("cart-count");
  const subtotalEl = document.getElementById("cart-subtotal");
  const checkoutBtn = document.getElementById("checkout-btn");

  const entries = Object.entries(cart);
  countEl.textContent = cartCount(cart);

  if (entries.length === 0) {
    itemsEl.innerHTML = `<li class="cart-empty">Your cart is empty</li>`;
  } else {
    itemsEl.innerHTML = entries
      .map(([id, qty]) => {
        const product = products.find((p) => p.id === id);
        if (!product) return "";
        return `
        <li class="cart-item">
          <div class="cart-item-icon">
            <img src="${product.images[0]}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMAGE}'" />
          </div>
          <div class="cart-item-details">
            <div class="cart-item-name">${product.name}</div>
            <div class="cart-item-price">${formatCurrency(product.price)}</div>
          </div>
          <div class="cart-item-qty">
            <button class="qty-btn" data-id="${id}" data-delta="-1">−</button>
            <span>${qty}</span>
            <button class="qty-btn" data-id="${id}" data-delta="1">+</button>
          </div>
        </li>`;
      })
      .join("");
  }

  subtotalEl.textContent = formatCurrency(cartSubtotal(cart));
  checkoutBtn.disabled = entries.length === 0;
}

function openCart() {
  document.getElementById("cart-panel").classList.add("open");
  document.getElementById("cart-overlay").classList.add("open");
}

function closeCart() {
  document.getElementById("cart-panel").classList.remove("open");
  document.getElementById("cart-overlay").classList.remove("open");
}

function checkout() {
  const cart = getCart();
  if (Object.keys(cart).length === 0) return;
  alert(`Order placed! Total: ${formatCurrency(cartSubtotal(cart))}`);
  saveCart({});
  renderCart();
  closeCart();
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCart();
  applyTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  document.getElementById("theme-toggle").addEventListener("click", toggleTheme);

  document.getElementById("search-input").addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderProducts();
  });

  document.getElementById("product-grid").addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart");
    if (btn) {
      addToCart(btn.dataset.id);
      return;
    }

    const swatch = e.target.closest(".image-swatch");
    if (swatch) selectProductImage(swatch);
  });

  document.getElementById("cart-items").addEventListener("click", (e) => {
    const btn = e.target.closest(".qty-btn");
    if (btn) changeQty(btn.dataset.id, Number(btn.dataset.delta));
  });

  document.getElementById("cart-toggle").addEventListener("click", openCart);
  document.getElementById("cart-close").addEventListener("click", closeCart);
  document.getElementById("cart-overlay").addEventListener("click", closeCart);
  document.getElementById("checkout-btn").addEventListener("click", checkout);

  const navLinks = document.getElementById("nav-links");
  navLinks.addEventListener("click", (e) => {
    const link = e.target.closest(".nav-link");
    if (!link) return;
    e.preventDefault();

    activeCategory = link.dataset.category;
    navLinks
      .querySelectorAll(".nav-link")
      .forEach((el) => el.classList.toggle("active", el === link));
    renderProducts();
    navLinks.classList.remove("open");
    document.getElementById("nav-toggle").setAttribute("aria-expanded", "false");
  });

  const navToggle = document.getElementById("nav-toggle");
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
});
