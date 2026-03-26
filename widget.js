
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
            BrandingText: "Powered by WAChat",
            BrandingUrl: "https://getwachat.vercel.app"
        };

        // Merge user options with defaults
        var settings = Object.assign({}, defaults, options);

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
                height: 40px; /* Fixed height for single line */
                box-sizing: border-box;
            }
            .wachat-text-input:focus {
                border-color: ${settings.WidgetColor};
                box-shadow: 0 0 0 2px rgba(37, 211, 102, 0.2);
            }


            .wachat-send-button {
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
        var floatingButton = document.createElement("div");
        floatingButton.classList.add("wachat-floating-button");
        floatingButton.innerHTML = `
            <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12.047 2.001c-5.518 0-9.99 4.472-9.99 9.99 0 1.765.465 3.426 1.282 4.871l-1.31 4.887 5.02-1.26a10.01 10.01 0 0 0 8.008 0l-1.31 4.887 5.02-1.26a10.01 10.01 0 0 0 8.008 0l-1.31 4.887 5.02-1.26c.817-1.445 1.282-3.106 1.282-4.871 0-5.518-4.472-9.99-9.99-9.99zm0 2.016c4.42 0 7.974 3.554 7.974 7.974 0 1.583-.464 3.067-1.283 4.296l-.59.983 1.154 4.305-4.444-1.117-.984-.59c-1.229.819-2.713 1.283-4.296 1.283-4.42 0-7.974-3.554-7.974-7.974 0-4.42 3.554-7.974 7.974-7.974zM16 13.999c-.161-.079-.982-.485-1.134-.54s-.263-.079-.374.079c-.112.161-.433.54-.53.645s-.194.119-.36-.039c-1.189-.475-1.97-.939-2.766-1.63s-1.341-1.383-1.78-2.146c-.438-.763-.04-1.178.29-1.488s.329-.53.491-.793c.16-.263.079-.494-.039-.691s-.361-.912-.491-1.205c-.131-.29-.263-.231-.361-.231s-.205-.008-.314-.008c-.104-.008-.263.03-.394.161s-.485.475-1.178 1.168c-.69.699-1.416 1.342-1.416 2.457 0 1.115.828 2.229 1.905 3.397s2.396 2.923 4.288 3.522c1.892.599 3.195.539 3.868.491.673-.04 1.137-.263 1.298-.53s.16-1.025.112-1.898c-.049-.873-.204-.939-.36-.988z"/>
            </svg>
        `;

        var chatPopup = document.createElement("div");
        chatPopup.classList.add("wachat-chat-popup");
        chatPopup.innerHTML = `
            <div class="wachat-header">
                <div class="wachat-header-logo">
                    ${settings.SiteLogo ? `<img src="${settings.SiteLogo}" alt="Logo">` : `
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M12.047 2.001c-5.518 0-9.99 4.472-9.99 9.99 0 1.765.465 3.426 1.282 4.871l-1.31 4.887 5.02-1.26a10.01 10.01 0 0 0 8.008 0l-1.31 4.887 5.02-1.26a10.01 10.01 0 0 0 8.008 0l-1.31 4.887 5.02-1.26c.817-1.445 1.282-3.106 1.282-4.871 0-5.518-4.472-9.99-9.99-9.99zm0 2.016c4.42 0 7.974 3.554 7.974 7.974 0 1.583-.464 3.067-1.283 4.296l-.59.983 1.154 4.305-4.444-1.117-.984-.59c-1.229.819-2.713 1.283-4.296 1.283-4.42 0-7.974-3.554-7.974-7.974 0-4.42 3.554-7.974 7.974-7.974zM16 13.999c-.161-.079-.982-.485-1.134-.54s-.263-.079-.374.079c-.112.161-.433.54-.53.645s-.194.119-.36-.039c-1.189-.475-1.97-.939-2.766-1.63s-1.341-1.383-1.78-2.146c-.438-.763-.04-1.178.29-1.488s.329-.53.491-.793c.16-.263.079-.494-.039-.691s-.361-.912-.491-1.205c-.131-.29-.263-.231-.361-.231s-.205-.008-.314-.008c-.104-.008-.263.03-.394.161s-.485.475-1.178 1.168c-.69.699-1.416 1.342-1.416 2.457 0 1.115.828 2.229 1.905 3.397s2.396 2.923 4.288 3.522c1.892.599 3.195.539 3.868.491.673-.04 1.137-.263 1.298-.53s.16-1.025.112-1.898c-.049-.873-.204-.939-.36-.988z"/>
                        </svg>
                    `}
                </div>
                <div class="wachat-site-info">
                    <div class="wachat-site-name">${settings.SiteName}</div>
                    <div class="wachat-site-tag"><span class="wachat-status-dot"></span>${settings.SiteTag}</div>
                </div>
                <button class="wachat-close-button">&times;</button>
            </div>
            <div class="wachat-chat-body">
                <div class="wachat-welcome-message">${settings.WelcomeMessage}</div>
            </div>
            <div class="wachat-input-container">
                <input type="text" class="wachat-text-input" placeholder="Type a message..." value="${settings.Message}">
                <button class="wachat-send-button">Start Chat</button>
            </div>
            ${settings.BrandingText ? `<div class="wachat-branding"><a href="${settings.BrandingUrl}" target="_blank">${settings.BrandingText}</a></div>` : ''}
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
        }

        floatingButton.addEventListener("click", togglePopup);
        chatPopup.querySelector(".wachat-close-button").addEventListener("click", togglePopup);

        var sendButton = chatPopup.querySelector(".wachat-send-button");
        var textInput = chatPopup.querySelector(".wachat-text-input");

        function openWhatsAppChat() {
            var message = encodeURIComponent(textInput.value || settings.Message);
            var whatsappUrl = `https://wa.me/${settings.Contact}?text=${message}`;
            window.open(whatsappUrl, '_blank');
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
