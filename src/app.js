import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";

dotenv.config();

import { sendLog } from "./utils/sendLog.js";
import { logSchema } from "./validations/logs.validations.js";
import { allowedOrigins } from "./config/cors.js";

const fastify = Fastify();

await fastify.register(cors, {
  origin: allowedOrigins,
  methods: ["POST", "GET"],
  allowedHeaders: ["Content-Type"],
});

fastify.get("/", async (req, reply) => {
  reply.code(200).send({ message: "Welcome to the logging server!" });
});

fastify.post("/logs", async (req, reply) => {
  try {
    const result = logSchema.safeParse(req.body);

    if (!result.success) {
      return reply.status(400).send({ error: result.error.errors });
    }

    const { level, message, timestamp, url, userAgent, applicationName } =
      result.data;

    await sendLog({
      level,
      message,
      timestamp,
      url,
      userAgent,
      applicationName,
    });
    reply.code(200).send({
      success: true,
      error: null,
      message: "log added in papertrail successfully",
    });
  } catch (error) {
    console.error(error);
    reply.status(500).send({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3001;

fastify.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.info(`Server running at ${address}`);
});
