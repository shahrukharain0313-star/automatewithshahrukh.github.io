// ===== AI CHATBOT — Automate with Shahrukh =====
// Connects to Gemini via Vercel serverless function

(function() {
    'use strict';

    const API_URL = '/api/chat';
    const chatToggle = document.getElementById('chatToggle');
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatMessages = document.getElementById('chatMessages');
    const chatTyping = document.getElementById('chatTyping');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatQuickActions = document.getElementById('chatQuickActions');

    // Exit early if elements not found (other pages without chat)
    if (!chatToggle || !chatWindow) return;

    // Conversation history for context
    let conversationHistory = [];
    let isProcessing = false;

    // ===== TOGGLE CHAT =====
    chatToggle.addEventListener('click', () => {
        const isOpen = chatWindow.classList.toggle('open');
        chatToggle.classList.toggle('active', isOpen);
        // Hide notification badge once opened
        const badge = chatToggle.querySelector('.chat-badge');
        if (badge) badge.style.display = 'none';
        if (isOpen) {
            setTimeout(() => chatInput.focus(), 300);
        }
    });

    // Close handled in AUTO-SEND section below

    // ===== SEND MESSAGE =====
    function sendMessage(text) {
        if (!text.trim() || isProcessing) return;

        // Add user message to UI
        appendMessage('user', text);
        conversationHistory.push({ role: 'user', content: text });

        // Hide quick actions after first message
        if (chatQuickActions) chatQuickActions.style.display = 'none';

        // Clear input
        chatInput.value = '';
        isProcessing = true;
        chatSend.disabled = true;

        // Show typing indicator
        chatTyping.classList.add('show');
        scrollToBottom();

        // Call API
        fetchAIResponse();
    }

    async function fetchAIResponse() {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: conversationHistory })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.error || 'Network error');
            }

            const data = await response.json();
            const reply = data.reply || "Sorry, I couldn't process that. Please try again!";

            // Add AI response
            conversationHistory.push({ role: 'model', content: reply });
            appendMessage('ai', reply);

            // Handle lead capture
            if (data.lead) {
                handleLeadCapture(data.lead);
            }

        } catch (error) {
            console.error('Chat error:', error);
            let errorMsg = "Sorry, I'm having trouble connecting right now. ";
            
            if (error.message.includes('Too many')) {
                errorMsg = "You're sending messages too quickly! Please wait a moment. ⏳";
            } else {
                errorMsg += "You can reach Shahrukh directly on WhatsApp: +92 317 8172607 📱";
            }
            
            appendMessage('ai', errorMsg);
        } finally {
            chatTyping.classList.remove('show');
            isProcessing = false;
            chatSend.disabled = false;
            chatInput.focus();
        }
    }

    // ===== APPEND MESSAGE TO CHAT =====
    function appendMessage(type, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${type}`;
        // Convert line breaks and basic formatting
        msgDiv.innerHTML = formatMessage(text);
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function formatMessage(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/✅/g, '✅')
            .replace(/🎯/g, '🎯');
    }

    function scrollToBottom() {
        setTimeout(() => {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 50);
    }

    // ===== AUTO EMAIL SYSTEM =====
    let conversationEmailed = false;

    function sendConversationEmail(lead) {
        if (conversationEmailed) return;
        // Only send if there's actual conversation (more than welcome msg)
        if (conversationHistory.length < 1) return;
        
        conversationEmailed = true;

        const payload = {
            name: lead ? (lead.name || 'Unknown Visitor') : 'Unknown Visitor',
            whatsapp: lead ? (lead.whatsapp || 'Not collected') : 'Not collected',
            project: lead ? (lead.project || 'Not specified') : 'General inquiry',
            conversation: conversationHistory
        };

        // Use sendBeacon for reliability (works even on page close)
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
        const sent = navigator.sendBeacon('/api/lead', blob);
        
        // Fallback to fetch if sendBeacon fails
        if (!sent) {
            fetch('/api/lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                keepalive: true
            }).catch(() => {});
        }
    }

    // ===== LEAD CAPTURE (AI collected contact info) =====
    function handleLeadCapture(lead) {
        sendConversationEmail(lead);
    }

    // ===== AUTO-SEND on chat close =====
    chatClose.addEventListener('click', () => {
        chatWindow.classList.remove('open');
        chatToggle.classList.remove('active');
        // Email conversation when client closes chat
        if (conversationHistory.length >= 1) {
            sendConversationEmail(null);
        }
    });

    // ===== AUTO-SEND when leaving page =====
    window.addEventListener('beforeunload', () => {
        if (conversationHistory.length >= 1) {
            sendConversationEmail(null);
        }
    });

    // ===== EVENT LISTENERS =====
    chatSend.addEventListener('click', () => sendMessage(chatInput.value));

    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(chatInput.value);
        }
    });

    // Quick action buttons
    document.querySelectorAll('.chat-quick-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const msg = btn.getAttribute('data-msg');
            if (msg) sendMessage(msg);
        });
    });

    // Close chat when clicking outside
    document.addEventListener('click', (e) => {
        if (chatWindow.classList.contains('open') && 
            !chatWindow.contains(e.target) && 
            !chatToggle.contains(e.target)) {
            chatWindow.classList.remove('open');
            chatToggle.classList.remove('active');
        }
    });

    // Auto-open chat after 30 seconds if user hasn't interacted
    let autoOpenTimer = setTimeout(() => {
        if (!chatWindow.classList.contains('open') && !sessionStorage.getItem('chatDismissed')) {
            // Just show the badge, don't auto-open
            const badge = chatToggle.querySelector('.chat-badge');
            if (badge) badge.style.display = 'block';
        }
    }, 30000);

    // Clear timer on any chat interaction
    chatToggle.addEventListener('click', () => clearTimeout(autoOpenTimer));

})();
