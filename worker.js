function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store"
    }
  });
}

function createJob(settings = {}) {
  return {
    id: "job_" + Date.now(),

    status: "processing",

    createdAt: new Date().toISOString(),

    settings: {
      videoType: settings.videoType || "both",
      category: settings.category || "AI & Technology",
      voice: settings.voice || "woman",
      frequency: settings.frequency || "daily",
      uploadTime: settings.uploadTime || "18:00",
      audience: settings.audience || "United States"
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
}

export default {

  async fetch(request, env) {

    const url = new URL(request.url);

    // -----------------------------
    // HEALTH
    // -----------------------------

    if (url.pathname === "/api/health") {

      return json({
        success: true,
        service: "AI MINUTE AUTOPILOT",
        status: "online",
        version: "3.0.0"
      });

    }

    // -----------------------------
    // AUTOPILOT SETTINGS
    // -----------------------------

    if (
      url.pathname === "/api/autopilot" &&
      request.method === "POST"
    ) {

      try {

        const settings = await request.json();

        return json({
          success: true,

          message:
            settings.autopilot
              ? "Autopilot activated."
              : "Autopilot disabled.",

          settings

        });

      } catch {

        return json({
          success: false,
          error: "Invalid settings."
        }, 400);

      }

    }

    // -----------------------------
    // CREATE PRODUCTION JOB
    // -----------------------------

    if (
      url.pathname === "/api/jobs" &&
      request.method === "POST"
    ) {

      try {

        const settings =
          await request.json();

        const job =
          createJob(settings);

        return json({
          success: true,
          message:
            "Autopilot job started.",
          job
        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 400);

      }

    }

    // -----------------------------
    // TEST JOB
    // -----------------------------

    if (
      url.pathname === "/api/autopilot/test" &&
      request.method === "POST"
    ) {

      const job =
        createJob({
          videoType: "short",
          category: "AI & Technology",
          voice: "girl",
          frequency: "daily",
          uploadTime: "18:00",
          audience: "United States"
        });

      return json({
        success: true,
        message:
          "Autopilot test started.",
        job
      });

    }

    // -----------------------------
    // SCHEDULE STATUS
    // -----------------------------

    if (
      url.pathname === "/api/scheduler"
    ) {

      return json({
        success: true,

        scheduler: {
          enabled: true,
          type: "Cloudflare Cron",
          status: "ready",

          pipeline: [
            "Research",
            "Content",
            "Video",
            "Voice-over",
            "Shorts",
            "Analysis",
            "YouTube upload"
          ]
        }
      });

    }

    return json({
      success: false,
      error: "API endpoint not found."
    }, 404);

  },


  // --------------------------------
  // AUTOMATIC SCHEDULED EXECUTION
  // --------------------------------

  async scheduled(controller, env, ctx) {

    console.log(
      "AI MINUTE AUTOPILOT scheduler executed:",
      new Date(
        controller.scheduledTime
      ).toISOString()
    );

    // This is the scheduler.
    // Actual video generation will be
    // connected in the next stage.

  }

};