const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const hbsEngine = require('./config/handlebars')
const app = express()
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')
const Product = require('./models/product')
const sequelize = require('./util/database')

app.engine('handlebars', hbsEngine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({
    extended: false
}))


const errorPage = require('./controllers/error')

app.use(express.static(path.join(__dirname, "public")))
app.use((req,res,next) => {
    User.findByPk(1).then(user => {
        req.user = user
        next()
    }).catch(error => console.log(error))
})


app.use('/admin', adminRoutes)
app.use(shopRoutes)

//catch 404
app.use(errorPage.get404)


//define relationships on models
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
})

User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product,{through : CartItem})
Product.belongsToMany(Cart,{through : CartItem})
Order.belongsTo(User)
User.hasMany(Order)
Order.belongsToMany(Product,{through: OrderItem})

sequelize
    /*.sync({
        force: true
    })*/
    .sync()
    .then(() => {
        return User.findByPk(1)
    })
    .then(user => {
        if (!user) {
            //seed db
            return User.create({
                name: "Justice",
                email: "justicea83@gmail.com"
            })
        }
        return user

    })
    .then((user) => {
        return user.createCart()

    })
    .then(() => {
        app.listen(3000, () => {
            console.log('app listening on port 3000...')
        })
    })

    .catch(error => {
        console.log(error)
    })





