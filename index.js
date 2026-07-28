const express = require("express");

const app = express();

const VERIFY_TOKEN = "revivefitness2026";

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Revive Fitness Bot Running");
});

// Webhook verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook Verified!");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Receive messages
app.post("/webhook", (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
