import algosdk from 'algosdk';

const ALGOD_URL = process.env.ALGORAND_ALGOD_URL || 'https://testnet-api.algonode.cloud';
const ALGOD_TOKEN = process.env.ALGORAND_ALGOD_TOKEN || '';
const INDEXER_URL = process.env.ALGORAND_INDEXER_URL || 'https://testnet-idx.algonode.cloud';
const MERCHANT_ADDRESS = process.env.MERCHANT_WALLET_ADDRESS || '';
const DEMO_SENDER_MNEMONIC = process.env.DEMO_SENDER_MNEMONIC || '';

const algodClient = new algosdk.Algodv2(ALGOD_TOKEN, ALGOD_URL, '');
const indexerClient = new algosdk.Indexer(ALGOD_TOKEN, INDEXER_URL, '');

/**
 * PRODUCTION FLOW (real wallet, e.g. Pera Wallet Connect):
 * 1. Frontend connects the user's Algorand wallet in-browser.
 * 2. Frontend calls GET/POST here to build an *unsigned* payment transaction
 *    (buildPaymentTxn) addressed to MERCHANT_ADDRESS.
 * 3. Frontend asks the wallet to sign it (never send private keys to the backend).
 * 4. Frontend submits the signed txn to the network (or backend relays it) and
 *    gets back a txId.
 * 5. Backend verifies that txId via verifyPayment() before releasing the deck.
 *
 * DEMO FLOW (used by routes/x402.js in this starter, no wallet extension needed):
 * A funded testnet account (DEMO_SENDER_MNEMONIC) signs and submits the payment
 * on the user's behalf so the whole loop — pay -> confirm on-chain -> unlock —
 * is real and verifiable on Algorand testnet, without requiring wallet UI wiring
 * for the hackathon demo. Swap sendDemoPayment() for real wallet signing later.
 */

export async function buildPaymentTxn(senderAddress, amountAlgo) {
  const params = await algodClient.getTransactionParams().do();
  return algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: senderAddress,
    to: MERCHANT_ADDRESS,
    amount: Math.round(amountAlgo * 1_000_000), // ALGO -> microAlgos
    suggestedParams: params
  });
}

export async function sendDemoPayment(amountAlgo) {
  if (!DEMO_SENDER_MNEMONIC || !MERCHANT_ADDRESS) {
    throw new Error(
      'Demo payment not configured. Set MERCHANT_WALLET_ADDRESS and DEMO_SENDER_MNEMONIC in .env, ' +
        'or wire up real wallet signing via buildPaymentTxn() for production.'
    );
  }
  const account = algosdk.mnemonicToSecretKey(DEMO_SENDER_MNEMONIC);
  const params = await algodClient.getTransactionParams().do();
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: account.addr,
    to: MERCHANT_ADDRESS,
    amount: Math.round(amountAlgo * 1_000_000),
    suggestedParams: params
  });
  const signed = txn.signTxn(account.sk);
  const { txId } = await algodClient.sendRawTransaction(signed).do();
  await algosdk.waitForConfirmation(algodClient, txId, 4);
  return txId;
}

export async function verifyPayment(txId, expectedAmountAlgo) {
  try {
    const info = await indexerClient.lookupTransactionByID(txId).do();
    const txn = info.transaction;
    if (!txn || txn['tx-type'] !== 'pay') return { valid: false, reason: 'Not a payment transaction' };

    const receiver = txn['payment-transaction'].receiver;
    const amountMicroAlgos = txn['payment-transaction'].amount;
    const confirmed = txn['confirmed-round'] > 0;

    const receiverOk = MERCHANT_ADDRESS ? receiver === MERCHANT_ADDRESS : true;
    const amountOk = amountMicroAlgos >= Math.round(expectedAmountAlgo * 1_000_000);

    return { valid: confirmed && receiverOk && amountOk, confirmed, receiver, amountMicroAlgos };
  } catch (err) {
    // Not yet indexed, or invalid txId
    return { valid: false, reason: err.message };
  }
}
