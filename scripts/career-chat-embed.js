/**
 * Embeddable Career Chat Widget
 * This script can be included in any KeyRacer page to add the chat widget
 */

(function() {
    'use strict';

    // Check if widget is already loaded
    if (window.CareerChatEmbedded) {
        return;
    }

    window.CareerChatEmbedded = true;

    /**
     * Load CSS dynamically
     */
    function loadCSS() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/styles/career-chat.css';
        document.head.appendChild(link);
    }

    /**
     * Create chat widget HTML
     */
    function createChatWidget() {
        const widgetHTML = `
            <div id="career-chat-widget" class="chat-widget">
                <!-- Chat Toggle Button -->
                <div id="chat-toggle" class="chat-toggle">
                    <i class="fas fa-robot"></i>
                    <span class="chat-badge" id="chat-badge">AI Career Guide</span>
                </div>

                <!-- Chat Window -->
                <div id="chat-window" class="chat-window">
                    <!-- Chat Header -->
                    <div class="chat-header">
                        <div class="chat-header-info">
                            <i class="fas fa-robot"></i>
                            <div>
                                <h4>AI Career Guide</h4>
                                <span class="status">Online</span>
                            </div>
                        </div>
                        <div class="chat-controls">
                            <button id="reset-chat" class="control-btn" title="Reset Chat">
                                <i class="fas fa-redo"></i>
                            </button>
                            <button id="minimize-chat" class="control-btn" title="Minimize">
                                <i class="fas fa-minus"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Chat Messages -->
                    <div id="chat-messages" class="chat-messages">
                        <div class="message bot-message">
                            <div class="message-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="message-content">
                                <p>Welcome! I'm your AI Career Guidance Assistant. Let me help you create a personalized career roadmap! 🚀</p>
                                <span class="message-time">Just now</span>
                            </div>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div id="progress-container" class="progress-container" style="display: none;">
                        <div class="progress-bar">
                            <div id="progress-fill" class="progress-fill"></div>
                        </div>
                        <span id="progress-text" class="progress-text">Step 1 of 5</span>
                    </div>

                    <!-- Chat Input -->
                    <div class="chat-input-container">
                        <div class="chat-input-wrapper">
                            <input 
                                type="text" 
                                id="chat-input" 
                                placeholder="Type your message..." 
                                maxlength="500"
                                autocomplete="off"
                            >
                            <button id="send-button" class="send-button">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="input-footer">
                            <span class="powered-by">Powered by Google Gemini AI</span>
                        </div>
                    </div>

                    <!-- Typing Indicator -->
                    <div id="typing-indicator" class="typing-indicator" style="display: none;">
                        <div class="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                        <span>AI is thinking...</span>
                    </div>
                </div>
            </div>
        `;

        // Create container and add to body
        const container = document.createElement('div');
        container.innerHTML = widgetHTML;
        document.body.appendChild(container.firstElementChild);
    }

    /**
     * Load Font Awesome if not already loaded
     */
    function loadFontAwesome() {
        if (!document.querySelector('link[href*="font-awesome"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
            document.head.appendChild(link);
        }
    }

    /**
     * Load the main chat script
     */
    function loadChatScript() {
        const script = document.createElement('script');
        script.src = '/scripts/career-chat.js';
        script.onload = function() {
            console.log('Career Chat Widget loaded successfully');
        };
        script.onerror = function() {
            console.error('Failed to load Career Chat Widget');
        };
        document.head.appendChild(script);
    }

    /**
     * Initialize the widget
     */
    function init() {
        // Load dependencies
        loadFontAwesome();
        loadCSS();
        
        // Create widget HTML
        createChatWidget();
        
        // Load and initialize chat functionality
        loadChatScript();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose configuration options
    window.CareerChatConfig = {
        // Future configuration options can be added here
        theme: 'default',
        position: 'bottom-right',
        autoOpen: false
    };

})();