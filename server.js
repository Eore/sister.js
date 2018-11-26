let ws = require("ws");

let wsServer = new ws.Server({ port: 4444 });

wsServer.on("connection", socket => {
  socket.on("message", message => {
    console.log("m:", message);
  });
});
