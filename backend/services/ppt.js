import PptxGenJS from 'pptxgenjs';
import fs from 'fs';
import path from 'path';

const THEMES = {
  Startup: { bg: '0B0B14', accent: '7C5CFF', text: 'FFFFFF' },
  Academic: { bg: 'FFFFFF', accent: '1D4ED8', text: '111111' },
  Corporate: { bg: '0F172A', accent: '38BDF8', text: 'FFFFFF' }
};

// Turns the AI analysis JSON into the 7-slide structure from the spec:
// Project Name / Problem / Solution / Features / Architecture / Business Model / Future Scope
export function buildSlideDeckModel(analysis) {
  return [
    { title: analysis.title, body: 'AI-generated pitch deck' },
    { title: 'Problem', body: analysis.problem },
    { title: 'Solution', body: analysis.solution },
    { title: 'Features', body: (analysis.features || []).join('  ·  ') },
    { title: 'Architecture', body: (analysis.techStack || []).join('  ·  ') },
    { title: 'Business Model', body: 'Freemium with pay-per-generation via x402, priced in ALGO.' },
    { title: 'Future Scope', body: analysis.market || 'Expand to broader developer and startup markets.' }
  ];
}

export async function renderPptx(analysis, theme, outDir) {
  const t = THEMES[theme] || THEMES.Startup;
  const model = buildSlideDeckModel(analysis);
  const pptx = new PptxGenJS();

  model.forEach((slide) => {
    const s = pptx.addSlide();
    s.background = { color: t.bg };
    s.addText(slide.title, {
      x: 0.6, y: 0.6, w: 9, h: 1,
      fontSize: 32, bold: true, color: t.accent, fontFace: 'Arial'
    });
    s.addText(slide.body || '', {
      x: 0.6, y: 1.8, w: 9, h: 3,
      fontSize: 16, color: t.text, fontFace: 'Arial'
    });
  });

  fs.mkdirSync(outDir, { recursive: true });
  const filePath = path.join(outDir, 'deck.pptx');
  await pptx.writeFile({ fileName: filePath });
  return filePath;
}
