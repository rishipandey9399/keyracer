/**
 * AI Career Guidance Chat - Gemini-like Interface
 */

class CareerChatWidget {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.isLoading = false;
        this.profileComplete = false;
        this.agentCapabilities = null;
        
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
        
        // Load AI agent capabilities
        this.loadAgentCapabilities();
    }

    generateSessionId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    showWelcomeScreen() {
        this.welcomeScreen.style.display = 'flex';
        this.chatMessages.style.display = 'none';
    }

    hideWelcomeScreen() {
        this.welcomeScreen.style.display = 'none';
        this.chatMessages.style.display = 'block';
    }

    startChatWithPrompt(prompt) {
        this.hideWelcomeScreen();
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
            this.hideWelcomeScreen();
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
                const isAgentResponse = data.isAgentCommand || data.isComplete;
                this.addMessage(data.message, 'bot', isAgentResponse);
                
                // Update profile completion status
                if (data.isComplete) {
                    this.profileComplete = true;
                }
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

    addMessage(text, sender, isAgentResponse = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        if (isAgentResponse) {
            messageDiv.classList.add('agent-response');
        }
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'message-avatar';
        
        if (sender === 'bot') {
            avatarDiv.innerHTML = isAgentResponse ? 
                '<i class="fas fa-robot" title="AI Agent"></i>' : 
                '<i class="fas fa-robot"></i>';
        } else {
            avatarDiv.innerHTML = '<i class="fas fa-user"></i>';
        }
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const textP = document.createElement('p');
        textP.innerHTML = this.formatMessage(text);
        
        contentDiv.appendChild(textP);
        
        // Add command suggestions for completed profiles
        if (isAgentResponse && this.profileComplete) {
            const suggestionsDiv = this.createCommandSuggestions();
            contentDiv.appendChild(suggestionsDiv);
        }
        
        messageDiv.appendChild(avatarDiv);
        messageDiv.appendChild(contentDiv);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    formatMessage(text) {
        // Enhanced markdown-like formatting for better readability
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^\• (.*$)/gm, '<li>$1</li>')
            .replace(/^- (.*$)/gm, '<li>$1</li>')
            .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
            .replace(/((<li>.*<\/li>\s*)+)/g, '<ul>$1</ul>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/^(.*)$/gm, function(match) {
                if (match.includes('<h') || match.includes('<li>') || match.includes('<ul>') || match.includes('</p>')) {
                    return match;
                }
                return match;
            })
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
        this.profileComplete = false;
        this.setLoading(false);
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
    
    async loadAgentCapabilities() {
        try {
            const response = await fetch('/api/chat/capabilities');
            const data = await response.json();
            
            if (data.success) {
                this.agentCapabilities = data;
                console.log('AI Agent loaded:', data.name, 'v' + data.version);
            }
        } catch (error) {
            console.error('Failed to load agent capabilities:', error);
        }
    }
    
    createCommandSuggestions() {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'command-suggestions';
        suggestionsDiv.innerHTML = `
            <div class="suggestions-header">
                <i class="fas fa-magic"></i>
                <span>Try these AI commands:</span>
            </div>
            <div class="suggestion-buttons">
                <button class="suggestion-btn" data-command="skill gap analysis">
                    <i class="fas fa-chart-line"></i> Skill Gap Analysis
                </button>
                <button class="suggestion-btn" data-command="project ideas">
                    <i class="fas fa-lightbulb"></i> Project Ideas
                </button>
                <button class="suggestion-btn" data-command="interview prep">
                    <i class="fas fa-handshake"></i> Interview Prep
                </button>
                <button class="suggestion-btn" data-command="industry trends">
                    <i class="fas fa-trending-up"></i> Industry Trends
                </button>
            </div>
        `;
        
        // Add click handlers for suggestion buttons
        suggestionsDiv.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const command = btn.getAttribute('data-command');
                this.chatInput.value = command;
                this.sendMessage();
            });
        });
        
        return suggestionsDiv;
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