const { PushAPI, CONSTANTS } = require("@pushprotocol/restapi");
const express = require("express");
const app = express();
const port = 3000;
const ethers = require("ethers");

require("dotenv").config();

// when push protocol message is received, send it to the python backend
// after the python backend processes the message, send a response back to the push protocol

const accountMapping = {
  tony: {
    address: "0x7b47640ed97Cc08Aa188Ae091eFAb2CF3eF48469",
    aiWalletAddress: "0x387a03Abc6811aB0CFDC0bF359a0f5ae802086b3",
    aiPushAddress: "0xaf774541e13A05292bf0c48de4c87Fca6A9Bb843",
    aiPushPrivateKey: process.env.PRIVATE_KEY_1,
  },
  john: {
    address: "0xC24d2a947B4AF45964Dc316a63cC1BFb373E81E8",
    aiWalletAddress: "0x92ef453F5B27b5c3cf990916Bd3a57dD56ABeC1f",
    aiPushAddress: "0x7F7D39b8Ee799e40d4f1Ab52dcA871e49DA9B610",
    aiPushPrivateKey: process.env.PRIVATE_KEY_2,
  },
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Add a global state to track which AI should respond
const conversationState = {
  lastRespondedAI: null, // will store 'tony' or 'john'
  isProcessing: false,
};

async function listenForSigner(addressMap, aiName) {
  // Added aiName parameter
  const provider = ethers.getDefaultProvider();
  const signer = new ethers.Wallet(addressMap.aiPushPrivateKey, provider);

  const userAlice = await PushAPI.initialize(signer, {
    env: CONSTANTS.ENV.DEV,
  });

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

    // try {
    //   const joinGroup = await userAlice.chat.group.join(process.env.CHANNEL_ID);
    // } catch (err) {}
    // Send initial message to PushAI Bot:
    // console.log("Sending message to PushAI Bot, my chat rooms", await userAlice.chat.list("CHATS"));

    await userAlice.chat.send(process.env.CHANNEL_ID, {
      content: "AI Agent is connected",
      type: "Text",
    });

    console.log("Message sent to PushAI Bot");
  });

  stream.on(CONSTANTS.STREAM.CHAT, async (event) => {
    console.log(`${aiName} processing message from ${event.from}`);
    const message = event.message;

    // Skip processing for invalid messages or self messages
    if (!message?.content || event.from.split(":")[1].toLowerCase() === (await signer.getAddress()).toLowerCase()) {
      return;
    }

    // Skip "AI Agent is connected" messages
    if (message.content.includes("AI Agent is connected")) {
      return;
    }

    const shouldRespond = await shouldAIRespond(aiName, event.from);
    if (!shouldRespond) {
      console.log(`${aiName} skipping response. Current state:`, {
        ...conversationState,
        messageFrom: event.from,
      });
      return;
    }

    try {
      // Lock the conversation
      conversationState.isProcessing = true;
      conversationState.lastRespondedAI = aiName;

      // Process and send response
      const response = await fetch("http://127.0.0.1:5001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.content,
          aiName: aiName,
        }),
      });

      const data = await response.json();
      await userAlice.chat.send(process.env.CHANNEL_ID, {
        content: data.content,
        type: "Text",
      });
    } catch (error) {
      console.error(`${aiName} error:`, error);
    } finally {
      // Important: Reset processing flag after response is sent
      setTimeout(() => {
        conversationState.isProcessing = false;
      }, 1000);
    }
  });

  // Connect the stream
  await stream.connect();
}

// Helper function to determine if an AI should respond
async function shouldAIRespond(aiName, messageFrom) {
  console.log(`Checking if ${aiName} should respond to message from ${messageFrom}`);
  console.log("Current state:", conversationState);

  // Extract the address from the messageFrom string
  const fromAddress = messageFrom.split(":")[1].toLowerCase();
  const tonyAddress = accountMapping.tony.aiPushAddress.toLowerCase();
  const johnAddress = accountMapping.john.aiPushAddress.toLowerCase();

  // If message is from a user (not an AI)
  if (!fromAddress.includes(tonyAddress) && !fromAddress.includes(johnAddress)) {
    // Check if message is from Tony's user
    if (fromAddress === accountMapping.tony.address.toLowerCase()) {
      return (
        !conversationState.isProcessing &&
        ((conversationState.lastRespondedAI === null && aiName === "tony") || conversationState.lastRespondedAI !== aiName)
      );
    }

    // Check if message is from John's user
    if (fromAddress === accountMapping.john.address.toLowerCase()) {
      return (
        !conversationState.isProcessing &&
        ((conversationState.lastRespondedAI === null && aiName === "john") || conversationState.lastRespondedAI !== aiName)
      );
    }

    // Default case for other users: tony responds first
    return (
      !conversationState.isProcessing &&
      ((conversationState.lastRespondedAI === null && aiName === "tony") || conversationState.lastRespondedAI !== aiName)
    );
  }

  // If message is from an AI
  const isFromTony = fromAddress === tonyAddress;
  const isFromJohn = fromAddress === johnAddress;

  // Tony responds to John's messages, John responds to Tony's messages
  return !conversationState.isProcessing && ((isFromJohn && aiName === "tony") || (isFromTony && aiName === "john"));
}

// Initialize the streams with AI identities
async function initPushProtocolStream() {
  listenForSigner(accountMapping.tony, "tony");
  listenForSigner(accountMapping.john, "john");
}

// Call the async function
initPushProtocolStream().catch(console.error);
