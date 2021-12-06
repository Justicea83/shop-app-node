const Product = require('../models/product')

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        title: 'Add Product',
        path: '/admin/add-product',
    })
}

exports.postAddProduct = (req, res) => {
    const {title, imageUrl, price, description} = req.body
    console.log(req.body)
    req.user.createProduct({
        title: title,
        price: price,
        imageUrl: imageUrl,
        description: description,
    }).then(() => {
        res.redirect('/')
    }).catch(error => {
        //console.log(error)
    })
}

exports.getEditProduct = (req, res) => {
    //req.user.getProducts({where: {id: req.params.productId}})
    Product.findByPk(req.params.productId)
        .then(product => {
        if (!product) return res.redirect('/')

        res.render('admin/edit-product', {
            title: 'Edit Product',
            path: '/admin/add-product',
            editing: true,
            product
        })
    })

}

exports.getProducts = (req, res) => {
    req.user.getProducts().then(products => {
        res.render('admin/products', {
            products,
            title: 'Admin Products',
            path: '/admin/products',
            hasProducts: products.length > 0,
        })
    })

}

exports.postEdit = (req, res) => {
    const {productId, title, imageUrl, price, description} = req.body
    Product.findByPk(productId).then(product => {
        product.title = title
        product.price = price
        product.imageUrl = imageUrl
        product.description = description
        return product.save()
    }).then(() => {
        res.redirect('/admin/products')
    })
}

exports.postDeleteProduct = (req, res) => {
    const {productId} = req.body
    Product.findByPk(productId).then(product => {
        return product.destroy()

    }).then(() => res.redirect('/admin/products'))
        .catch(error => {
            res.redirect('/admin/products')
            console.log(error)
        })
}