import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { title, body, choices } = await req.json();

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ summary: 'AI summaries require an OpenAI API key (not configured).' });
  }

  try {
    const prompt = `You are a DAO governance analyst. Summarize this proposal clearly and concisely for a token holder who needs to decide how to vote.

Proposal Title: ${title}

Voting Options: ${choices?.join(', ') || 'For / Against'}

Proposal Text:
${body?.slice(0, 2500) || 'No body provided'}

Provide a structured summary with:
1. WHAT: What is being proposed (1-2 sentences)
2. WHY: The key reason/motivation (1-2 sentences)  
3. IMPACT: What happens if it passes vs fails (1-2 sentences)
4. CONSIDERATIONS: Any concerns or tradeoffs to be aware of (1 sentence)

Keep the total response under 200 words. Be direct and jargon-free.`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 350,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('OpenAI error:', err);
      return NextResponse.json({ summary: 'AI summary temporarily unavailable.' });
    }

    const data = await res.json();
    const summary = data.choices?.[0]?.message?.content || 'Unable to generate summary.';

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summarize error:', error);
    return NextResponse.json({ summary: 'AI summary temporarily unavailable.' });
  }
}
