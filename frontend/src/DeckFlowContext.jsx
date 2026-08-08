import React, { createContext, useContext, useState } from 'react';

const DeckFlowContext = createContext(null);

export function DeckFlowProvider({ children }) {
  const [flow, setFlow] = useState({
    uploadId: null,
    filename: null,
    theme: 'Startup',
    analysisId: null,
    analysis: null,       // { title, problem, solution, features, techStack, market }
    paid: false,
    txId: null,
    slides: null
  });

  const update = (patch) => setFlow((f) => ({ ...f, ...patch }));
  const reset = () =>
    setFlow({
      uploadId: null,
      filename: null,
      theme: 'Startup',
      analysisId: null,
      analysis: null,
      paid: false,
      txId: null,
      slides: null
    });

  return (
    <DeckFlowContext.Provider value={{ flow, update, reset }}>
      {children}
    </DeckFlowContext.Provider>
  );
}

export function useDeckFlow() {
  const ctx = useContext(DeckFlowContext);
  if (!ctx) throw new Error('useDeckFlow must be used inside DeckFlowProvider');
  return ctx;
}
