const express = require("express");

const app = express();

app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

// Home
app.get("/", (req, res) => {
  res.send("Revive Fitness WhatsApp Bot Running");
});

// Webhook Verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Function to send WhatsApp message
async function sendMessage(to, text) {
  await fetch(
    `https://graph.facebook.com/v23.0/${PHONE_NUMBER_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        text: {
          body: text,
        },
      }),
    }
  );
}

// Receive Messages
app.post("/webhook", async (req, res) => {
  try {
    const message =
      req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;
    const text = message.text?.body?.trim();

    let reply = "";

    switch (text) {
      case "1":
        reply =
`💪 MEMBERSHIP PLANS

✅ Monthly
✅ 3 Months
✅ 6 Months
✅ 12 Months

📞 Call: 7012500268`;
        break;

      case "2":
        reply =
`🕒 GYM TIMINGS

Morning
5:00 AM - 11:00 AM

Evening
4:00 PM - 11:00 PM`;
        break;

      case "3":
        reply =
`📍 LOCATION

Revive Fitness Center
Velliparamba, Calicut

📞 7012500268`;
        break;

      case "4":
        reply =
`🏋️ PERSONAL TRAINING

✅ Weight Loss
✅ Muscle Gain
✅ Fat Loss
✅ Strength Training

Available with certified trainers.`;
        break;

      case "5":
        reply =
`🎁 FREE TRIAL

Yes!

You can visit our gym and enjoy one FREE trial workout.

📞 7012500268`;
        break;

      case "6":
        reply =
`🔥 CURRENT OFFERS

Contact us for the latest membership offers.

📞 7012500268`;
        break;

      default:
        reply =
`🏋️ Welcome to Revive Fitness Center!

Please reply with a number:

1️⃣ Membership Plans
2️⃣ Gym Timings
3️⃣ Gym Location
4️⃣ Personal Training
5️⃣ Free Trial
6️⃣ Current Offers`;
    }

    await sendMessage(from, reply);

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
