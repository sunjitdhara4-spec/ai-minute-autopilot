export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Serve the existing index.html
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return new Response(
        `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AI MINUTE AUTOPILOT</title>
</head>
<body>
  <script>
    window.location.href = "/index.html";
  </script>
</body>
</html>`,
        {
          headers: {
            "Content-Type": "text/html; charset=UTF-8"
          }
        }
      );
    }

    // Health check
    if (url.pathname === "/api/health") {
      return Response.json({
        success: true,
        service: "AI MINUTE AUTOPILOT",
        status: "online"
      });
    }

    return Response.json({
      success: false,
      error: "API endpoint not found."
    }, { status: 404 });
  }
};