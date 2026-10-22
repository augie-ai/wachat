
(function() {
    function whatsapp_widget(options) {
        // Default options
        var defaults = {
            Position: "right",
            Contact: "919876543210",
            SiteName: "My Business",
            SiteTag: "Online",
            SiteLogo: "",
            WelcomeMessage: "Hi! How can we help you?",
            WidgetColor: "#25D366",
            TextColor: "#ffffff",
            Message: "Hello, I have a question about your services",
            BrandingText: "",
            CtaText: "Start chat",
            AutoOpen: false,
            ShowBadge: false,
            BrandingUrl: "https://tools.getwaani.com"
        };

        // Merge user options with defaults
        var settings = Object.assign({}, defaults, options);

        if (!/^[1-9][0-9]{6,14}$/.test(String(settings.Contact))) {
            throw new Error('WhatsApp number must be 7–15 digits with country code, no + or spaces.');
        }
        settings.Position = settings.Position === 'left' ? 'left' : 'right';
        for (const key of ['WidgetColor', 'TextColor']) {
            if (!/^#[0-9a-f]{6}$/i.test(settings[key])) settings[key] = defaults[key];
        }
        const escapeHtml = value => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        const safeUrl = value => {
            try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? escapeHtml(url.href) : ''; }
            catch { return ''; }
        };

        // --- CSS Styles ---
        var css = `
            .wachat-floating-button {
                position: fixed;
                bottom: 20px;
                ${settings.Position}: 20px;
                background-color: ${settings.WidgetColor};
                color: ${settings.TextColor};
                width: 60px;
                height: 60px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 30px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                cursor: pointer;
                z-index: 999999;
                transition: all 0.3s ease;
                animation: wachat-pulse 2s infinite;
            }

            .wachat-floating-button:hover {
                transform: scale(1.05);
            }

            @keyframes wachat-pulse {
                0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(37, 211, 102, 0); }
                100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
            }

            .wachat-chat-popup {
                position: fixed;
                bottom: 90px;
                ${settings.Position}: 20px;
                width: 350px;
                max-width: 90%;
                background-color: #fff;
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                z-index: 999999;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                opacity: 0;
                transform: translateY(20px);
                visibility: hidden;
                transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s ease;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            }

            .wachat-chat-popup.wachat-open {
                opacity: 1;
                transform: translateY(0);
                visibility: visible;
            }

            .wachat-header {
                background-color: ${settings.WidgetColor};
                color: ${settings.TextColor};
                padding: 15px;
                display: flex;
                align-items: center;
                border-top-left-radius: 12px;
                border-top-right-radius: 12px;
                position: relative;
            }

            .wachat-header-logo {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 10px;
                overflow: hidden;
            }

            .wachat-header-logo img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .wachat-header-logo svg {
                fill: ${settings.TextColor};
                width: 24px;
                height: 24px;
            }

            .wachat-site-info {
                flex-grow: 1;
            }

            .wachat-site-name {
                font-weight: bold;
                font-size: 16px;
                line-height: 1.2;
            }

            .wachat-site-tag {
                font-size: 13px;
                opacity: 0.9;
                display: flex;
                align-items: center;
            }

            .wachat-status-dot {
                width: 8px;
                height: 8px;
                background-color: #4CAF50; /* Green for online */
                border-radius: 50%;
                margin-right: 5px;
                display: inline-block;
            }

            .wachat-close-button {
                background: none;
                border: none;
                color: ${settings.TextColor};
                font-size: 24px;
                cursor: pointer;
                line-height: 1;
                padding: 5px;
            }

            .wachat-chat-body {
                padding: 20px;
                flex-grow: 1;
                background-color: #f0f2f5; /* Light grey background */
                overflow-y: auto;
            }

            .wachat-welcome-message {
                background-color: #e2ffc7; /* WhatsApp-like incoming message bubble */
                color: #000;
                padding: 10px 12px;
                border-radius: 10px 10px 10px 0;
                max-width: 80%;
                margin-bottom: 10px;
                box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);
                align-self: flex-start;
                word-wrap: break-word;
            }

            .wachat-input-container {
                display: flex;
                padding: 15px;
                border-top: 1px solid #eee;
                background-color: #f8f9fa;
            }

            .wachat-text-input {
                flex-grow: 1;
                border: 1px solid #ddd;
                border-radius: 20px;
                padding: 10px 15px;
                font-size: 14px;
                margin-right: 10px;
                outline: none;
                resize: none;
                height: 40px; min-width: 0;
                box-sizing: border-box;
            }
            .wachat-text-input:focus {
                border-color: ${settings.WidgetColor};
                box-shadow: 0 0 0 2px rgba(37, 211, 102, 0.2);
            }


            .wachat-send-button {
                flex-shrink: 0;
                white-space: nowrap;
                background-color: ${settings.WidgetColor};
                color: ${settings.TextColor};
                border: none;
                border-radius: 20px;
                padding: 10px 15px;
                font-size: 14px;
                cursor: pointer;
                transition: background-color 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .wachat-send-button:hover {
                background-color: #1DA851; /* Darker green on hover */
            }

            .wachat-branding {
                text-align: center;
                padding: 8px;
                font-size: 12px;
                color: #888;
                border-top: 1px solid #eee;
                background-color: #fff;
            }

            .wachat-branding a {
                color: #888;
                text-decoration: none;
            }
            .wachat-branding a:hover {
                text-decoration: underline;
            }

            /* Mobile responsiveness */
            @media (max-width: 480px) {
                .wachat-chat-popup {
                    width: 100%;
                    max-width: 100%;
                    height: 100%;
                    bottom: 0;
                    ${settings.Position}: 0;
                    border-radius: 0;
                }
                .wachat-header {
                    border-radius: 0;
                }
                .wachat-floating-button {
                    bottom: 15px;
                    ${settings.Position}: 15px;
                }
            }
        `;

        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);

        // --- Widget HTML Structure ---
        var floatingButton = document.createElement("button");
        floatingButton.type = "button";
        floatingButton.setAttribute("aria-label", "Toggle WhatsApp chat");
        floatingButton.setAttribute("aria-expanded", "false");
        floatingButton.classList.add("wachat-floating-button");
        floatingButton.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
        `;

        if (settings.ShowBadge) {
            const badge = document.createElement('span');
            badge.textContent = '1';
            badge.style.cssText = 'position:absolute;top:-4px;right:-4px;background:#b52b16;color:white;border-radius:50%;font-size:12px;padding:2px 6px';
            floatingButton.appendChild(badge);
        }
        var chatPopup = document.createElement("div");
        chatPopup.classList.add("wachat-chat-popup");
        chatPopup.innerHTML = `
            <div class="wachat-header">
                <div class="wachat-header-logo">
                    ${settings.SiteLogo ? `<img src="${safeUrl(settings.SiteLogo)}" alt="Logo">` : `
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                    `}
                </div>
                <div class="wachat-site-info">
                    <div class="wachat-site-name">${escapeHtml(settings.SiteName)}</div>
                    <div class="wachat-site-tag"><span class="wachat-status-dot"></span>${escapeHtml(settings.SiteTag)}</div>
                </div>
                <button type="button" aria-label="Close WhatsApp chat" class="wachat-close-button">&times;</button>
            </div>
            <div class="wachat-chat-body">
                <div class="wachat-welcome-message">${escapeHtml(settings.WelcomeMessage)}</div>
            </div>
            <div class="wachat-input-container">
                <input aria-label="Message to send in WhatsApp" type="text" class="wachat-text-input" placeholder="Type a message..." value="${escapeHtml(settings.Message)}">
                <button type="button" class="wachat-send-button">${escapeHtml(settings.CtaText)}</button>
            </div>
            ${settings.BrandingText ? `<div class="wachat-branding"><a href="${safeUrl(settings.BrandingUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(settings.BrandingText)}</a></div>` : ''}
        `;

        document.body.appendChild(floatingButton);
        document.body.appendChild(chatPopup);

        // --- Event Listeners ---
        var isPopupOpen = false;

        function togglePopup() {
            if (isPopupOpen) {
                chatPopup.classList.remove("wachat-open");
            } else {
                chatPopup.classList.add("wachat-open");
            }
            isPopupOpen = !isPopupOpen;
            floatingButton.setAttribute("aria-expanded", String(isPopupOpen));
        }

        if (settings.AutoOpen) togglePopup();
        chatPopup.addEventListener("keydown", event => { if (event.key === "Escape" && isPopupOpen) { togglePopup(); floatingButton.focus(); } });
        floatingButton.addEventListener("click", togglePopup);
        chatPopup.querySelector(".wachat-close-button").addEventListener("click", togglePopup);

        var sendButton = chatPopup.querySelector(".wachat-send-button");
        var textInput = chatPopup.querySelector(".wachat-text-input");

        function openWhatsAppChat() {
            var message = encodeURIComponent(textInput.value || settings.Message);
            var whatsappUrl = `https://wa.me/${settings.Contact}?text=${message}`;
            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
        }

        sendButton.addEventListener("click", openWhatsAppChat);
        textInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                openWhatsAppChat();
            }
        });
    }

    // Expose the function globally
    window.whatsapp_widget = whatsapp_widget;
})();
