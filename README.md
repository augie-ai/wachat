# WAChat: a free tool by Waani

Free, ungated WhatsApp widget generator at https://getwachat.vercel.app/.

- Standalone HTML/CSS with a small inline click handler; no external script.
- Optional hosted widget.js; a different popup layout and a WAChat hosting dependency.
- No branding in either generated mode. Optional installation/enquiry help links to Waani.
- No paid plans, account system or analytics backend. Referral links carry campaign tags; they do not establish conversion tracking.
- One widget per page. The widget opens WhatsApp; it is not a chatbot, shared inbox or API troubleshooting tool.

## Use

Enter your business WhatsApp number with country code, digits only (7–15 digits, no + or spaces). This checks format, not account existence. Customize, copy, and paste before the closing body tag. Test on your own site with a consenting recipient. Site CSP or HTML sanitizers may block inline scripts/handlers.

## Development and checks

No dependencies or build step.

```sh
node test-widget.cjs
python3 -m http.server 8000
```

Regression checks cover quoted/Unicode/multiline inputs, script-closing payloads, HTML escaping, number validation and the optional help CTA. Browser-check both modes, mobile layouts and clipboard behavior before deployment.

MIT
