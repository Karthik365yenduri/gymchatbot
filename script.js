document.addEventListener("DOMContentLoaded", function () {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    function sendMessage() {
        const message = userInput.value.trim();
        if (message === "") return;

        appendMessage("user-message", message);
        userInput.value = "";

        fetch("http://localhost:4000/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            appendMessage("bot-message", data.reply);
        })
        .catch(error => {
            console.error("Error:", error);
            appendMessage("bot-message", "⚠️ Could not connect to the server.");
        });
    }

    function appendMessage(className, message) {
        const p = document.createElement("p");
        p.classList.add(className);
        p.textContent = message;
        chatBox.appendChild(p);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function handleKeyPress(event) {
        if (event.key === "Enter") sendMessage();
    }

    userInput.addEventListener("keypress", handleKeyPress);
    sendButton.addEventListener("click", sendMessage);
});
