export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      result: "Method not allowed"
    });
  }

  try {

    const { text, mode } = req.body;

    if (!text || text.trim() === "") {

      return res.status(400).json({
        result: "No text provided"
      });

    }

    let prompt = "";

    // =========================
    // Academic Mode
    // =========================

    if (mode === "academic") {

      prompt = `
Rewrite this text in a professional academic style.

Requirements:
- Use formal academic language
- Improve clarity and coherence
- Improve sentence structure
- Sound scholarly and intelligent
- Keep original meaning
- Use advanced vocabulary naturally
`;

    }

    // =========================
    // SEO Mode
    // =========================

    else if (mode === "seo") {

      prompt = `
Rewrite this text for SEO optimization.

Requirements:
- Improve readability
- Make content engaging
- Improve structure
- Use powerful wording
- Sound professional
- Improve flow naturally
- Make it more attractive for readers
`;

    }

    // =========================
    // Humanizer Mode
    // =========================

    else if (mode === "humanizer") {

      prompt = `
Rewrite this text to sound completely human.

Requirements:
- Use conversational tone
- Avoid robotic wording
- Sound natural and emotional
- Add human rhythm
- Improve engagement
- Make it feel handwritten
`;

    }

    // =========================
    // Normal Mode
    // =========================

    else {

      prompt = `
Rewrite this text naturally and fluently.

Requirements:
- Improve readability
- Improve wording
- Keep original meaning
- Sound natural
`;

    }

    // =========================
    // DeepSeek API Request
    // =========================

    const response = await fetch(
      "https://api.deepseek.com/chat/completions",
      {

        method: "POST",

        headers: {
          "Content-Type": "application/json",

          "Authorization":
          `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },

        body: JSON.stringify({

          model: "deepseek-chat",

          temperature: 1.15,

          max_tokens: 1200,

          messages: [

            // =========================
            // System Prompt
            // =========================

            {
              role: "system",

              content: `
You are an advanced AI rewriting assistant.

Your goals:
- Rewrite naturally
- Sound fully human
- Improve clarity
- Improve readability
- Improve flow
- Avoid robotic AI wording
- Preserve original meaning
- Make writing more engaging

You should write like a professional human writer.

IMPORTANT:
- Never mention AI
- Never explain policies
- Never say "Here is the rewritten version"
- Do not sound robotic

After rewriting also provide:

1. Tone Analysis
2. Improvements Made
3. Alternative Version

Output format EXACTLY:

=== Rewritten Version ===
(text)

=== Tone Analysis ===
(text)

=== Improvements Made ===
- item
- item

=== Alternative Version ===
(text)
`
            },

            // =========================
            // User Prompt
            // =========================

            {
              role: "user",

              content: `
${prompt}

Text:
${text}
`
            }

          ]

        })

      }
    );

    // =========================
    // Parse DeepSeek Response
    // =========================

    const data = await response.json();

    const result =
      data.choices?.[0]?.message?.content ||
      "AI rewrite failed.";

    // =========================
    // Return Result
    // =========================

    return res.status(200).json({
      result
    });

  }

  // =========================
  // Error Handling
  // =========================

  catch (error) {

    return res.status(500).json({

      result:
      "Server error: " + error.message

    });

  }

}
