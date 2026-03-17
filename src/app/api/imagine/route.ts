import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, personaName } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // Grab the last few messages to understand the memory context
    const recentMessages = messages.slice(-4).map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join('\n');

    // Create a prompt summarizing the context to generate an image
    const imagePromptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert prompt engineer for an image generation model. Based on the following recent conversation with a person named ${personaName}, write a short, highly descriptive image prompt (max 50 words) that visualizes the specific memory or scenario they are discussing. If no specific memory is mentioned, visualize a warm, nostalgic portrait of them in a setting that makes sense for the persona. DO NOT include text in the image.`,
          },
          {
            role: 'user',
            content: recentMessages,
          },
        ],
      }),
    });

    const promptData = await imagePromptResponse.json();
    const generatedPrompt = promptData.choices[0].message.content;

    // Use DALL-E 3 to generate the image
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: generatedPrompt,
        n: 1,
        size: '1024x1024',
      }),
    });

    const imageData = await imageResponse.json();

    if (imageData.error) {
      console.error('Image Gen Error:', imageData.error);
      return NextResponse.json({ error: imageData.error.message }, { status: 500 });
    }

    return NextResponse.json({ imageUrl: imageData.data[0].url, prompt: generatedPrompt });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
