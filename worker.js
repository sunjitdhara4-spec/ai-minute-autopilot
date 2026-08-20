export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return Response.json({
        success: true,
        service: "AI MINUTE AUTOPILOT",
        status: "online"
      });
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

    return new Response(
      "AI MINUTE AUTOPILOT API is running.",
      {
        headers: {
          "Content-Type": "text/plain"
        }
      }
    );
  }
};