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
const notify2 = require('./api/Account/notify2')
const getProduct = require('./api/Product/getProduct')
const ProductModel = require('./models/product')

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

const check = () => {
    setTimeout(() => {
        ProductModel.find({})
            .then(resData => {
                if (resData && resData.length > 0) {
                    resData.forEach(item => {
                        const future = new Date(item.time)
                        const now = new Date()
                        var count = (future - now) / 1000
                        count = parseInt(count)

                        if (count <= 0 && item.playingList.length > 0) {
                            getProduct(item.playingList[0]._id, item.playingList[0], item.playingList[0].price, item.seller)
                                .then(res => {
                                    if (res) {
                                        const notif = `Sản phẩm ${item.name} của bạn đã được bán. Hãy liên lạc với người mua để giao dịch.`
                                        notify(notif)
                                            .then(res => {
                                                if (res) {
                                                    io.emit('get product notify', { name: item.name, sellerId: item.seller, userInfo: item.playingList[0], price: item.playingList[0].price })
                                                } else {
                                                    io.emit('get product notify', { name: item.name, userInfo: item.playingList[0], sellerId: item.seller, price: item.playingList[0].price, err: 'fail' })
                                                }
                                            })

                                        const notif2 = `Bạn đã mua sản phẩm ${item.name} thành công với giá ${item.playingList[0].price}, vui lòng đợi người bán liên lạc để giao dịch.`
                                        notify2(notif2, item.playingList[0]._id)
                                            .then(res => {
                                                if (res) {
                                                    io.emit('get product notify2', { name: item.name, sellerId: item.seller, userInfo: item.playingList[0], price: item.playingList[0].price, notif: notif2 })
                                                } else {
                                                    io.emit('get product notify2', { name: item.name, userInfo: item.playingList[0], sellerId: item.seller, price: item.playingList[0].price, err: 'fail' })
                                                }
                                            })
                                    }
                                    check()
                                })
                        }
                    })
                }
            })

    }, 1000 * 20)
}

check()

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

                    const notif2 = `Bạn đã mua sản phẩm ${name} thành công với giá ${price}, vui lòng đợi người bán liên lạc để giao dịch.`
                    notify2(notif2, userInfo.id)
                        .then(res => {
                            if (res) {
                                io.emit('get product notify2', { name, sellerId, userInfo, price, newProduct: product, notif: notif2 })
                            } else {
                                io.emit('get product notify2', { name, userInfo, sellerId, price, newProduct: product, err: 'fail' })
                            }
                        })
                }
            })
    })

    socket.on('user create product', data => {
        io.emit('user send product', { data })
    })

    socket.on('disconnected', () => {
        console.log('An user had left!!!')
    })
})

http.listen(PORT, () => {
    console.log(`this app is listen to ${PORT} port!`)
})