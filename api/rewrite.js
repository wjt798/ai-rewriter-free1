export default async function handler(req,res){

if(req.method !== "POST"){

return res.status(405).json({
result:"Method not allowed"
});

}

try{

const { text, mode } = req.body;

if(!text){

return res.status(400).json({
result:"No text provided"
});

}

let prompt = "";

if(mode === "academic"){

prompt = `
Rewrite this text in a professional academic style.

Requirements:
- Formal tone
- Scholarly wording
- Improve clarity
- Better structure
- Human sounding
- Keep original meaning

Text:
${text}
`;

}

else if(mode === "seo"){

prompt = `
Rewrite this text for SEO optimization.

Requirements:
- Engaging
- Keyword rich
- Human sounding
- Improve readability
- Professional marketing style
- Strong hook
- Better flow

Text:
${text}
`;

}

else if(mode === "bypass"){

prompt = `
Rewrite this content to bypass AI detectors.

Requirements:
- Extremely human sounding
- Natural imperfections
- Vary sentence lengths
- Conversational tone
- Remove robotic patterns
- Humanize heavily
- Keep meaning

Text:
${text}
`;

}

else if(mode === "translate"){

prompt = `
Translate this naturally into English.

Text:
${text}
`;

}

else if(mode === "social"){

prompt = `
Turn this into a viral social media post.

Requirements:
- Hook
- Emotional
- Short paragraphs
- Strong CTA
- Human tone
- Engaging

Text:
${text}
`;

}

else if(mode === "title"){

prompt = `
Generate 10 catchy titles for this content.

Text:
${text}
`;

}

else{

prompt = `
Rewrite this naturally and fluently.

Requirements:
- Human sounding
- Improve quality
- More engaging
- Natural flow
- Keep meaning
- Avoid AI sounding

Text:
${text}
`;

}

const response = await fetch(
"https://api.deepseek.com/chat/completions",
{
method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":
`Bearer ${process.env.DEEPSEEK_API_KEY}`
},

body:JSON.stringify({

model:"deepseek-chat",

temperature:1.2,

max_tokens:1200,

messages:[

{
role:"system",
content:`
You are an advanced AI rewriting assistant.

Goals:
- Sound fully human
- Avoid AI detection
- Write naturally
- Improve readability
- Add richness and emotion
- Use varied sentence structures
- Avoid robotic wording
`
},

{
role:"user",
content:prompt
}

]

})

}

);

const data =
await response.json();

const result =
data.choices?.[0]?.message?.content ||
"AI rewrite failed";

return res.status(200).json({
result
});

}
catch(error){

return res.status(500).json({
result:error.message
});

}

}
