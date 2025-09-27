/**
 * AI Career Guidance Chat - Gemini-like Interface
 */

class CareerChatWidget {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.isLoading = false;
        
        this.initializeElements();
        this.attachEventListeners();
        this.showWelcomeScreen();
    }

    initializeElements() {
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.resetButton = document.getElementById('reset-chat');
        this.typingIndicator = document.getElementById('typing-indicator');
        this.quickButtons = document.querySelectorAll('.quick-btn');
    }

    attachEventListeners() {
        // Send message
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key to send
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Input change handler
        this.chatInput.addEventListener('input', () => this.handleInputChange());

        // Reset chat
        this.resetButton.addEventListener('click', () => this.resetChat());

        // Quick action buttons
        this.quickButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const prompt = btn.getAttribute('data-prompt');
                this.startChatWithPrompt(prompt);
            });
        });
    }

    generateSessionId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    showWelcomeScreen() {
        this.welcomeScreen.style.display = 'flex';
        this.chatMessages.style.display = 'none';
    }

    hidewelcomeScreen() {
        this.welcomeScreen.style.display = 'none';
        this.chatMessages.style.display = 'block';
    }

    startChatWithPrompt(prompt) {
        this.hidewelcomeScreen();
        this.chatInput.value = prompt;
        this.sendMessage();
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        
        if (!message || this.isLoading) {
            return;
        }

        // Hide welcome screen if visible
        if (this.welcomeScreen.style.display !== 'none') {
            this.hidewelcomeScreen();
        }

        // Add user message
        this.addMessage(message, 'user');
        this.chatInput.value = '';
        this.setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: this.sessionId
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.addMessage(data.message, 'bot');
            } else {
                this.addMessage(data.message || 'Sorry, something went wrong. Please try again.', 'bot');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            this.addMessage('Sorry, I\'m having trouble connecting. Please check your internet connection and try again.', 'bot');
        } finally {
            this.setLoading(false);
        }
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        avatarDiv.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textP = document.createElement('p');
        textP.innerHTML = this.formatMessage(text);
        
        contentDiv.appendChild(textP);
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(text) {
        // Basic markdown-like formatting
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.sendButton.disabled = loading;
        this.chatInput.disabled = loading;
        
        if (loading) {
            this.typingIndicator.style.display = 'block';
        } else {
            this.typingIndicator.style.display = 'none';
            this.chatInput.focus();
        }
    }

    handleInputChange() {
        const hasText = this.chatInput.value.trim().length > 0;
        this.sendButton.disabled = !hasText || this.isLoading;
    }

    resetChat() {
        this.chatMessages.innerHTML = '';
        this.showWelcomeScreen();
        this.sessionId = this.generateSessionId();
        this.chatInput.value = '';
        this.setLoading(false);
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if API is available
    fetch('/api/chat/health')
        .then(response => response.json())
        .then(data => {
            if (data.geminiConfigured) {
                new CareerChatWidget();
            } else {
                // Show error state
                document.querySelector('.welcome-content h2').textContent = 'Service Unavailable';
                document.querySelector('.welcome-content p').textContent = 'AI service is currently unavailable. Please try again later.';
                document.querySelector('.quick-actions').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error checking API health:', error);
            // Show connection error
            document.querySelector('.welcome-content h2').textContent = 'Connection Error';
            document.querySelector('.welcome-content p').textContent = 'Unable to connect to the service. Please check your connection and refresh the page.';
            document.querySelector('.quick-actions').style.display = 'none';
        });
});