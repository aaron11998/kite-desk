# Kite Desk

**An AI WhatsApp receptionist for Dubai small businesses**, by [Kitebuild Studio](https://aaron11998.github.io/kitebuild-studio/).
It answers FAQs, takes bookings, and hands off to a human.

> **Status: early development.** Not live on WhatsApp, no production deployments, no customers yet. Early access on request.

- Product page: https://aaron11998.github.io/kitebuild-studio/kite-desk/
- In-browser demo (rule-based, fictional "Demo Salon, Al Barsha"): [`/demo`](demo/index.html)

## Languages

The product page and its in-browser demo are available in six languages. Pick one with the switcher in the header, or link directly:

| Language | Code | Direction | URL | Demo sample business (fictional) |
|---|---|---|---|---|
| English | `en` | LTR | [/kite-desk/](https://aaron11998.github.io/kitebuild-studio/kite-desk/) | Demo Salon, Al Barsha (Dubai, AED) |
| Português (Brasil) | `pt-BR` | LTR | [?lang=pt-BR](https://aaron11998.github.io/kitebuild-studio/kite-desk/?lang=pt-BR) | Salão Demo, Pinheiros (São Paulo, BRL) |
| Bahasa Indonesia | `id` | LTR | [?lang=id](https://aaron11998.github.io/kitebuild-studio/kite-desk/?lang=id) | Salon Demo, Kemang (Jakarta, IDR) |
| हिन्दी | `hi` | LTR | [?lang=hi](https://aaron11998.github.io/kitebuild-studio/kite-desk/?lang=hi) | डेमो सैलून, बांद्रा (Mumbai, INR) |
| العربية | `ar` | RTL | [?lang=ar](https://aaron11998.github.io/kitebuild-studio/kite-desk/?lang=ar) | صالون ديمو، البرشاء (Dubai, AED) |
| Español | `es` | LTR | [?lang=es](https://aaron11998.github.io/kitebuild-studio/kite-desk/?lang=es) | Salón Demo, Polanco (CDMX, MXN) |

- Without `?lang=`, the page uses the browser language (`navigator.languages`; any `pt-*` maps to `pt-BR`), falling back to English.
- The page declares `hreflang` alternates for every language plus `x-default`.
- Locale files live in [`config/locales/`](config/locales/): page copy (`page`) and the rule-based demo (`demo`: sample business, services and demo prices, intent keywords, quick replies, reply templates). Demo prices belong to the fictional sample salons only; Kite Desk itself has no published pricing.
- Every language makes the same claims: early access, not yet connected to WhatsApp, no customers, pricing on request.
- The standalone [`/demo`](demo/index.html) in this repo is still English only.
- Real (non-demo) multilingual replies over WhatsApp are not built yet; see the roadmap.

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
- [x] Multilingual product page + rule-based demo (en, pt-BR, id, hi, ar RTL, es)
- [ ] Multilingual replies in the live WhatsApp bot (Arabic, Portuguese, Indonesian, Hindi, Spanish)
- [ ] Admin UI for editing the business config
- [ ] Pilot with early-access businesses

## License

MIT, see [LICENSE](LICENSE).
