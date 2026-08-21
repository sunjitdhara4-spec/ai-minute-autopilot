const DEFAULT_CONFIG = {
  autopilot: false,
  videoType: "both",
  category: "AI & Technology",
  voice: "woman",
  frequency: "daily",
  uploadTime: "18:00",
  audience: "United States"
};

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // ---------------------------------------------
    // HEALTH
    // ---------------------------------------------

    if (url.pathname === "/api/health") {
      return json({
        success: true,
        service: "AI MINUTE AUTOPILOT",
        status: "online",
        version: "1.0.0"
      });
    }

    // ---------------------------------------------
    // FEATURES
    // ---------------------------------------------

    if (url.pathname === "/api/config" && request.method === "GET") {
      return json({
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

    // ---------------------------------------------
    // SAVE AUTOPILOT SETTINGS
    // ---------------------------------------------

    if (
      url.pathname === "/api/autopilot" &&
      request.method === "POST"
    ) {
      try {
        const body = await request.json();

        const config = {
          autopilot: Boolean(body.autopilot),

          videoType:
            String(body.videoType || DEFAULT_CONFIG.videoType),

          category:
            String(body.category || DEFAULT_CONFIG.category),

          voice:
            String(body.voice || DEFAULT_CONFIG.voice),

          frequency:
            String(body.frequency || DEFAULT_CONFIG.frequency),

          uploadTime:
            String(body.uploadTime || DEFAULT_CONFIG.uploadTime),

          audience:
            String(body.audience || DEFAULT_CONFIG.audience)
        };

        return json({
          success: true,
          message: config.autopilot
            ? "Autopilot activated."
            : "Autopilot disabled.",
          config
        });

      } catch (error) {
        return json({
          success: false,
          error: "Invalid configuration."
        }, 400);
      }
    }

    // ---------------------------------------------
    // CREATE JOB
    // ---------------------------------------------

    if (
      url.pathname === "/api/jobs" &&
      request.method === "POST"
    ) {
      try {
        const body = await request.json();

        const job = {
          id:
            "job_" +
            Date.now() +
            "_" +
            Math.random()
              .toString(36)
              .substring(2, 8),

          status: "queued",

          type:
            body.videoType || "both",

          category:
            body.category || "AI & Technology",

          voice:
            body.voice || "woman",

          audience:
            body.audience || "United States",

          scheduledTime:
            body.uploadTime || "18:00",

          createdAt:
            new Date().toISOString(),

          steps: {
            research: "waiting",
            script: "waiting",
            video: "waiting",
            voiceOver: "waiting",
            shorts: "waiting",
            analysis: "waiting",
            upload: "waiting"
          }
        };

        return json({
          success: true,
          message: "Autopilot job created.",
          job
        });

      } catch (error) {
        return json({
          success: false,
          error: "Could not create job."
        }, 400);
      }
    }

    // ---------------------------------------------
    // TEST AUTOPILOT
    // ---------------------------------------------

    if (
      url.pathname === "/api/autopilot/test" &&
      request.method === "POST"
    ) {
      const job = {
        id:
          "test_" +
          Date.now(),

        status: "queued",

        message:
          "Autopilot test job created successfully.",

        createdAt:
          new Date().toISOString(),

        pipeline: [
          "Research",
          "Content creation",
          "Video generation",
          "Voice-over",
          "Short generation",
          "Video analysis",
          "Scheduled YouTube upload"
        ]
      };

      return json({
        success: true,
        job
      });
    }

    return json({
      success: false,
      error: "API endpoint not found."
    }, 404);
  }
};