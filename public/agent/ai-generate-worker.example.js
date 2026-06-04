/**
 * MedSearch Zambia Agent AI endpoint example.
 *
 * Deploy this as a Cloudflare Worker, Vercel Function, Netlify Function,
 * Firebase Cloud Function, or any server endpoint you control.
 *
 * Browser -> this endpoint -> AI provider
 *
 * Keep OPENAI_API_KEY or any provider key server-side. Do not place it in
 * public/agent/index.html.
 */

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return corsResponse(null);
    }

    if (request.method !== 'POST') {
      return corsResponse({ error: 'Use POST.' }, 405);
    }

    const input = await request.json();
    const prompt = `
You are the MedSearch Zambia Facebook content agent.

Create one patient-safe Facebook post.

Topic: ${input.topic}
Language: ${input.language}
Campaign goal: ${input.goal}
Brand: ${input.brand}
Channel: ${input.channel}

Safety rules:
- Do not diagnose.
- Do not give medicine dosage instructions.
- Encourage qualified health professional care when relevant.
- Keep the tone warm, clear, credible and useful in Zambia.
- Mention MedSearch Zambia as a platform for finding medicines, pharmacies,
  health facilities, services, and verified providers.

Return JSON only with:
{
  "title": "...",
  "topic": "...",
  "audience": "...",
  "body": "...",
  "imagePrompt": "...",
  "safety": ["...", "...", "..."]
}
`;

    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: prompt,
      }),
    });

    if (!response.ok) {
      return corsResponse({ error: await response.text() }, response.status);
    }

    const data = await response.json();
    const text = data.output_text || data.output?.[0]?.content?.[0]?.text || '';
    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = {
        title: input.topic,
        topic: input.topic,
        audience: 'Public users',
        body: text,
        imagePrompt: `MedSearch Zambia health education image for ${input.topic}`,
        safety: ['AI generated', 'Human review required', 'Patient-safe wording'],
      };
    }

    return corsResponse(parsed);
  },
};

function corsResponse(body, status = 200) {
  return new Response(body ? JSON.stringify(body) : null, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
