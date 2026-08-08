// Understands a README and extracts pitch-deck-ready content.
// Uses OpenAI or Gemini if an API key is configured; otherwise falls back
// to a simple rule-based extractor so the demo works without any keys.

async function analyzeWithOpenAI(readmeText) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            'You extract pitch-deck content from a README. Respond ONLY with JSON: ' +
            '{"title":"","problem":"","solution":"","features":["",""],"techStack":["",""],"market":""}'
        },
        { role: 'user', content: readmeText.slice(0, 12000) }
      ]
    })
  });
  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

async function analyzeWithGemini(readmeText) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  'Extract pitch-deck content from this README. Respond ONLY with JSON in the form ' +
                  '{"title":"","problem":"","solution":"","features":["",""],"techStack":["",""],"market":""}.\n\n' +
                  readmeText.slice(0, 12000)
              }
            ]
          }
        ]
      })
    }
  );
  const data = await res.json();
  const text = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '');
  return JSON.parse(text);
}

function analyzeWithRules(readmeText, filename) {
  const lines = readmeText.split('\n').map((l) => l.trim()).filter(Boolean);
  const titleLine = lines.find((l) => l.startsWith('# ')) || lines[0] || filename;
  const title = titleLine.replace(/^#+\s*/, '') || 'Untitled Project';

  const findSection = (keywords) => {
    const idx = lines.findIndex((l) =>
      keywords.some((k) => l.toLowerCase().includes(k))
    );
    if (idx === -1) return '';
    return lines.slice(idx + 1, idx + 4).join(' ').slice(0, 220);
  };

  const bulletList = () =>
    lines.filter((l) => /^[-*]\s+/.test(l)).slice(0, 6).map((l) => l.replace(/^[-*]\s+/, ''));

  return {
    title,
    problem: findSection(['problem', 'motivation', 'why']) || 'Problem statement extracted from README context.',
    solution: findSection(['solution', 'approach', 'how it works']) || 'Solution overview derived from project description.',
    features: bulletList().length ? bulletList() : ['Core feature 1', 'Core feature 2', 'Core feature 3'],
    techStack: (lines.find((l) => l.toLowerCase().includes('tech stack')) ? bulletList() : ['Node.js', 'React']).slice(0, 6),
    market: findSection(['market', 'audience', 'users']) || 'Target market derived from project context.'
  };
}

export async function analyzeReadme(readmeText, filename) {
  try {
    if (process.env.OPENAI_API_KEY) return await analyzeWithOpenAI(readmeText);
    if (process.env.GEMINI_API_KEY) return await analyzeWithGemini(readmeText);
  } catch (err) {
    console.warn('AI provider call failed, falling back to rule-based analysis:', err.message);
  }
  return analyzeWithRules(readmeText, filename);
}
