# PitchDeck AI — README → Investor-Ready Pitch Deck Generator

AI-powered pitch deck generator with blockchain-secured payments. Users upload
a README, AI extracts the pitch content, payment is collected via the **x402
protocol** and settled on **Algorand**, then a PPTX deck is generated and
downloaded.

This matches the site map you specified:
Landing → Login → Dashboard → Upload README → AI Analysis → Payment (x402) →
PPT Preview → Download → Transaction History → Profile.

## Stack

| Layer          | Tech                                          |
|----------------|------------------------------------------------|
| Frontend       | React 18 + Vite + React Router + Tailwind CSS  |
| Backend        | Node.js + Express                              |
| AI             | OpenAI or Gemini API (falls back to a rule-based extractor if no key is set) |
| Presentation   | PptxGenJS (server-side .pptx generation)       |
| Blockchain     | Algorand (testnet by default) via `algosdk`    |
| Payment        | x402 protocol (HTTP 402 Payment Required)      |

> The original spec mentioned Spring Boot + MySQL. This starter uses
> Node/Express + an in-memory store instead, purely so the whole thing runs
> with one `npm install` for a hackathon demo. The API contract
> (`/api/upload`, `/api/analyze`, `/api/generate`, `/api/x402/pay`, etc.) is
> identical either way — swap the store for MySQL and the routes for Spring
> controllers later without touching the frontend.

## How the blockchain part actually works (important — read this)

The **x402 protocol** is simple: a protected endpoint responds with HTTP
status **402 Payment Required** and a JSON body describing how to pay
(amount, asset, network, recipient address). The client pays, then retries
the request, this time proving payment.

Here, `POST /api/generate` is the protected resource:

1. Frontend calls `POST /api/generate`.
2. If the deck hasn't been paid for, the backend replies `402` with:
   ```json
   { "price": { "amount": "0.5", "asset": "ALGO", "network": "Algorand TestNet" }, "protocol": "x402" }
   ```
3. Frontend shows the payment screen and calls `POST /api/x402/pay`.
4. The backend submits a **real Algorand testnet transaction** (see below)
   and returns a `txId`.
5. Frontend polls `GET /api/payment/status?txId=...`, which looks the
   transaction up on the **Algorand Indexer** and confirms: right receiver,
   right amount, confirmed on-chain.
6. Once confirmed, the backend marks the deck as paid and the frontend
   retries `POST /api/generate`, which now returns `200` with the slide data.
7. Every confirmed payment is appended to `/api/transactions`, and the
   Transaction History page links each row out to the Algorand block
   explorer.

### Why the "Pay" button doesn't pop up a real wallet extension

Wiring a real in-browser wallet (Pera Wallet Connect / Defly) requires the
*user's own* signature and is a bit more UI plumbing than fits a first pass.
So this starter uses a **demo signer**: you fund one testnet account
yourself and put its mnemonic in `backend/.env` as `DEMO_SENDER_MNEMONIC`.
When "Pay with Algorand Wallet" is clicked, the backend signs and submits a
real payment from that account to your `MERCHANT_WALLET_ADDRESS` on Algorand
TestNet — so the whole pay → confirm-on-chain → unlock loop is genuinely
happening on the blockchain, just without a wallet popup.

**To upgrade to a real wallet in the browser** for your final demo:
1. `npm install @perawallet/connect` in the frontend.
2. Connect the wallet on the Payment page, build the transaction with
   `buildPaymentTxn()` (already in `backend/services/algorand.js`), send it
   to the frontend to sign with `peraWallet.signTransaction(...)`, then
   submit it and pass the resulting `txId` to `/api/payment/status` — no
   backend changes needed beyond exposing `buildPaymentTxn` as a route.

## Setup

### 1. Get Algorand testnet accounts (free, ~2 minutes)

- Create two accounts (e.g. with [Pera Wallet](https://perawallet.app/) set
  to TestNet, or `algosdk.generateAccount()` in a Node REPL): one is your
  **merchant** wallet (receives payments), one is your **demo sender**
  (pays on the user's behalf).
- Fund both from the [TestNet dispenser](https://bank.testnet.algorand.network/).
- Copy the demo sender's 25-word mnemonic.

### 2. Backend

```bash
cd backend
cp .env.example .env
# edit .env:
#   MERCHANT_WALLET_ADDRESS=<merchant address>
#   DEMO_SENDER_MNEMONIC=<25-word mnemonic of the funded demo sender>
#   OPENAI_API_KEY=... (optional — omit to use the offline rule-based analyzer)
npm install
npm run dev
```
Backend runs on `http://localhost:4000`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173` and proxies `/api` to the backend.

### 4. Try the flow

Landing page → Login (any email/password) → Dashboard → Generate New Deck →
paste a README → watch the AI analysis animate → Pay with Algorand Wallet
(this fires a real TestNet transaction) → preview the generated slides →
download the `.pptx`.

## Project structure

```
pitchdeck-ai/
├── frontend/                # React + Vite + Tailwind
│   └── src/
│       ├── pages/           # Landing, Login, Dashboard, Upload, Analysis,
│       │                    # Payment, Preview, Download, Transactions, Profile
│       ├── components/      # Sidebar, Navbar, AppShell
│       ├── DeckFlowContext.jsx  # shared state across the upload→download flow
│       └── api/client.js    # fetch wrapper for the backend
└── backend/                 # Node + Express
    ├── routes/               # auth, upload, analyze, generate, x402, transactions
    └── services/
        ├── ai.js             # OpenAI/Gemini README analysis (+ offline fallback)
        ├── algorand.js       # algosdk: build/send/verify Algorand payments
        ├── ppt.js            # PptxGenJS deck rendering
        └── store.js          # in-memory data (swap for MySQL in production)
```

## Backend API reference

| Method | Path                     | Purpose                                              |
|--------|---------------------------|-------------------------------------------------------|
| POST   | `/api/login`              | Demo auth                                              |
| POST   | `/api/upload`              | Store README text, returns `uploadId`                 |
| POST   | `/api/analyze`             | AI-extract pitch content, returns `analysisId`         |
| POST   | `/api/generate`            | **x402-protected.** 402 until paid, then returns slides |
| POST   | `/api/x402/pay`            | Submits Algorand payment, returns `txId`               |
| GET    | `/api/payment/status`      | Verifies a `txId` on-chain via the Algorand Indexer     |
| GET    | `/api/transactions`        | Payment history                                        |
| GET    | `/api/download`            | Renders and downloads the `.pptx`                       |

## What's stored on-chain vs off-chain

Per your spec: **only the payment transaction is on Algorand** (sender,
receiver, amount, round, txId). The README content and generated slides are
never written to the blockchain — they live in the backend store (swap for
MySQL/S3 in production).

## Ideas to impress judges (from your notes, still open to build)

- AI-generated architecture diagrams and SWOT analysis per deck
- Speaker notes per slide
- A blockchain transaction explorer view embedded in the app
- PDF export (wire up `soffice --headless --convert-to pdf` in `services/ppt.js`)
- Real Pera Wallet Connect signing flow (see upgrade note above)
