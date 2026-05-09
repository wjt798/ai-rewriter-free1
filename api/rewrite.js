export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      result: "Method not allowed"
    });
  }

  try {

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        result: "No text provided"
      });
    }

    const response = await fetch(
      "https://api.deepseek.com/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            {
              role: "user",
              content:
`You are a professional AI rewriting assistant.

Rewrite the following text naturally, fluently, and clearly while preserving the original meaning and language.

Rules:
- Keep the same language
- Improve clarity
- Make it human-like
- Do not explain anything
- Only return the rewritten text

Text:
${text}`
            }
          ]
        })
      }
    );

    const data = await response.json();

    const result =
      data.choices?.[0]?.message?.content ||
      "API Error";

    return res.status(200).json({
      result
    });

  } catch (error) {

    return res.status(500).json({
      result: "Server Error"
    });

  }

}
