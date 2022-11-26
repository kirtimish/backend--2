window.addEventListener("DOMContentLoaded", () => {
    axios.get('http://18.182.52.34:3000/orders')
    .then(res => {
        console.log(res.data);
        const products = res.data.products;
        const OrderDiv = document.getElementById('ordered-items');
        for(let i=0;i<products.length;i++){
            for(let j=0;j<products[i].products.length;j++){
                const childHTML = `<div class="order-item">
                <img id="prod_img" src="${products[i].products[j].imageUrl}" alt="">
                <h2 id="prod_name">Product Name : ${products[i].products[j].title}</h2>
                <h3 class="cart-price" class="price">Product Price : $${products[i].products[j].price}</h3>
                <p class="prod_desc">Description : ${products[i].products[j].description}</p>           
                </div>`
            OrderDiv.innerHTML += childHTML; 
            }
        }
    })
    .catch(err => { console.log(err) })
})