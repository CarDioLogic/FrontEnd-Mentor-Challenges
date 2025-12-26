const cartIcon = document.getElementById('cart-icon');
const cart = document.getElementById('cart');
const cartContainer = document.getElementById('cart-container');
const decrementBtn = document.getElementById('decrement');
const incrementBtn = document.getElementById('increment');
const addToCartBtn = document.getElementById('add-to-cart-btn');
const lightbox = document.getElementById('lightbox');
let currentLightboxImageIndex = 0;
let product = {};
let cartItems = [];

document.addEventListener("DOMContentLoaded", async () => {
    product = await getProduct(1);
    initProductInfo();
    initEvents();
});

function initEvents(){
    cartIcon.addEventListener('click', () => {
        cart.classList.toggle('hidden');
    });

    addToCartBtn.addEventListener('click', () => {
        incrementProductToCart(product.id);
    });

    decrementBtn.addEventListener('click', () => {
        decrementProductFromCart(product.id);
    });

    incrementBtn.addEventListener('click', () => {
        incrementProductToCart(product.id);
    });

    document.addEventListener('click', (e) => {
        if(!(cartContainer.contains(e.target)) && cartIcon != e.target){
            cart.classList.add('hidden');
        }
    });
    document.getElementById("product-active").addEventListener('click', (e) => {
        let image = document.getElementById("main-display-image");
        currentLightboxImageIndex = image.getAttribute('data-imageindex');
        renderLightboxMainProductImage(currentLightboxImageIndex);      
        lightbox.classList.remove('closed');  
    });

    document.getElementById("lightbox-previous-arrow").addEventListener("click", () => {
        currentLightboxImageIndex--;
        if(currentLightboxImageIndex < 0)
            currentLightboxImageIndex = product.images.length - 1;
        
        renderLightboxMainProductImage(currentLightboxImageIndex);        
    });

    document.getElementById("lightbox-next-arrow").addEventListener("click", () => {
        currentLightboxImageIndex++;
        if(currentLightboxImageIndex > product.images.length - 1)
            currentLightboxImageIndex = 0;

        renderLightboxMainProductImage(currentLightboxImageIndex);        
    });

    document.getElementById("close-lightbox").addEventListener("click", () => {
        lightbox.classList.add('closed');
    });    

    document.getElementById("menu-icon_open").addEventListener("click", () => {
        document.getElementById("nav-links").classList.remove("closed");
        document.getElementById("menu-icon_open").classList.add("hidden");
        document.getElementById("menu-icon_close").classList.remove("hidden");
    });

    document.getElementById("menu-icon_close").addEventListener("click", () => {
        document.getElementById("nav-links").classList.add("closed");
        document.getElementById("menu-icon_open").classList.remove("hidden");
        document.getElementById("menu-icon_close").classList.add("hidden");
    });
}



function initProductInfo(){
    document.getElementById('brand-title').textContent = product.brandTitle;
    document.getElementById('product-title').textContent = product.title;
    document.getElementById('product-description').textContent = product.description;

    if(hasDiscount(product)){
        document.getElementById("discount-container").classList.remove("hidden");

        fullPriceEl = document.getElementById('full-price');
        fullPriceEl.textContent = `$${parseFloat(product.price).toFixed(2)}`;
        fullPriceEl.classList.add("line-trough");

        document.getElementById('discount').textContent = `${product.discountPercentage}%`;
        document.getElementById('discount-price').textContent = `$${calculateRealProductPrice(product)}`;
    }

    if(hasImages(product)){
        renderMainProductImage(0);
        renderProductThumbnails(product.images);
        renderLightboxProductThumbnails(product.images);
    }
}

function hasImages(product){
    return product.images.length > 0;
}

function hasDiscount(product){
    return product.discountPercentage > 0;
}

function calculateRealProductPrice(product){
    if(!hasDiscount(product))
        return parseFloat(product.price).toFixed(2);

    return parseFloat(product.price * (product.discountPercentage / 100)).toFixed(2);
}

function decrementProductFromCart(productId){
    if(!Object.keys(cartItems).length > 0)
        return;

    let item = findCartitem(productId);

    if (item && item.quantity > 0) {
        item.quantity -= 1;
        document.getElementById("quantity").textContent = item?.quantity ?? 0;
        updateCart();
    } else {
        removeItemFromCart(productId);
    }
}

function incrementProductToCart(productId){
    let item = findCartitem(productId);

    if (item) {
        item.quantity += 1;
    } else {
        cartItems.push({
            ...product,
            quantity: 1
        });

        item = findCartitem(productId);
    }    
   
    document.getElementById("quantity").textContent = item.quantity;
    updateCart();
}

function findCartitem(itemId){
    return cartItems.find(i => i.id === itemId);
}

function findCartItemIndex(productId) {
    return cartItems.findIndex(item => item.id === productId);
}

async function getProduct(id) {
  const response = await fetch('./products.json');
  const products = await response.json();
  return products.find(p => p.id === id);
}

function reloadPage(){
    location.reload();
}

function removeItemFromCart(productId){
    cartItems.splice(findCartItemIndex(productId), 1);
    document.getElementById("quantity").textContent = findCartitem(productId)?.quantity ?? 0;
    updateCart();
}

function calculateTotal(price, quantity){
    return price * quantity;
}

//dinamically render elements
function renderMainProductImage(index){
    let image = document.getElementById("main-display-image");
    image.src = `images/${product.images[index]}.jpg`;
    image.setAttribute("data-imageindex", index);
}

function renderLightboxMainProductImage(index){
    removeActiveFromLightboxThumnails();
    document.getElementById(`lightbox-thumbnail-${currentLightboxImageIndex}`).classList.add('active');

    document.getElementById("lightbox-main-display-image").src = `images/${product.images[index]}.jpg`;
}

function renderProductThumbnails(images){
    let thumbnailsContainer = document.getElementById("products-thumbnails");
    let thumbnailsHtml = "";

    images.forEach((image, index) => {
        thumbnailsHtml += `
        <div class="product-image thumbnail ${index === 0 ? 'active' : ''}" onclick="displayThumbnail(this, '${index}')">
            <img src="images/${image}-thumbnail.jpg" alt="">
        </div>       
        `;
    });

    thumbnailsContainer.innerHTML = thumbnailsHtml;
}

function renderLightboxProductThumbnails(images){
    let  = document.getElementById("products-thumbnails");
    let lightboxThumbnailsContainer = document.getElementById("lightbox-products-thumbnails");
    let thumbnailsHtml = "";

    images.forEach((image, index) => {
        thumbnailsHtml += `
        <div class="product-image thumbnail ${index === 0 ? 'active' : ''}" onclick="displayLightboxThumbnail(this, '${index}')"
         id="lightbox-thumbnail-${index}">
            <img src="images/${image}-thumbnail.jpg" alt="">
        </div>       
        `;
    });

    lightboxThumbnailsContainer.innerHTML = thumbnailsHtml;
}

function displayThumbnail(thumbnailEl, index){
    removeActiveFromThumnails();

    thumbnailEl.classList.add('active');
    renderMainProductImage(index);
}
function displayLightboxThumbnail(thumbnailEl, index){
    currentLightboxImageIndex = index;
    renderLightboxMainProductImage(index);
}

function removeActiveFromThumnails(){
    document.querySelectorAll(".thumbnail").forEach(thumb => {
        thumb.classList.remove("active");
    });
}
function removeActiveFromLightboxThumnails(){
    document.querySelectorAll(".lightbox .thumbnail").forEach(thumb => {
        thumb.classList.remove("active");
    });
}

function updateCart(){
    cartContentContainer = document.getElementById("cart-content");
    cartBadge = document.getElementById("cart-badge");

    if(cartItems.length > 0){
        cartBadge.classList.remove("hidden");

        document.getElementById("cart-empty").classList.add('hidden');
        cartContentContainer.classList.remove('hidden');
        cartContentHtml = "";

        cartTotalItems = 0;
        cartItems.forEach(item => {            
            cartContentHtml += `${renderCartItem(item.id)}`;
            cartTotalItems += item.quantity;
        });
        cartBadge.textContent = cartTotalItems;

        document.getElementById("cart-items").innerHTML = cartContentHtml;
    } else {
        document.getElementById("cart-empty").classList.remove('hidden');
        cartContentContainer.classList.add('hidden');
        cartBadge.classList.add("hidden");
        cartBadge.textContent = "";

    }
}

function renderCartItem(productId){
    return `
        <div class="cart-item" id="cart-item-${productId}">
        <div class="product-image thumbnail">
        <img src="images/${findCartitem(productId).images[0]}-thumbnail.jpg" alt="product-thumbnail">
        </div>
        <div class="cart-item_product-details">
            <p class="cart-item_product-title">${findCartitem(productId).title}</p>
            <p>
            <span id="price">$${calculateRealProductPrice(findCartitem(productId))}</span>
            x
            <span id="cart-item-quantity-productid-${productId}">${findCartitem(productId).quantity}</span>
            <span class="bold dark-color" id="total-price">$${calculateTotal(
                calculateRealProductPrice(findCartitem(productId)),
                findCartitem(productId).quantity
            )}</span>
            </p>
        </div>
        <div>
        <img src="images/icon-delete.svg" alt="delete-icon"
            onclick="removeItemFromCart('${productId}')">
        </div>
    </div>`;
}
