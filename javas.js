const socket = io('http://localhost:3000') 
const nickname = prompt("Enter your nickname")
appendMessage('you joined', "joined")
players = document.getElementById("players")
socket.emit("new-user", nickname)

///*Socket *///
socket.on('chat-message', data => {
    appendMessage(data.name + ":" + " " + data.message, "message")

})
socket.on('player-guess', data => {
    console.log(data.guess)
    console.log(data.name)
    appendGuess(data.guess, data.name)
})
socket.on('user-connected', name => {
    appendMessage( name + ' connected', "connected")
    newPlayer(name)
})
socket.on('user-disconnected', name => {
    appendMessage( name + ' disconnected', "disconnected")
    
})
socket.on("user-list", (users) => {
    Object.entries(users).forEach(([id, name]) => {
        newPlayer(name); 
    });
    newPlayer(nickname)
});

///*Web stuff *///
/*players */
/*guess */
function appendGuess(message, nick) {
    const playerDiv = document.querySelector(`.player[data-username="${nick}"]`);
    const playerGuess = playerDiv.querySelector(`.guess`)
    playerGuess.textContent = message

}
document.getElementById("answer").addEventListener("keydown", function (event) {
    if (event.key == "Enter") {
        const message = document.getElementById("answer").value;
        if (message.trim() !== "") {
            socket.emit("send-player-guess", message)
            appendGuess(message, nickname); // Вызов функции appendGuess
            const textarea = document.getElementById("answer");
            textarea.value = ""; // Очистка поля ввода
        }       
    }
});

function newPlayer(nick) {
    const playerDiv = document.createElement('div')
    playerDiv.innerHTML = `<img src="pfp.png" alt="monkey">
    <div class="score">0</div>
    <div class="text">
    <div class="nickname">`+ nick+ `</div>    
    <div class="guess"></div>    
    <div class="time"> </div>`
    playerDiv.classList.add("player")
    playerDiv.setAttribute('data-username', nick)
    players.appendChild(playerDiv)
}
/* Chat*/
document.getElementById('sideBandera').addEventListener('click', function() {
    var chat = document.getElementById('chat');
    var flippable = document.getElementById('svg');
    if (chat.style.display === 'none' || chat.style.display === '') {
        chat.classList.toggle('chatAnim1');
        chat.classList.toggle('chatAnim2');
        flippable.classList.toggle('flippedSg');
    } else {
        flippable.classList.toggle('flippedSg')
        chat.classList.toggle('chatAnim1');
        chat.classList.toggle('chatAnim2');
    }
});

document.getElementById("messageInput").addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.key === "Enter") {
        event.preventDefault();  // предотвращает стандартное поведение Ctrl + Enter
        sendMessage();  // вызывает функцию отправки сообщения
    } else if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();  // предотвращает добавление новой строки при Enter без Shift
        sendMessage();  // вызывает функцию отправки сообщения
    }
});

function sendMessage() {
    const message = document.getElementById("messageInput").value;
    if (message.trim() !== "") {
        var textarea = document.getElementById("messageInput");
        socket.emit("send-chat-message", message)
        textarea.value = "";       
        appendMessage("You: " +  message, "yourMessage")
        const div = document.getElementById("messageContainer");
        div.scrollTop = div.scrollHeight
        
    }
}
function appendMessage(message, messageClass) {
    const messageElement = document.createElement("div")
    messageElement.innerText = message.trim()
    messageElement.classList.add(messageClass)
    messageContainer.append(messageElement)
}


/*npm run devStart*/








