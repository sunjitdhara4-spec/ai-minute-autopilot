const GROQ_URL =
  "https://api.groq.com/openai/v1/chat/completions";

const GROQ_MODEL =
  "llama-3.3-70b-versatile";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        success: true,
        service: "AI MINUTE AUTOPILOT",
        status: "online"
      });
    }

    if (
      url.pathname === "/api/generate-script" &&
      request.method === "POST"
    ) {
      try {
        const body = await request.json();
        const topic = String(body.topic || "").trim();

        if (!topic) {
          return Response.json(
            {
              success: false,
              error: "Topic is required."
            },
            { status: 400 }
          );
        }

        if (!env.GROQ_API_KEY) {
          return Response.json(
            {
              success: false,
              error: "GROQ_API_KEY is not configured."
            },
            { status: 500 }
          );
        }

        const prompt = `
Create a YouTube video script.

Target audience:
United States.

Topic:
${topic}

Requirements:
- Natural American English
- Strong first 10 seconds
- Clear structure
- Interesting and useful
- Do not invent statistics
- Do not invent sources
- Include a natural conclusion
- Include a short call to action
- Return only the spoken narration.
`;

        const response = await fetch(
          GROQ_URL,
          {
            method: "POST",

            headers: {
              "Authorization":
                "Bearer " + env.GROQ_API_KEY,
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              model: GROQ_MODEL,

              messages: [
                {
                  role: "system",
                  content:
                    "You are an expert YouTube scriptwriter."
                },
                {
                  role: "user",
                  content: prompt
                }
              ],

              temperature: 0.7,
              max_tokens: 4000
            })
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return Response.json(
            {
              success: false,
              error:
                data?.error?.message ||
                "Groq API request failed."
            },
            { status: 500 }
          );
        }

        const script =
          data?.choices?.[0]?.message?.content || "";

        return Response.json({
          success: true,
          topic: topic,
          script: script
        });

      } catch (error) {
        return Response.json(
          {
            success: false,
            error: error.message
          },
          { status: 500 }
        );
      }
    }

    if (url.pathname === "/api/config") {
      return Response.json({
        success: true,
        features: {
          autopilot: true,
          videoCreation: true,
          shorts: true,
          voiceOver: true,
          videoAnalysis: true,
          scheduling: true,
          youtubeUpload: true
        }
      });
    }

    return Response.json(
      {
        success: false,
        error: "API endpoint not found."
      },
      { status: 404 }
    );
  }
};