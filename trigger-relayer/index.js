const express = require("express");
const app = express();
const port = 3000;

// when push protocol message is received, send it to the python backend
// after the python backend processes the message, send a response back to the push protocol

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Initialize stream to listen for events:
const stream = await userAlice.initStream(
  [
    CONSTANTS.STREAM.CHAT, // Listen for chat messages
    CONSTANTS.STREAM.NOTIF, // Listen for notifications
    CONSTANTS.STREAM.CONNECT, // Listen for connection events
    CONSTANTS.STREAM.DISCONNECT, // Listen for disconnection events
  ],
  {
    // Filter options:
    filter: {
      // Listen to all channels and chats (default):
      channels: ["*"],
      chats: ["*"],

      // Listen to specific channels and chats:
      // channels: ['channel-id-1', 'channel-id-2'],
      // chats: ['chat-id-1', 'chat-id-2'],

      // Listen to events with a specific recipient:
      // recipient: '0x...' (replace with recipient wallet address)
    },
    // Connection options:
    connection: {
      retries: 3, // Retry connection 3 times if it fails
    },
    raw: false, // Receive events in structured format
  }
);

// Chat event listeners:

// Stream connection established:
stream.on(CONSTANTS.STREAM.CONNECT, async (a) => {
  console.log("Stream Connected");

  // Send initial message to PushAI Bot:
  console.log("Sending message to PushAI Bot");

  await userAlice.chat.send(pushAIWalletAddress, {
    content: "Hello, from Alice",
    type: "Text",
  });

  console.log("Message sent to PushAI Bot");
});

// Chat message received:
stream.on(CONSTANTS.STREAM.CHAT, (message) => {
  console.log("Encrypted Message Received");
  console.log(message); // Log the message payload
});

// Chat operation received:
stream.on(CONSTANTS.STREAM.CHAT_OPS, (data) => {
  console.log("Chat operation received.");
  console.log(data); // Log the chat operation data
});

// Connect the stream:
await stream.connect(); // Establish the connection after setting up listeners

// Stream disconnection:
stream.on(CONSTANTS.STREAM.DISCONNECT, () => {
  console.log("Stream Disconnected");
});

// Stream Chat also supports other products like CONSTANTS.STREAM.NOTIF.
// For more information, please refer to push.org/docs/notifications.
