const exphbs = require('express-handlebars'),
    {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access'),
    _handlebars = require('handlebars')

const hbs = exphbs.create({
    helpers: {
        isActive: function (value, url) {
            return url === value
        },
        getDetailsUrl: function (id) {
            return `/products/${id}`
        },
        concat: function () {
            const args = [...arguments].slice(0, -1);
            return `${args.join('')}?edit=true`;
        },
        hasProducts: function (products) {
            return products.length > 0
        },
        isNotEmpty: function (data) {
            return data.length > 0
        }
    },
    handlebars: allowInsecurePrototypeAccess(_handlebars)

})

module.exports = hbs.engine