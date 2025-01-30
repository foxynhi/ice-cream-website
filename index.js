import productList from "./script/productDB.js";
import features from "./script/featureDB.js";

const LOCAL_STORAGE_CART_KEY = 'myCart';

//Get value associated with cart key from browser's local storage as string, then parse to json
let cartItems = JSON.parse(localStorage.getItem(LOCAL_STORAGE_CART_KEY)) || [];

//DOMContentLoaded event listener fire when HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading
document.addEventListener("DOMContentLoaded", () => {
  displayFeatures(features);
  displayProduct(productList);
  displayCart()
});

function displayFeatures(features) {
  let featureSection = document.querySelector(".features");

  features.forEach((feature) => {
    let box = document.createElement('div');

    box.setAttribute('class', 'feature-box');
    box.setAttribute('id', feature.id);

    box.innerHTML = `
      <div class='feature-img'>
        <img src='${feature.image}' alt='${feature.name}'/>
      </div>
      <div class='feature-text'>
        <h2>${feature.name}</h2>
        <p>${feature.description}</p>
      </div>
    `;
    featureSection.appendChild(box);
  })
};

function displayProduct(productList) {
  let productSection = document.querySelector(".products");

  productList.forEach((product) => {
    let box = document.createElement("div");

    box.setAttribute('class', 'product-box');
    box.setAttribute('id', product.id);

    box.innerHTML = `
          <div class='product-img'>
            <img src="${product.image}" alt="${product.name}" >
          </div>
          <div class='name-price'>
            <div class='name'>${product.name}</div>
            <div class='price'>$${product.price}</div>
          </div>
          <div class='description'>${product.description}</div>
          <div class='quantity'>
            <span class='decrease'>-</span>
            <span class='pcs'>1</span>
            <span class='increase'>+</span>
          </div>
        `;

    let addToCartBtn = document.createElement('button');
    addToCartBtn.setAttribute('class', 'button add-to-cart');
    let existingCartItem = cartItems.find((item) => item.id == product.id);
    addToCartBtn.textContent = existingCartItem 
      ? 'Already in Cart - Add more!'
      : 'Add to Cart';

    // addToCartBtn.textContent = 'Add to Cart';
    addToCartBtn.addEventListener('click', (e) => {
      addToCart(e);
    });


    box.appendChild(addToCartBtn);

    productSection.appendChild(box);
  });
};

function handleRemoveItem() {
  const removeItemBtns = document.querySelectorAll('.remove-item-btn');

  removeItemBtns.forEach((btn => {
    btn.addEventListener('click', (e) => {
      const itemId = e.target.closest('li').getAttribute('id');
      cartItems = cartItems.filter((item) => item.id != itemId);

      const productBox = document.querySelector(`.product-box[id='${itemId}']`);
      if (productBox) {
        productBox.querySelector('button').textContent = 'Add to Cart';
      };
  
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
      displayCart();
    });
  }))  
};

function displayCart() {
  if (cartItems.length == 0) {
    document.querySelector('.empty-cart').classList.add('active');
    document.querySelector('.no-empty-cart').classList.remove('active');
  } else {
    document.querySelector('.empty-cart').classList.remove('active');
    document.querySelector('.no-empty-cart').classList.add('active');
  };
  const cartUl = document.querySelector('.cart-list');
  cartUl.innerHTML = '';

  let subTotal = 0, itemCount = 0;

  cartItems.map((cartItem) => {
    let itemLi = document.createElement('li');
    itemLi.setAttribute('id', cartItem.id);

    let product = productList.find((product) => product.id == cartItem.id);
    if (product) {
      itemLi.innerHTML = `
      <img src='${product.image}' alt='${product.name}'/>
      <div class='text'>
        <span class='name'>${product.name}</span>
        <div class='quantity'>
          <span class='decrease'>-</span>
          <span class='pcs'>${cartItem.pcs}</span>
          <span class='increase'>+</span>
        </div>
        <div class='item-total'>$${cartItem.itemTotal}</div>
        <i class='fas fa-trash remove-item-btn'></i>
      </div>
      `;
      cartUl.appendChild(itemLi);
      handleRemoveItem();
      subTotal += cartItem.itemTotal;
      itemCount += cartItem.pcs;
    } else {
      console.error(`Product ID ${cartItem.id} not found.`);
    }
  });
  document.querySelector('.sub-total').textContent = `$${subTotal}`;
  document.querySelector('.cart-count').textContent = itemCount;
}

function addToCart(e) {
  let itemId = e.target.parentElement.getAttribute('id');
  let item = productList.find((item) => item?.id == itemId);
  let existingCartItem = cartItems.find((item) => item?.id == itemId);
  let pcs = parseInt(e.target.parentElement.querySelector('.pcs').textContent);
  let itemTotal = item.price * pcs;

  if (existingCartItem) {
    existingCartItem.pcs += (pcs);
    existingCartItem.itemTotal += (itemTotal);
  }
  else {
    cartItems.push({
      id: item.id,
      pcs: pcs,
      itemTotal: itemTotal
    });
    e.target.textContent = 'Already in Cart - Add more!';
  };
  localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
  displayCart();
};

function handleProductQuantityChange () {
  const productsBox = document.querySelector('.products');
  if (!productsBox) return;

  productsBox.addEventListener('click', (e) => {
    if (e.target.classList.contains('increase')) {
      const qtySpan = e.target.parentElement.querySelector('.pcs');
      let currQty = parseInt(qtySpan.textContent);
      qtySpan.textContent = currQty + 1;
    } else if (e.target.classList.contains('decrease')) {
      const qtySpan = e.target.parentElement.querySelector('.pcs');
      let currQty = parseInt(qtySpan.textContent);
      if (currQty > 1) qtySpan.textContent = currQty - 1;
    }
  });
};
handleProductQuantityChange();

function handleCartQuantityChange () {
  const cartList = document.querySelector('.cart-list');
  if (!cartList) return;

  cartList.addEventListener('click', (e) => {
    const itemId = e.target.closest('li').getAttribute('id');
    let cartItem = cartItems.find((item) => item.id == itemId);
    const itemPrice = productList.find((item) => item.id == itemId).price;
    if (e.target.classList.contains('increase')) {
      const qtySpan = e.target.parentElement.querySelector('.pcs');
      let currQty = parseInt(qtySpan.textContent);

      cartItem.pcs = currQty + 1;
      qtySpan.textContent = cartItem.pcs;
      
      cartItem.itemTotal = cartItem.pcs * itemPrice;
      const itemTotalDiv = e.target.parentElement.nextElementSibling;
      itemTotalDiv.textContent = `$${cartItem.itemTotal}`;   
      
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));
    } 
    if (e.target.classList.contains('decrease')) {
      const qtySpan = e.target.parentElement.querySelector('.pcs');
      let currQty = parseInt(qtySpan.textContent);

      if (currQty > 1) {
        cartItem.pcs = currQty - 1;
        qtySpan.textContent = currQty - 1;

        cartItem.itemTotal = cartItem.pcs * itemPrice;
        const itemTotalDiv = e.target.parentElement.nextElementSibling;
        itemTotalDiv.textContent = `$${cartItem.itemTotal}`;       

        localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems));

      }
    }
    displayCart();
  });
};
handleCartQuantityChange();
