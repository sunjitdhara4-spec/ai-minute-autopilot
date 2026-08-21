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

    // =========================================
    // HEALTH
    // =========================================

    if (url.pathname === "/api/health") {

      return json({
        success: true,
        service: "AI MINUTE AUTOPILOT",
        status: "online",
        version: "4.0.0"
      });

    }


    // =========================================
    // AUTOPILOT CONFIGURATION
    // =========================================

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

          settings: {
            autopilot:
              Boolean(settings.autopilot),

            videoType:
              settings.videoType || "both",

            category:
              settings.category || "AI & Technology",

            voice:
              settings.voice || "woman",

            frequency:
              settings.frequency || "daily",

            uploadTime:
              settings.uploadTime || "18:00",

            audience:
              settings.audience || "United States"
          }
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


    // =========================================
    // TEST AUTOPILOT
    // =========================================

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


    // =========================================
    // VOICEOVER REQUEST
    // =========================================

    if (
      url.pathname === "/api/voiceover" &&
      request.method === "POST"
    ) {

      try {

        const body =
          await request.json();

        const text =
          String(
            body.text || ""
          ).trim();

        const voice =
          String(
            body.voice || "woman"
          ).trim().toLowerCase();


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


        if (
          !allowedVoices.includes(voice)
        ) {

          return json({
            success: false,

            error:
              "Invalid voice. Choose girl, boy, man or woman."
          }, 400);

        }


        return json({

          success: true,

          status: "queued",

          voiceJob: {

            id:
              "voice_" +
              Date.now(),

            voice: voice,

            textLength:
              text.length,

            status:
              "waiting_for_voice_provider"

          },

          message:
            "Voice-over request accepted."

        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 400);

      }

    }


    // =========================================
    // VIDEO CREATION REQUEST
    // =========================================

    if (
      url.pathname === "/api/video/create" &&
      request.method === "POST"
    ) {

      try {

        const body =
          await request.json();

        const topic =
          String(
            body.topic || ""
          ).trim();

        const videoType =
          String(
            body.videoType || "long"
          );

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

            id:
              "video_" +
              Date.now(),

            topic: topic,

            type: videoType,

            status:
              "waiting_for_video_provider"

          },

          message:
            "Video creation request accepted."

        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 400);

      }

    }


    // =========================================
    // SHORT CREATION REQUEST
    // =========================================

    if (
      url.pathname === "/api/short/create" &&
      request.method === "POST"
    ) {

      try {

        const body =
          await request.json();

        const source =
          String(
            body.source || ""
          ).trim();


        if (!source) {

          return json({
            success: false,
            error: "Source video is required."
          }, 400);

        }


        return json({

          success: true,

          status: "queued",

          shortJob: {

            id:
              "short_" +
              Date.now(),

            source: source,

            status:
              "waiting_for_video_provider"

          },

          message:
            "Short creation request accepted."

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

      try {

        const body =
          await request.json();

        const video =
          String(
            body.video || ""
          ).trim();


        if (!video) {

          return json({
            success: false,
            error: "Video is required."
          }, 400);

        }


        return json({

          success: true,

          analysis: {

            status: "queued",

            video: video,

            message:
              "Video analysis request accepted."

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
    // YOUTUBE UPLOAD REQUEST
    // =========================================

    if (
      url.pathname === "/api/youtube/upload" &&
      request.method === "POST"
    ) {

      try {

        const body =
          await request.json();

        const video =
          String(
            body.video || ""
          ).trim();


        if (!video) {

          return json({
            success: false,
            error: "Video is required."
          }, 400);

        }


        return json({

          success: true,

          upload: {

            id:
              "upload_" +
              Date.now(),

            status:
              "waiting_for_youtube_oauth",

            video: video

          },

          message:
            "YouTube upload request accepted."

        });

      } catch (error) {

        return json({
          success: false,
          error: error.message
        }, 400);

      }

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

          type:
            "Cloudflare Cron",

          status:
            "ready",

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
    // NOT FOUND
    // =========================================

    return json({

      success: false,

      error:
        "API endpoint not found."

    }, 404);

  },


  // =========================================
  // CRON AUTOPILOT
  // =========================================

  async scheduled(
    controller,
    env,
    ctx
  ) {

    console.log(
      "AI MINUTE AUTOPILOT scheduler executed:",
      new Date(
        controller.scheduledTime
      ).toISOString()
    );

  }

};