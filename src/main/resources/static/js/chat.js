const connectButton = document.getElementById("connect-button");
const sendButton = document.getElementById("publish-button");

let username = null;
let socket = null;

let users = [];

connectButton.addEventListener("click", function () {
    username = document.getElementById("username").value.trim();
    if (socket) {
        let connection = confirm("연결을 끊겠습니까?");
        if (connection && socket) {
            socket.close();
            socket = null;
        }
        return;
    }
    if (username) {
        socket = new WebSocket("ws://localhost:8080/topic");

        socket.onopen = () => {
            socket.send(JSON.stringify({sender: username, type: 'JOIN'}));
        };

        socket.onmessage = (event) => onMessageReceived(event.data);

        socket.onclose = (event) => {
            username = null;
            if (event.wasClean) {
                console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                alert('[close] Connection died');
            }
        };

        socket.onerror =  (error) => {
            console.error(`[error] ${error.message}`);
        };
    } else {
        alert("유저명을 입력해주세요.");
    }
});

sendButton.addEventListener("click", function () {
    let text = document.getElementById("text");

    if (text) {
        const chatMessage = {
            sender: username,
            content: text.value.trim(),
            type: 'CHAT'
        };

        socket.send(JSON.stringify(chatMessage));
        text.value = '';
    }
});

function onMessageReceived (payload) {
    let message = JSON.parse(payload);
    let sender = message.sender;
    let content = message.content;
    let type = message.type.toUpperCase();

    if (type === "CHAT") {
        let chatArea = document.getElementById("chat-area");
        let chatRowHTML = "";

        if (sender === username) {
            chatRowHTML =
                "       <div class=\"d-flex text-muted pt-3\">\n" +
                "            <div class=\"border-bottom w-100\">\n" +
                "                <div class=\"d-flex justify-content-between\">\n" +
                "                    <div>\n" +
                                        content +
                "                    </div>\n" +
                "                    <div class=\"text-gray-dark\">" + sender + "</div>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "            <svg class=\"bd-placeholder-img flex-shrink-0 ms-2 rounded\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Placeholder: 32x32\" preserveAspectRatio=\"xMidYMid slice\" focusable=\"false\"><title>Placeholder</title><rect width=\"100%\" height=\"100%\" fill=\"#007bff\"></rect><text x=\"50%\" y=\"50%\" fill=\"#007bff\" dy=\".3em\">32x32</text></svg>\n" +
                "        </div>";
        } else {
            let sendUser = null;
            for (let i = 0; i < users.length; i++) {
                let user = users[i];
                if (sender === user.username) {
                    sendUser = user;
                    break;
                }
            }

            if (sendUser === null) {
                sendUser = {
                    username: sender,
                    color: getColor()
                }
                users.push(sendUser);
            }

            chatRowHTML =
                "       <div class=\"d-flex text-muted pt-3\">\n" +
                "            <svg class=\"bd-placeholder-img flex-shrink-0 me-2 rounded\" width=\"32\" height=\"32\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-label=\"Placeholder: 32x32\" preserveAspectRatio=\"xMidYMid slice\" focusable=\"false\"><title>Placeholder</title><rect width=\"100%\" height=\"100%\" fill=\"" + sendUser.color + "\"></rect><text x=\"50%\" y=\"50%\" fill=\"" + sendUser.color + "\" dy=\".3em\">32x32</text></svg>\n" +
                "            <div class=\"border-bottom w-100\">\n" +
                "                <div class=\"d-flex justify-content-between\">\n" +
                "                    <div class=\"text-gray-dark\">" + sender + "</div>\n" +
                "                    <div>\n" +
                                        content +
                "                    </div>\n" +
                "                </div>\n" +
                "            </div>\n" +
                "        </div>";
        }

        chatArea.innerHTML += chatRowHTML;
    } else if (type === "JOIN") {

    }
}

function getColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

