// Kite Desk server skeleton (early development). Not production ready.
// WhatsApp Cloud API webhook -> Express -> Gemini (server-side key from env) -> business config.
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
const config = JSON.parse(fs.readFileSync(path.join(__dirname, process.env.BUSINESS_CONFIG || 'config/demo-salon.json'), 'utf8'));

// Webhook verification (Meta sends hub.mode, hub.verify_token, hub.challenge)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && VERIFY_TOKEN && token === VERIFY_TOKEN) return res.status(200).send(challenge);
  return res.sendStatus(403);
});

// Incoming messages
app.post('/webhook', async (req, res) => {
  res.sendStatus(200); // acknowledge quickly
  try {
    const msg = req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!msg || msg.type !== 'text') return;
    const reply = await askGemini(msg.text.body);
    // TODO: send `reply` back via WhatsApp Cloud API (POST /{PHONE_NUMBER_ID}/messages). Not implemented yet.
    // TODO: booking state machine + human handoff routing.
    console.log('[stub] would reply to', msg.from, ':', reply);
  } catch (err) {
    console.error('handler error', err.message);
  }
});

async function askGemini(userText) {
  const apiKey = process.env.GEMINI_API_KEY; // server-side only, never shipped to clients
  if (!apiKey) return 'Sorry, the assistant is not configured yet.';
  const prompt = `You are the WhatsApp receptionist for ${config.business}. Answer only from this business info; ` +
    `if unsure or asked for a person, offer a human handoff.\nBusiness info: ${JSON.stringify(config)}\nCustomer: ${userText}`;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  const data = await r.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, something went wrong.';
}

app.get('/health', (_req, res) => res.json({ ok: true }));
app.listen(PORT, () => console.log(`Kite Desk skeleton listening on :${PORT}`));
