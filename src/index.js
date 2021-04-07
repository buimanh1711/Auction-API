const express = require('express')
const app = express()
const http = require('http').Server(app)
const PORT = 3999
const db = require('./db')
const middleware = require('./middleware')
const route = require('./routes')
const errHandle = require('./middleware/errHandle')
const createAuct = require('./api/Product/createAuct')
const notify = require('./api/Account/notify')
const getProduct = require('./api/Product/getProduct')

const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000',
    }
})

middleware(app)
route(app)
app.use(errHandle)
db.connect()

app.get('/', (req, res) => {
    res.send('hello')
})

io.on('connection', (socket) => {
    console.log('An user has connect!!!', socket.id)

    socket.on('create auction', (data) => {
        if (data) {
            createAuct(data)
                .then(resData => {
                    if (resData) {
                        io.emit('receive auction', { price: data.price, user: data.user, currentList: data.playingList })
                    }
                })
                .catch(err => {
                    console.log('co loi')
                })
        }
    })

    socket.on('pass product', (data) => {
        const { sellerId, name } = data
        const notif = `Sản phẩm ${name} của bạn đã được quản trị viên duyệt.`
        notify(notif, sellerId)
            .then(res => {
                if (res) {
                    io.emit('pass product notify', { name, sellerId })
                } else {
                    io.emit('pass product notify', { name, sellerId, err: 'fail' })
                }
            })
    })

    socket.on('get product', data => {
        const productId = data.product._id
        const price = data.product.quickPrice
        const name = data.product.name
        const sellerId = data.product.seller._id
        const userInfo = data.userInfo
        const product = data.product

        getProduct(productId, userInfo, price, sellerId)
            .then(res => {
                if (res) {
                    const notif = `Sản phẩm ${name} của bạn đã được bán. Hãy liên lạc với người mua để giao dịch.`
                    notify(notif, sellerId)
                        .then(res => {
                            if (res) {
                                io.emit('get product notify', { name, sellerId, userInfo, price, newProduct: product })
                            } else {
                                io.emit('get product notify', { name, userInfo, sellerId, price, newProduct: product, err: 'fail' })
                            }
                        })
                }
            })
    })

    socket.on('disconnected', () => {
        console.log('An user had left!!!')
    })
})

http.listen(PORT, () => {
    console.log(`this app is listen to ${PORT} port!`)
})