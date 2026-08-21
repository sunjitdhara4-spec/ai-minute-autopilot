function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Health
    if (url.pathname === "/api/health") {
      return json({
        success: true,
        service: "AI MINUTE AUTOPILOT",
        status: "online",
        version: "2.0.0"
      });
    }

    // Create production job
    if (
      url.pathname === "/api/jobs" &&
      request.method === "POST"
    ) {
      try {
        const body = await request.json();

        const job = {
          id:
            "job_" +
            Date.now(),

          status: "processing",

          createdAt:
            new Date().toISOString(),

          settings: {
            videoType:
              body.videoType || "both",

            category:
              body.category || "AI & Technology",

            voice:
              body.voice || "woman",

            frequency:
              body.frequency || "daily",

            uploadTime:
              body.uploadTime || "18:00",

            audience:
              body.audience || "United States"
          },

          pipeline: {
            research: "processing",
            content: "waiting",
            video: "waiting",
            voiceOver: "waiting",
            shorts: "waiting",
            analysis: "waiting",
            upload: "waiting"
          }
        };

        return json({
          success: true,
          message:
            "Autopilot started processing the job.",
          job
        });

      } catch (error) {
        return json({
          success: false,
          error: error.message
        }, 400);
      }
    }

    // Autopilot test
    if (
      url.pathname === "/api/autopilot/test" &&
      request.method === "POST"
    ) {
      return json({
        success: true,

        job: {
          id:
            "test_" +
            Date.now(),

          status: "processing",

          message:
            "Autopilot pipeline started.",

          pipeline: [
            "Research",
            "Content creation",
            "Video generation",
            "Voice-over",
            "Short generation",
            "Video analysis",
            "Scheduled YouTube upload"
          ]
        }
      });
    }

    // Save configuration
    if (
      url.pathname === "/api/autopilot" &&
      request.method === "POST"
    ) {
      try {
        const body = await request.json();

        return json({
          success: true,

          message:
            body.autopilot
              ? "Autopilot activated."
              : "Autopilot disabled.",

          config: body
        });

      } catch (error) {
        return json({
          success: false,
          error: "Invalid configuration."
        }, 400);
      }
    }

    return json({
      success: false,
      error: "API endpoint not found."
    }, 404);
  }
};