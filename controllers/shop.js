const Product = require('../models/product');
const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');
const ItemsperPage = 2;

exports.getProducts = (req, res, next) => {
  const page = +req.query.page;
  let totalItems;
  Product.count()
  .then(total => {
    totalItems = total;
    return Product.findAll({
        offset: (page-1) * ItemsperPage,
        limit: ItemsperPage,  
      })
  })
  .then((products) =>{
    res.json({
      products:products,
      currentPage : page,
      hasNextPage : ItemsperPage * page < totalItems,
      nextPage : page+1,
      hasPrevPage : page > 1,
      prevPage : page - 1, 
      lastPage : Math.ceil(totalItems / ItemsperPage)
    });
    // res.render('shop/product-list', {
    //   prods: products,
    //   pageTitle: 'All Products',
    //   path: '/products'
    // });
  })
  .catch(err => {console.log(err)})
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findAll({where : {id:prodId}})
  .then(products => {
    res.render('shop/product-detail', {
      product: products[0],
      pageTitle: products[0].title,
      path: '/products'
    });
  })
  .catch(err => console.log(err));
  // Product.findByPk(prodId)
  //   .then(product => {
  //     res.render('shop/product-detail', {
  //       product: product,
  //       pageTitle: product.title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  Product.findAll()
  .then((products) =>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  })
  .catch(err => {console.log(err)})
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
  .then(cart => {
    return cart
    .getProducts()
    .then(products => {
      res.status(200).json({ success: true, products: products})
      // res.render('shop/cart', {
      //   path: '/cart',
      //   pageTitle: 'Your Cart',
      //   products: products
      // });
    })
    .catch(err => console.log(err))
  })
  .catch(err => console.log(err));
};
 
exports.postCart = (req, res, next) => {
  if(!req.body.productId){
    res.status(400).json({success: false, errMsg:'Product id is missing'})
  }
  const prodId = req.body.productId;
  let fetchCart;
  let newQuantity = 1;
  req.user.getCart()
  .then(cart => {
    fetchCart = cart;
    return cart.getProducts({ where : { id: prodId}})
  })
  .then(products => {
    let product;
    if(products.length > 0){
      product = products[0];
    }
    if(product){
      const oldQty = product.cartItem.quantity;
      newQuantity = oldQty + 1;
      return product;
    }
    return Product.findByPk(prodId)
    
  })
  .then(product => {
    return fetchCart.addProduct(product, {
      through : { quantity: newQuantity }
    })
  })
  .then(() => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err))
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.getCart()
  .then(cart => {
    return cart.getProducts({ where : { id : prodId} })
  })
  .then(products => {
    if(products){
      const product = products[0];
      return product.cartItem.destroy();
    }
  })
  .then(result => {
    res.redirect('/cart');
  })
  .catch(err => console.log(err))
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.postOrder = async (req,res,next) => {
  let order = await req.user.createOrder();
  let OrderCreated = [];
  req.user.getCart()
  .then(cart=>{
      console.log(cart)
      cart.getProducts()
      .then(async(products)=>{
          console.log(products)
          for(let i=0;i<products.length;i++) {
              // console.log('prodycts',products[i])
             let orderItems = await order.addProduct(products[i] , { 
                  through : {quantity : products[i].cartItem.quantity} })
                  OrderCreated.push(orderItems)
                      console.log(OrderCreated)
                 }
                 CartItem.destroy({where:{cartId : cart.id}})
                 .then(response=>console.log(response))
                 res.status(200).json({ success : true,data: OrderCreated})
               })
      .catch( err => { console.log(err) })
  })
  .catch(err =>{
       console.log(err)
  })
}

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
