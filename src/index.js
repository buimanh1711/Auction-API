const express = require('express')
const app = express()
const http = require('http').Server(app)
const PORT = 3999
const db = require('./db')
const middleware = require('./middleware')
const route = require('./routes')
const errHandle = require('./middleware/errHandle')

const createAuct = require('./api/Product/createAuct')


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
                    if(resData) {
                        io.emit('receive auction', { price: data.price, user: data.user, currentList: data.playingList })
                    }
                })
                .catch(err => {
                    console.log('co loi')
                })
        }
    })

    socket.on('disconnected', () => {
        console.log('An user had left!!!')
    })
})

http.listen(PORT, () => {
    console.log(`this app is listen to ${PORT} port!`)
})