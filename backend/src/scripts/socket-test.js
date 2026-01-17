const { io } = require("socket.io-client");

const TOKEN = process.env.TOKEN;
const CONV_ID = Number(process.env.CONV_ID || 0);

if (!TOKEN) {
  console.error("Missing TOKEN env var.");
  process.exit(1);
}

if (!CONV_ID) {
  console.error("Missing/invalid CONV_ID env var.");
  process.exit(1);
}

const socket = io("http://localhost:3000", {
  auth: { token: TOKEN },
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("connected:", socket.id);

  socket.emit("conversation:join", { conversationId: CONV_ID });

  socket.emit("message:send", {
    conversationId: CONV_ID,
    content: `hello from socket-test (${new Date().toISOString()})`,
  });
});

socket.on("message:new", (msg) => {
  console.log("message:new:", msg);
  process.exit(0);
});

socket.on("connect_error", (err) => {
  console.error("connect_error:", err.message);
  process.exit(1);
});
