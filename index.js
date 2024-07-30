const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json()); 
const PORT = process.env.PORT;


app.get('/', (req, res) => {
    res.send('Home');
});

app.get('/webhook', (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.WEBHOOK_SUBS_TOKEN) {
      console.log("WEBHOOK VERIFIED");
      res
      .status(200)
      .send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

app.post('/webhook', (req, res) => {
  const body = req.body;
  console.log('Received webhook:', body);

  if (body.object === 'instagram') {
      body.entry.forEach(entry => {
          entry.messaging.forEach(event => {
              if (event.message && event.message.text) {
                  console.log(`Received message: ${event.message.text}`);
                  // Handle the message and send a response
              }
          });
      });

      res.status(200).send('EVENT_RECEIVED');
  } else {
      res.sendStatus(404);
  }
});

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
