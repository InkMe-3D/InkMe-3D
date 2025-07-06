document.addEventListener("DOMContentLoaded", function () {
    const chatButton = document.getElementById("chat-button");
    const chatPopup = document.getElementById("chat-popup");
    const closeChat = document.getElementById("close-chat");
    const sendButton = document.getElementById("send-message");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.querySelector(".chat-messages");
    const uploadImageButton = document.getElementById(
        "upload-image-button"
    );
    const imageUpload = document.getElementById("image-upload");
    const previewContainer = document.getElementById("preview-container");

    const API_URL = "https://inkme-3d-server-production.up.railway.app/api/ai/chat";
    let threadId = localStorage.getItem("threadId");

    let selectedImages = [];

    // Toggle chat popup
    chatButton.addEventListener("click", () => {
        chatPopup.style.display =
            chatPopup.style.display === "flex" ? "none" : "flex";
    });

    // Close chat popup
    closeChat.addEventListener("click", () => {
        chatPopup.style.display = "none";
        // Clear selected images when closing chat
        selectedImages = [];
        previewContainer.style.display = "none";
        previewContainer.innerHTML = "";
    });

    // Handle image upload button click
    uploadImageButton.addEventListener("click", () => {
        imageUpload.click();
    });

    // Handle image selection
    imageUpload.addEventListener("change", (e) => {
        const files = Array.from(e.target.files);

        files.forEach((file) => {
            if (file.type.startsWith("image/")) {
                const reader = new FileReader();

                reader.onload = (e) => {
                    selectedImages.push({
                        file: file,
                        preview: e.target.result,
                    });

                    updateImagePreviews();
                };

                reader.readAsDataURL(file);
            }
        });
    });

    // Update image previews
    function updateImagePreviews() {
        previewContainer.innerHTML = "";

        selectedImages.forEach((image, index) => {
            const preview = document.createElement("div");
            preview.className = "image-preview";

            const img = document.createElement("img");
            img.src = image.preview;

            const removeButton = document.createElement("button");
            removeButton.className = "remove-image";
            removeButton.innerHTML = "×";
            removeButton.onclick = () => {
                selectedImages.splice(index, 1);
                updateImagePreviews();
            };

            preview.appendChild(img);
            preview.appendChild(removeButton);
            previewContainer.appendChild(preview);
        });

        previewContainer.style.display =
            selectedImages.length > 0 ? "flex" : "none";
    }

    // Send message
    async function sendMessage() {
        const message = chatInput.value.trim();
        if (!message && selectedImages.length === 0) return;

        addMessage(message, "sent", selectedImages.map(img => img.preview));
        chatInput.value = "";

        const imagesPayload = selectedImages.map(i => ({
            name: i.file.name,
            dataUrl: i.preview
        }));
        selectedImages = [];
        updateImagePreviews();

        const typingId = "ai-typing";
        addMessage("Đang nhập...", "received", [], typingId);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ thread_id: threadId, message, images: imagesPayload })
            });

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";

            // Xóa "Đang nhập..." sau khi nhận được phản hồi đầu tiên
            let isFirstResponse = true;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split("\n\n");
                buffer = parts.pop();

                for (const p of parts) {
                    if (p.startsWith("event:done")) {
                        const id = p.split(":")[2]?.trim();
                        if (id) {
                            threadId = id;
                            localStorage.setItem("threadId", id);
                        }
                    } else if (p.startsWith("data:")) {
                        const delta = p.slice(5);

                        if (delta) {
                            if (isFirstResponse) {
                                // Xóa tin nhắn "Đang nhập..."
                                const typing = document.querySelector(`[data-id="${typingId}"]`);
                                if (typing) typing.remove();
                                isFirstResponse = false;
                            }

                            appendDelta(delta);
                        }
                    }
                }
            }
        } catch (err) {
            console.error("Lỗi khi gọi API:", err);
            const typing = document.querySelector(`[data-id="${typingId}"]`);
            if (typing) typing.textContent = "Đã xảy ra lỗi khi gọi AI.";
        }
    }

    // Hiển thị delta dần dần
    let currentBotMsg;
    function appendDelta(text) {
        if (!currentBotMsg) {
            currentBotMsg = document.createElement("div");
            currentBotMsg.className = "message received";
            chatMessages.appendChild(currentBotMsg);
        }
        currentBotMsg.textContent += text;
        chatMessages.scrollTop = chatMessages.scrollHeight;
        // Khi kết thúc 1 run, reset
        if (text.endsWith("\n") || text.endsWith(".")) currentBotMsg = null;
    }

    // Add message to chat
    function addMessage(text, type, images = [], id = null) {
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${type}`;
        if (id) messageDiv.dataset.id = id;

        if (text) {
            const textDiv = document.createElement("div");
            if (text === "Đang nhập...") {
                textDiv.className = "typing-indicator";
                textDiv.innerHTML = '<span></span><span></span><span></span>';
            } else {
                textDiv.textContent = text;
            }
            messageDiv.appendChild(textDiv);
        }

        if (images && images.length > 0) {
            images.forEach((imageUrl) => {
                const img = document.createElement("img");
                img.src = imageUrl;
                img.alt = "Uploaded image";
                messageDiv.appendChild(img);
            });
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Send message on button click
    sendButton.addEventListener("click", sendMessage);

    // Send message on Enter key
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Add initial greeting message
    setTimeout(() => {
        addMessage("Xin chào! Tôi có thể giúp gì cho bạn?", "received");
    }, 500);
});