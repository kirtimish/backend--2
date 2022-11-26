
const cartContainer = document.getElementById('cartContainer');
const pagination = document.getElementById('pagination');

closeCart.addEventListener('click', () => {
    cartContainer.classList.remove("active");
    document.body.style.backgroundColor = 'aliceblue';
});

document.addEventListener('click', (e) => {
    if(e.target.className == 'cartBtn'){
        cartContainer.classList.add("active");
        document.body.style.backgroundColor = 'aliceblue';
        getCart();
    }
    if(e.target.className == 'purchase-btn'){
        axios.post('http://18.182.52.34:3000/createOrder')
        .then(res => {
            // console.log(res)
        })
        .catch(err => { console.log(err) })
        cartToastNotification('Order placed successfully')
    }
})

window.addEventListener('DOMContentLoaded', () => {
    const page = 1;
    axios.get(`http://18.182.52.34:3000/products?page=${page}`)
    .then((res) => {
        console.log(res);
        showproductsonScreen(res.data.products);
        addPagination(res.data);
    }).catch(err => console.log(err));

    function addPagination({ currentPage, hasNextPage,hasPrevPage,lastPage,nextPage,prevPage,products}) {
        pagination.innerHTML = '';
        if(hasPrevPage){
            const btn2 = document.createElement('button');
            btn2.innerHTML = prevPage;
            pagination.appendChild(btn2);
            btn2.addEventListener('click', () => { getProducts(prevPage) });
        }
        const btn1 = document.createElement('button');
        btn1.innerHTML = `<h4>${currentPage}</h4>`;
        pagination.appendChild(btn1);
        btn1.addEventListener('click', () => { getProducts(currentPage)});
    
        if(hasNextPage){
            const btn3 = document.createElement('button');
            btn3.innerHTML = nextPage;
            pagination.appendChild(btn3);
            btn3.addEventListener('click', () => { getProducts(nextPage) });
        }
    }

    function getProducts(page) {
        axios.get(`http://18.182.52.34:3000/products?page=${page}`)
        .then((res) => {
            console.log(res);
            showproductsonScreen(res.data.products);
            addPagination(res.data);
        })
        .catch(err => console.log(err));
    }
})

function showproductsonScreen(Products){
    const parentDiv = document.getElementsByClassName('cards')[0];
    parentDiv.innerHTML='';
    Products.forEach(product => {
        const productDiv = document.createElement('div'); 
        productDiv.classList.add("card");
        productDiv.innerHTML = `<h2 class="prod_name">${product.title}</h2>
            <img class="prod_img" src="${product.imageUrl}" alt="">
            <h3 class="prod_price" class="price">$${product.price}</h3>
            <button onClick=addtoCartBtn("${product.id}") class="addtoCart">Add to Cart</button>`
        parentDiv.appendChild(productDiv);
    });
}


function addtoCartBtn(productId) {
 axios.post('http://18.182.52.34:3000/cart',{productId: productId})
 .then((res) => {
    console.log(res.data.products.price)
    cartToastNotification('Added to cart successfully');
    document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText) + 1
 })
 .catch(err => {
    console.log(err);
 })
}

function getCart() {
    axios.get('http://18.182.52.34:3000/cart')
    .then(res => {
        if (res.status === 200) {
            getCartItems(res.data.products);
        } 

    }).catch(err => { console.log(err) });
}

function getCartItems(product) {
    const parentDiv = document.getElementsByClassName('cart-items')[0];
    parentDiv.innerHTML='';
    product.forEach(product => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add("cart-item"); 
        cartItemDiv.innerHTML = `<img id="prod_img" src="${product.imageUrl}" alt="">
    <h2 id="prod_name">${product.title}</h2>
    <h3 class="cart-price" class="price">$${product.price}</h3>
    <input type="text" class="cart-quantity-input" name="quantity" id="quantity" value=${product.cartItem.quantity}>
    <button onclick=deleteCartItem("${product.id}") class="removefromCart">Remove</button>`
        parentDiv.appendChild(cartItemDiv);
    })
}

function cartToastNotification(msg) {
    const container = document.getElementById('container');
    const notify = document.createElement('div');
    notify.classList.add("toast");
    notify.innerText = msg;
    container.appendChild(notify);
    setTimeout(()=> {
        notify.remove();
    },3000)
}

function deleteCartItem(productId) {
    axios.post('http://18.182.52.34:3000/cart-delete-item', {productId: productId})
    .then(res => {
        removeCartItemBtn();
        document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText) - 1
    })
    .catch(err => { console.log(err) })
}

function removeCartItemBtn() {
    var removeFromcartBtn = document.getElementsByClassName('removefromCart');
    for(var i=0;i<removeFromcartBtn.length;i++){
        var button = removeFromcartBtn[i];
        button.addEventListener('click',(e) => {
            const removingitemTarget = e.target;
            removingitemTarget.parentElement.remove();
            // updateCartTotal();
        })
    }
}

// function updateCartTotal(){
//     var cartItemsContainer = document.getElementsByClassName('cart-items');
//     var  total = 0;
//     for(var i=0;i<cartItemsContainer.length;i++){
//         var cartRow = cartItemsContainer[i];
//         // console.log(cartRow);
//         var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
//         var priceElement = cartRow.getElementsByClassName('cart-price')[0];
//         var price = parseFloat(priceElement.innerText.replace('$',''));
//         var quantity = quantityElement.value;
//         // console.log(price,quantity);
//         total = total + (price * quantity);
//     }
//     document.getElementsByClassName('cart-total-price')[0].innerText = `$` + total;
// }
