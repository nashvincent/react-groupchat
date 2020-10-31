const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const socketIo = require('socket.io')(server)

const PORT = 8000
let users = []
const messages = {
  room1: [],
  room2: [],
  room3: [],
}

socketIo.on('connection', socket => {
  socket.on('join server', username => {
    // [!] Change when fetching users from db
    const user = {
      username,
      id: socket.id,
    }
    users.push(user)
    socketIo.emit('new user', users)
  })

  socket.on('join room', (roomName, callback) => {
    socket.join(roomName)
    callback(messages[roomName])
  })

  socket.on('send message', ({ content, to, sender, chatName }) => {
    const payload = {
      content,
      chatName,
      sender,
    }
    socket.to(to).emit('new message', payload)

    if (messages[chatName]) {
      messages[chatName].push({ sender, content })
    }
  })

  socket.on('disconnect', () => {
    users = users.filter(usr => usr.id !== socket.id)
    socketIo.emit('new user', users)
  })
})

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
