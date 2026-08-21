function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "Content-Type": "application/json",
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

    // =========================================
    // HEALTH
    // =========================================

    if (url.pathname === "/api/health") {
      return json({
        success: true,
        service: "AI MINUTE AUTOPILOT",
        status: "online",
        version: "5.0.0"
      });
    }


    // =========================================
    // CONFIG
    // =========================================

    if (url.pathname === "/api/config") {
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
        },

        voices: [
          "girl",
          "boy",
          "man",
          "woman"
        ],

        videoTypes: [
          "long",
          "short",
          "both"
        ]
      });
    }


    // =========================================
    // AUTOPILOT SETTINGS
    // =========================================

    if (
      url.pathname === "/api/autopilot" &&
      request.method === "POST"
    ) {

      try {

        const settings =
          await request.json();

        return json({
          success: true,

          message:
            settings.autopilot
              ? "Autopilot activated."
              : "Autopilot disabled.",

          settings
        });

      } catch (error) {

        return json({
          success: false,
          error: "Invalid autopilot settings."
        }, 400);

      }
    }


    // =========================================
    // CREATE PRODUCTION JOB
    // =========================================

    if (
      (
        url.pathname === "/api/jobs" ||
        url.pathname === "/api/create-job" ||
        url.pathname === "/api/production-job"
      ) &&
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
            "Production job created.",

          job
        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 400);

      }
    }


    // =========================================
    // TEST JOB
    // =========================================

    if (
      (
        url.pathname === "/api/autopilot/test" ||
        url.pathname === "/api/test-job"
      ) &&
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
        message: "Autopilot test started.",
        job
      });
    }


    // =========================================
    // VOICEOVER
    // =========================================

    if (
      url.pathname === "/api/voiceover" &&
      request.method === "POST"
    ) {

      try {

        const body =
          await request.json();

        const text =
          String(body.text || "").trim();

        const voice =
          String(
            body.voice || "woman"
          ).toLowerCase();

        if (!text) {

          return json({
            success: false,
            error: "Text is required."
          }, 400);

        }

        const allowedVoices = [
          "girl",
          "boy",
          "man",
          "woman"
        ];

        if (!allowedVoices.includes(voice)) {

          return json({
            success: false,
            error:
              "Invalid voice."
          }, 400);

        }

        return json({
          success: true,

          status: "queued",

          voiceJob: {
            id: "voice_" + Date.now(),
            voice,
            textLength: text.length,
            status: "waiting_for_voice_provider"
          }
        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 400);

      }
    }


    // =========================================
    // VIDEO CREATION
    // =========================================

    if (
      url.pathname === "/api/video/create" &&
      request.method === "POST"
    ) {

      try {

        const body =
          await request.json();

        const topic =
          String(body.topic || "").trim();

        if (!topic) {

          return json({
            success: false,
            error: "Topic is required."
          }, 400);

        }

        return json({
          success: true,

          status: "queued",

          videoJob: {
            id: "video_" + Date.now(),
            topic,
            type: body.videoType || "long",
            status: "waiting_for_video_provider"
          }
        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 400);

      }
    }


    // =========================================
    // SHORT CREATION
    // =========================================

    if (
      url.pathname === "/api/short/create" &&
      request.method === "POST"
    ) {

      try {

        const body =
          await request.json();

        return json({
          success: true,

          status: "queued",

          shortJob: {
            id: "short_" + Date.now(),
            source: body.source || "",
            status: "waiting_for_video_provider"
          }
        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 400);

      }
    }


    // =========================================
    // VIDEO ANALYSIS
    // =========================================

    if (
      url.pathname === "/api/video/analyze" &&
      request.method === "POST"
    ) {

      return json({
        success: true,

        analysis: {
          id: "analysis_" + Date.now(),
          status: "queued",
          message: "Video analysis request accepted."
        }
      });
    }


    // =========================================
    // YOUTUBE UPLOAD
    // =========================================

    if (
      url.pathname === "/api/youtube/upload" &&
      request.method === "POST"
    ) {

      return json({
        success: true,

        upload: {
          id: "upload_" + Date.now(),
          status: "waiting_for_youtube_oauth"
        },

        message:
          "YouTube upload request accepted."
      });
    }


    // =========================================
    // SCHEDULER
    // =========================================

    if (
      url.pathname === "/api/scheduler" &&
      request.method === "GET"
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


    // =========================================
    // ROOT
    // =========================================

    if (url.pathname === "/") {

      return json({
        success: true,
        service: "AI MINUTE AUTOPILOT",
        status: "online",
        version: "5.0.0"
      });
    }


    // =========================================
    // NOT FOUND
    // =========================================

    return json({
      success: false,
      error: "API endpoint not found.",
      path: url.pathname,
      method: request.method
    }, 404);
  },


  // =========================================
  // CLOUDFLARE CRON
  // =========================================

  async scheduled(controller, env, ctx) {

    console.log(
      "AI MINUTE AUTOPILOT scheduler executed:",
      new Date(
        controller.scheduledTime
      ).toISOString()
    );

  }

};