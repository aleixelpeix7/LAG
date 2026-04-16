exports.handler = async (event, context) => {
  const referer = event.headers.referer || "unknown";
  const ua = event.headers["user-agent"] || "unknown";
  const ip = event.headers["client-ip"] || event.headers["x-forwarded-for"] || "unknown";

  // Guarda-ho en un servei gratuït com JSONBin
  await fetch("https://api.jsonbin.io/v3/b", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": process.env.JSONBIN_KEY
    },
    body: JSON.stringify({
      timestamp: Date.now(),
      referer,
      ua,
      ip
    })
  });

  // Retorna un pixel transparent
  return {
    statusCode: 200,
    headers: { "Content-Type": "image/png" },
    body: Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/axuE9kAAAAASUVORK5CYII=",
      "base64"
    ).toString("base64"),
    isBase64Encoded: true
  };
};
