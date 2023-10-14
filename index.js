import { App } from "octokit";
import dotenv from "dotenv";
import express from "express";
import bot from "./bot.js";

dotenv.config();

const app = express();
app.use(express.json());

// Instantiate Github App
const bot = new App({
  appId: process.env.appId,
  privateKey: process.env.privateKey,
  oauth: {
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret,
  },
  webhooks: { secret: process.env.webhookSecret },
});

app.post("/", async (req, res) => {
  const {
    headers: { "x-github-event": name },
    body: payload,
  } = req;
  const octokit = await bot.getInstallationOctokit(payload.installation.id);
  bot(name, octokit, payload);
  console.info(`Received ${name} event from Github`);
  res.send("ok");
});

app.listen(process.env.PORT, () =>
  console.info(`App listening on PORT:${process.env.PORT}`)
);

const SmeeClient = require("smee-client");

const smee = new SmeeClient({
  source: process.env.smeeUrl,
  target: `http://localhost:${process.env.PORT}`,
  logger: console,
});

smee.start();
