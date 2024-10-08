const io = require('socket.io')(3000,{
    cors: {

        origin: "http://127.0.0.1:5500",

      },
})
const users = {}

io.on("connection", socket => {
    socket.emit("user-list", users);
    socket.on("new-user", name =>{
        users[socket.id] = name
        socket.broadcast.emit("user-connected", name)
    })

    socket.on("send-chat-message", message =>{
        socket.broadcast.emit("chat-message", { message: message, name: users[socket.id] })
    })
    socket.on("send-player-guess", guess =>{
        socket.broadcast.emit("player-guess", {guess: guess, name: users[socket.id]})
        
    })
    socket.on("disconnect", () =>{
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
    })
})
