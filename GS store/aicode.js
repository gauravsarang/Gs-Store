// ================== STATE MANAGEMENT ==================
const state = {
  cart: [],
  user: null,
  orders: [],
  categories: [],
};

// ================== UTILITY FUNCTIONS ==================
// Fetch data from API
async function fetchData(url) {
  try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
  } catch (error) {
      console.error("Error fetching data:", error);
      return [];
  }
}

// Save to local storage
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Load from local storage
function loadFromLocalStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

// ================== DOM UTILITIES ==================
function updateCartCounter() {
  const counter = document.getElementById("itemcounter");
  counter.textContent = state.cart.length;
}

function showElement(element) {
  element.classList.remove("d-none");
}

function hideElement(element) {
  element.classList.add("d-none");
}

// ================== PRODUCT FUNCTIONS ==================
async function loadProducts(category = "ALL") {
  const url =
      category === "ALL"
          ? "https://fakestoreapi.com/products"
          : `https://fakestoreapi.com/products/category/${category}`;
  const products = await fetchData(url);
  renderProducts(products);
}

function renderProducts(products) {
  const catalog = document.getElementById("catelog");
  catalog.innerHTML = products
      .map(
          (product) => `
      <div class="card p-2 border-0 main-card products-card" style="min-width: 250px; width: 200px;">
          <div class="d-flex justify-content-between">
              <div class="card-circle"></div>
              <div class="card-circle"></div>
          </div>
          <img loading="lazy" class="card-img-top" src="${product.image}" alt="${product.title}" style="height: 200px">
          <div class="card-header overflow-hidden mt-2 text-truncate"><span class="productdetails">Title: </span>${product.title}</div>
          <div class="card-body w-100">
              <dl>
                  <dd class="card-text"><span class="productdetails">Price:</span> &#8377;${product.price}</dd>
                  <dd><span class="productdetails">Rating:</span> ${product.rating.rate} <span class="bi bi-star-fill" style="color: yellow"></span></dd>
                  <dd><span class="productdetails">Buyers:</span> ${product.rating.count} <span class="bi bi-person-fill" style="color: blue"></span></dd>
              </dl>
          </div>
          <div class="card-footer">
              <button onclick="addToCart(${product.id})" id="submitbtn-${product.id}" class="btn btn-success w-100"><span class="bi bi-cart-plus"></span> Add to cart</button>
              <button id="Item-In-Cart-${product.id}" class="d-none" data-bs-toggle="modal" data-bs-target="#cart"><span class="bi bi-cart-check-fill"></span> Item In Cart</button>
          </div>
      </div>`
      )
      .join("");
}

// ================== CART FUNCTIONS ==================
function addToCart(productId) {
  if (!state.cart.includes(productId)) {
      state.cart.push(productId);
      saveToLocalStorage("cart", state.cart);
      updateCartCounter();
      alert("Item added to cart!");
      toggleCartButton(productId, true);
  }
}

function removeCartItem(productId) {
  state.cart = state.cart.filter((id) => id !== productId);
  saveToLocalStorage("cart", state.cart);
  updateCartCounter();
  alert("Item removed from cart!");
  toggleCartButton(productId, false);
  displayCartItems();
}

function toggleCartButton(productId, isInCart) {
  const addButton = document.getElementById(`submitbtn-${productId}`);
  const inCartButton = document.getElementById(`Item-In-Cart-${productId}`);
  if (isInCart) {
      hideElement(addButton);
      showElement(inCartButton);
  } else {
      showElement(addButton);
      hideElement(inCartButton);
  }
}

async function displayCartItems() {
  const cartContent = document.getElementById("content");
  if (state.cart.length === 0) {
      cartContent.innerHTML = "<p class='text-center fs-4'>No items in cart <i class='bi bi-emoji-smile-upside-down-fill'></i></p>";
      return;
  }

  const products = await Promise.all(state.cart.map((id) => fetchData(`https://fakestoreapi.com/products/${id}`)));
  cartContent.innerHTML = products
      .map(
          (product) => `
      <table class="table table-hover" style="width: 100%;">
          <thead>
              <tr>
                  <th class="w-50">Product Name</th>
                  <th class="w-25">Price</th>
                  <th class="text-center w-25">Preview</th>
              </tr>
          </thead>
          <tbody>
              <tr>
                  <td class="w-50">
                      <div class="d-flex flex-column gap-5">
                          <div class="overflow-hidden" style="height: 50px">${product.title}</div>
                          <div class="d-flex gap-3">
                              <button id="orderplacedbtn-${product.id}" onclick="displayPacedOrders()" class="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#finalOrder">Order Placed</button>
                              <button id="confirmOrderbtn-${product.id}" onclick="confirmOrder(${product.id})" class="btn btn-success">Order <span class="bi bi-cart"></span></button>
                              <button id="removeOrderBtn-${product.id}" onclick="removeCartItem(${product.id})" class="btn btn-danger">Remove <span class="bi bi-trash"></span></button>
                          </div>
                      </div>
                  </td>
                  <td class="w-25 align-content-start">&#8377;${product.price}</td>
                  <td class="w-25 text-center" onclick="previewItems(${product.id})" data-bs-toggle="modal" data-bs-target="#cartpreview">
                      <img class="card-img-top" src="${product.image}" height="100px" width="100px">
                  </td>
              </tr>
          </tbody>
      </table>`
      )
      .join("");
}

// ================== ORDER FUNCTIONS ==================
function confirmOrder(id) {
  if (!state.orders.includes(id)) {
      state.orders.push(id);
      saveToLocalStorage("orders", state.orders);
      document.getElementById(`confirmOrderbtn-${id}`).classList.add("d-none");
      document.getElementById(`orderplacedbtn-${id}`).classList.remove("d-none");
  }
}

async function displayPacedOrders() {
  const finalOrder = document.getElementById("finalOrderPreview");
  finalOrder.innerHTML = "";
  for (const productID of state.orders) {
      const product = await fetchData(`https://fakestoreapi.com/products/${productID}`);
      finalOrder.innerHTML += `
          <div class="card mb-4 shadow-sm">
              <div class="card-header">
                  <h4 class="my-0 font-weight-normal">${product.title}</h4>
              </div>
              <div class="card-body">
                  <img src="${product.image}" class="card-img-top" alt="...">
                  <ul class="list-group list-group-flush">
                      <li class="list-group-item">Price: ${product.price}</li>
                      <li class="list-group-item">Description: ${product.description}</li>
                  </ul>
                  <button id="removeOrderbtn-${product.id}" onclick="removeOrder(${product.id})" class="btn btn-primary">Remove</button>
              </div>
          </div>`;
  }
}

function removeOrder(id) {
  state.orders = state.orders.filter((orderId) => orderId !== id);
  saveToLocalStorage("orders", state.orders);
  displayPacedOrders();
}

// ================== INITIALIZATION ==================
async function initialize() {
  state.cart = loadFromLocalStorage("cart") || [];
  state.orders = loadFromLocalStorage("orders") || [];
  updateCartCounter();

  const categories = await fetchData("https://fakestoreapi.com/products/categories");
  state.categories = ["ALL", ...categories];
  renderCategories();

  loadProducts();
}

function renderCategories() {
  const select = document.querySelector("select");
  select.innerHTML = state.categories
      .map((category) => `<option value="${category}">${category.toUpperCase()}</option>`)
      .join("");
}

// ================== EVENT LISTENERS ==================
document.querySelector("select").addEventListener("change", (e) => {
  loadProducts(e.target.value);
});

// Initialize the app
window.onload = initialize;