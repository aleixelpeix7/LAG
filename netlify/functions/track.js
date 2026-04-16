exports.handler = async (event, context) => {
  const BIN_ID = "69e0a46a856a6821893d4e93"; // <-- posa aquí el teu Bin ID

  const referer = event.headers.referer || "unknown";
  const ua = event.headers["user-agent"] || "unknown";
  const ip = event.headers["client-ip"] || event.headers["x-forwarded-for"] || "unknown";

  // 1. Llegir el contingut actual del Bin
  const current = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
    headers: {
      "X-Master-Key": process.env.JSONBIN_KEY
    }
  }).then(r => r.json());

  // 2. Afegir la nova visita
  const newVisit = {
    timestamp: Date.now(),
    referer,
    ua,
    ip
  };

  current.record.visits.push(newVisit);

  // 3. Guardar el Bin actualitzat
  await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Master-Key": process.env.JSONBIN_KEY
    },
    body: JSON.stringify(current.record)
  });

  // 4. Retornar el pixel transparent
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
