# Kite Desk

**An AI WhatsApp receptionist for Dubai small businesses**, by [Kitebuild Studio](https://aaron11998.github.io/kitebuild-studio/).
It answers FAQs, takes bookings, and hands off to a human.

> **Status: early development.** Not live on WhatsApp, no production deployments, no customers yet. Early access on request.

- Product page: https://aaron11998.github.io/kitebuild-studio/kite-desk/
- In-browser demo (rule-based, fictional "Demo Salon, Al Barsha"): [`/demo`](demo/index.html)

## Architecture

```
WhatsApp user
   │
   ▼
WhatsApp Cloud API ──webhook──▶ Node/Express server (server.js)
                                   │  GET  /webhook  (verify token)
                                   │  POST /webhook  (message handler)
                                   ▼
                     Gemini API (key from env GEMINI_API_KEY, server-side only)
                                   │
                                   ▼
                     Business config JSON (config/demo-salon.json):
                     hours, services/prices, FAQs, booking fields, handoff keywords
```

The API key never leaves the server and is never committed. The `/demo` folder is a separate, purely client-side, rule-based demo that makes no network calls.

## Run the skeleton

```bash
cp .env.example .env   # fill in your own values locally; .env is gitignored
npm install
npm start
```

`POST /webhook` currently logs the generated reply; sending back via the Cloud API is a TODO.

## Roadmap

- [x] Webhook verification + message handler stub
- [x] Sample business config + rule-based web demo
- [ ] Send replies via WhatsApp Cloud API
- [ ] Booking state machine + calendar integration
- [ ] Human handoff (notify staff, pause bot)
- [ ] Arabic support
- [ ] Admin UI for editing the business config
- [ ] Pilot with early-access businesses

## License

MIT, see [LICENSE](LICENSE).
