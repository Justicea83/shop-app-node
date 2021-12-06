const Product = require('../models/product')


exports.getProducts = (req, res) => {
    Product.findAll().then(products => {
        res.render('shop/product-list', {
            products,
            title: 'Products',
            path: '/products',
            hasProducts: products.length > 0,
        })
    })
}

exports.getProduct = (req, res) => {
    const {productId} = req.params
    Product.findByPk(productId).then(product => {
        res.render('shop/product-detail', {
            title: product.title,
            path: '/products',
            product
        })
    }).catch(error => {
        res.render('shop/product-detail', {
            title: 'Product Not Found',
            path: '/products',
            product: {}
        })
    })
}

//returns the cart items
exports.getCart = (req, res) => {

    req.user.getCart().then(cart => {
        return cart.getProducts()
    })
        .then(products => {
            console.log(products)
            res.render('shop/cart', {
                title: 'Your Cart',
                path: '/cart',
                products
            })
        })
        .catch(error => console.log(error))

}

//post cart
exports.postCart = (req, res) => {
    const {productId} = req.body
    let fetchedCart
    let newQuantity = 1

    req.user.getCart()
        .then(cart => {
            fetchedCart = cart
            return cart.getProducts({where: {id: productId}})
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0]
            }
            if (product) {
                const oldQty = product.cartItem.quantity
                newQuantity = oldQty + 1
                return product
            }
            return Product.findByPk(productId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: {
                    quantity: newQuantity
                }
            })
        })
        .then(() => res.redirect('/cart'))
        .catch(error => console.log(error))


}

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        title: 'Checkout',
        path: '/checkout',
    })
}

exports.getOrders = (req, res) => {
    req.user.getOrders({include: ['products']}).then(orders => {
        res.render('shop/orders', {
            title: 'Your Orders',
            path: '/orders',
            orders
        })
    }).catch(error => error)

}

exports.getIndex = (req, res) => {
    console.log("reached here")
    Product.findAll().then(products => {
        res.render('shop/index', {
            products,
            title: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
        })
    })

}

exports.postCartDeleteProduct = (req, res) => {
    const {productId} = req.body
    req.user.getCart().then(cart => {
        return cart.getProducts({where: {id: productId}})
    })
        .then(products => {
            const product = products[0]
            return product.destroy()
        })
        .then(() => res.redirect('/cart'))
}

exports.postOrder = (req,res) => {
    let fetchedCart
    req.user.getCart().then(cart => {
        fetchedCart = cart
        return cart.getProducts()
    })
        .then(products => {
            console.log(products)
            return req.user.createOrder()
                .then(order => {
                    order.addProducts(products.map(product => {
                        product.orderItem = {
                            quantity: product.cartItem.quantity
                        }
                        return product;
                    }))
                }).catch(error => error)
        })
        .then(() => {
            return fetchedCart.setProducts(null)
        })
        .then(() => res.redirect('/orders'))
        .catch(error => console.log(error))
}



