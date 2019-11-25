const express = require("express");
const app = express();
const http = require("http");
const socketIO = require("socket.io");
const port = 3001;
const BodyParser = require("body-parser");
const morgan = require("morgan");

// our server instance
const server = http.createServer(app);

// This creates our socket using the instance of the server
const io = socketIO(server);

app.use(BodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(morgan("dev"));

app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/api/data", (req, res) =>
  res.json({
    message: "Seems to work!"
  })
);
io.origins("*:*");

//syntax for response from app
//  socket.on('functionName', function (data) {
//   console.log(data);
// });

const players = {};
// const movePlayer = ;

//player namespace
const nspPlayers = io.of("/players");
// console.log(nspPlayers);
nspPlayers.on("connection", function(socket) {
  console.log("someone connected player side", socket.id);

  // create a new player and add it to our players object
  players[socket.id] = {
    flipX: false,
    x: Math.floor(Math.random() * 400) + 50,
    y: Math.floor(Math.random() * 500) + 50,
    playerId: socket.id
  };

  socket.on("disconnect", () => {
    console.log("someone disconnected ", socket.id);
    delete players[socket.id];
    // emit a message to all players to remove this player
    // io.emit("disconnect", socket.id);
  });

  const emitPlayerMove = data => {
    nspGame.emit("playerMovement", data);
  };
  let interval;

  socket.on("playerMovement", data => {
    console.log("movingPlayer");
    clearInterval(interval);
    interval = setInterval(emitPlayerMove, 100, data);
    // movePlayer(data);
  });
  socket.on("playerMovementEnd", data => {
    console.log("movingPlayerEnd");
    nspGame.emit("playerMovementEnd", data);
    clearInterval(interval);
  });
});

//game namespace
const nspGame = io.of("/game");
nspGame.on("connection", function(socket) {
  console.log("someone connected game side ", socket.id);
  socket.on("disconnect", () => {
    console.log("someone disconnected", socket.id);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
