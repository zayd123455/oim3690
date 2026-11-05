// Save this file as api/ask.js: make a folder named api in the root folder of
// your repo, and put this file in it. Vercel runs every file in api/ on its
// server, so your page can call this one at /api/ask.

export default {
  async fetch(request) {
    // The prompt your page sent in the request body.
    const { prompt } = await request.json();

    // The key is shared by the whole class, so refuse anything that is not text,
    // or longer than a pasted syllabus, before spending on it.
    if (typeof prompt !== "string" || prompt.trim() === "" || prompt.length > 60000) {
      return Response.json({ error: "Send a prompt of up to 60,000 characters." }, { status: 400 });
    }

    const response = await fetch("https://openrouter.ai/api/v1/responses", {
      method: "POST",
      headers: {
        // The key comes from Vercel's settings (Settings > Environment Variables),
        // never from a file in your repo.
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // The course key works with this model only.
        model: "deepseek/deepseek-v4.1-flash-1017",
        // The longest answer you pay for, in tokens (about three quarters of a
        // word each). A longer answer is cut off at this point.
        max_output_tokens: 2000,
        // Skip the thinking step, or a short question can spend the whole
        // limit on reasoning and come back with no message (slide 10).
        reasoning: { effort: "none" },
        // Standing rules for every answer. They live here in the function, so a
        // visitor cannot change them (but the model can repeat them if asked).
        instructions: "You are Desk, the assistant on Zayd's Paper Trader site. "
          + "You talk like a sharp friend on a trading desk: plain words, short sentences, no hype. "
          + "Answer in at most four sentences. If the question is about markets or trading, "
          + "explain the idea and the risk, never tell the user what to buy. "
          + "If you do not know, say so in one line.",
        input: prompt
      })
    });

    // Send the model's reply back to your page as it arrived.
    const data = await response.json();
    return Response.json(data, { status: response.status });
  },
};
