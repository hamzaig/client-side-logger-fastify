import Fastify from "fastify";
import { sendLog } from "./utils/sendLog.js";

const fastify = Fastify();

fastify.get("/", async (req, reply) => {
  return { message: "Hello world!" };
});

fastify.post("/log", async (req, reply) => {
  try {
    const { level, url, message, userAgent, timestamp } = req.body;
    if (!level || !message || !timestamp) {
      return reply.status(400).send({ error: "Missing required fields" });
    }
    const log = {
      level,
      message,
      timestamp: new Date(timestamp),
    };

    await sendLog(log);
  } catch (error) {}
});

fastify.listen({ port: 8080 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.info(`Server running at ${address}`);
});
