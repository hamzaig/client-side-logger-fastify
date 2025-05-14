import dgram from "dgram";

const HOST = "logs3.papertrailapp.com";
const PORT = 49671;

export function sendLog({
  level = "INFO",
  message = "",
  url = "",
  userAgent = "",
  timestamp = new Date().toISOString(),
}) {
  const logString = `<22>${TAG}: [${level}] ${message} at ${timestamp} | URL: ${url} | Agent: ${userAgent}`;

  return new Promise((resolve, reject) => {
    const client = dgram.createSocket("udp4");
    client.send(logString, PORT, HOST, (err) => {
      client.close();
      if (err) {
        console.error("Log error:", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
