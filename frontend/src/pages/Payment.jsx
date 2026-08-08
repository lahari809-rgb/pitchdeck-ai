import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell.jsx';
import { useDeckFlow } from '../DeckFlowContext.jsx';
import { api } from '../api/client.js';
import { Wallet, ShieldCheck, Loader2 } from 'lucide-react';

export default function Payment() {
  const { flow, update } = useDeckFlow();
  const navigate = useNavigate();
  const [status, setStatus] = useState('idle'); // idle | requesting-402 | paying | verifying | done | error
  const [price, setPrice] = useState({ amount: '0.5', asset: 'ALGO', network: 'Algorand MainNet' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!flow.analysisId) {
      navigate('/upload');
      return;
    }
    // Step 1: ask backend to generate — it responds 402 Payment Required (x402)
    // with the price + payment address, per the x402 protocol.
    setStatus('requesting-402');
    api.generate(flow.analysisId).then(async (res) => {
      if (res.status === 402) {
        const body = await res.json();
        setPrice(body.price);
        setStatus('idle');
      } else if (res.ok) {
        // Already paid previously in this session
        const body = await res.json();
        update({ slides: body.slides, paid: true });
        navigate('/preview');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePay() {
    setError('');
    setStatus('paying');
    try {
      // Step 2: submit payment via Algorand wallet -> backend x402 endpoint
      const payRes = await api.payWithAlgorand(flow.analysisId, 'DEMO-WALLET-ADDRESS');
      setStatus('verifying');

      // Step 3: poll payment status until confirmed on-chain
      let confirmed = false;
      for (let i = 0; i < 10 && !confirmed; i++) {
        await new Promise((r) => setTimeout(r, 600));
        const s = await api.paymentStatus(payRes.txId);
        if (s.status === 'Success') confirmed = true;
      }
      if (!confirmed) throw new Error('Payment verification timed out. Please try again.');

      update({ paid: true, txId: payRes.txId });

      // Step 4: retry generate now that payment is verified
      const genRes = await api.generate(flow.analysisId);
      const genBody = await genRes.json();
      update({ slides: genBody.slides });
      setStatus('done');
      navigate('/preview');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  }

  return (
    <AppShell title="Payment Required" subtitle="This API is protected by x402. Please complete payment to generate your pitch deck.">
      <div className="card p-8 max-w-md">
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-white/50">Pitch Deck Generation</span>
          <ShieldCheck className="text-accent-light" size={18} />
        </div>

        <div className="font-display text-4xl font-semibold mb-1">
          {price.amount} <span className="text-lg text-white/50">{price.asset}</span>
        </div>
        <div className="text-xs text-white/40 mb-6">≈ $0.38 USD</div>

        <div className="space-y-3 text-sm mb-8">
          <div className="flex justify-between text-white/60">
            <span>Network</span>
            <span className="text-white">{price.network}</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Protocol</span>
            <span className="text-white">x402</span>
          </div>
          <div className="flex justify-between text-white/60">
            <span>Description</span>
            <span className="text-white">Pitch Deck Generation</span>
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={status === 'paying' || status === 'verifying'}
          className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {(status === 'paying' || status === 'verifying') && <Loader2 size={16} className="animate-spin" />}
          <Wallet size={16} />
          {status === 'paying' && 'Confirm in wallet…'}
          {status === 'verifying' && 'Verifying on Algorand…'}
          {(status === 'idle' || status === 'error') && 'Pay with Algorand Wallet'}
          {status === 'requesting-402' && 'Loading price…'}
        </button>

        {error && <p className="text-xs text-red-400 mt-4">{error}</p>}
        <p className="text-[11px] text-white/30 text-center mt-4">Secure payment via x402 protocol</p>
      </div>
    </AppShell>
  );
}
