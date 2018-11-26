let ws = require("ws");
let listClient = [];

let wsServer = new ws.Server({ port: 4444 });

wsServer.on("connection", socket => {
  socket.on("message", message => {
    wsServer.clients.forEach(client => {
      if (client !== socket && client.readyState === ws.OPEN) {
        client.send(message);
        console.log("message :", message);
      }
    });
  });
});
