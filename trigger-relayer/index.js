const { PushAPI, CONSTANTS } = require("@pushprotocol/restapi");
const express = require("express");
const app = express();
const port = 3000;
const ethers = require("ethers");

require("dotenv").config();

// when push protocol message is received, send it to the python backend
// after the python backend processes the message, send a response back to the push protocol

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

async function listenForSigner(signer) {
  const userAlice = await PushAPI.initialize(signer, {
    env: CONSTANTS.ENV.DEV,
  });

  // Check for errors in userAlice's initialization and handle them if any
  if (userAlice.errors.length > 0) {
    // Handle Errors Here
  }

  const stream = await userAlice.initStream([CONSTANTS.STREAM.CONNECT, CONSTANTS.STREAM.CHAT], {
    filter: {
      channels: ["*"],
      chats: ["*"],
    },
    connection: {
      retries: 3,
    },
    raw: false,
  });

  // Chat event listeners
  stream.on(CONSTANTS.STREAM.CONNECT, async (a) => {
    console.log("Stream Connected");
    // Send initial message to PushAI Bot:
    console.log("Sending message to PushAI Bot");

    await userAlice.chat.send(process.env.CHANNEL_ID, {
      content: "AI Agent is connected",
      type: "Text",
    });

    console.log("Message sent to PushAI Bot");
  });

  stream.on(CONSTANTS.STREAM.CHAT, async (message) => {
    console.log("Encrypted Message Received");
    console.log(message);

    // ignore system messages
    if (message.content.includes("AI Agent is connected")) {
      return;
    }

    // ignore messages from self
    if (message.fromDID.split(":")[1].toLowerCase() === signer.getAddress().toLowerCase()) {
      return;
    }

    // send message to python backend
    const response = await fetch("http://localhost:5001/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: message.content }), //todo: attribute the sender in group chat
    });

    const data = await response.json();
    console.log("data from python backend", data);

    // send response back to push protocol
    await userAlice.chat.send(process.env.CHANNEL_ID, {
      content: data.content,
      type: "Text",
    });
  });

  // Connect the stream
  await stream.connect();
}

// Create an async function to handle stream initialization
async function initPushProtocolStream() {
  // Initialize wallet user

  const signer1 = new ethers.Wallet(process.env.PRIVATE_KEY_1);
  const signer2 = new ethers.Wallet(process.env.PRIVATE_KEY_2);

  listenForSigner(signer1);
  listenForSigner(signer2);
}

// Call the async function
initPushProtocolStream().catch(console.error);
