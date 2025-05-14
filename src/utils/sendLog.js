import dgram from "dgram";
import dotenv from "dotenv";

dotenv.config();

const HOST = process.env.PAPERTRAIL_HOST;
const PORT = process.env.PAPERTRAIL_PORT;

export function sendLog({
  level = "INFO",
  message = "",
  url = "",
  userAgent = "",
  timestamp = new Date().toISOString(),
  applicationName,
}) {
  const logString = `<22>${applicationName}: [${level}] ${message} at ${timestamp} | URL: ${url} | Agent: ${userAgent}`;

  return new Promise((resolve, reject) => {
    if (!HOST || !PORT) {
      console.error("Papertrail host or port not set");
      return reject(new Error("Papertrail host or port not set"));
    }
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
