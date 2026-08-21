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

    if (url.pathname === "/api/autopilot") {
      if (request.method !== "POST") {
        return Response.json(
          {
            success: false,
            error: "POST required"
          },
          { status: 405 }
        );
      }

      try {
        const data = await request.json();

        return Response.json({
          success: true,
          message: "Autopilot configuration received.",
          autopilot: data
        });

      } catch (error) {
        return Response.json(
          {
            success: false,
            error: "Invalid request."
          },
          { status: 400 }
        );
      }
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