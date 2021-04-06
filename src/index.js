const express = require('express')
const app = express()
const http = require('http').Server(app)
const PORT = 3999
const db = require('./db')
const middleware = require('./middleware')
const route = require('./routes')
const errHandle = require('./middleware/errHandle')
const auct = require('./api/Product/auct')

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
    socket.on('sendMessage', data => {
        console.log(socket.id)
        socket.emit('receiveMessage', data) 
    })
})

http.listen(PORT, () => {
    console.log(`this app is listen to ${PORT} port!`)
})