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

io.on("connection", socket => {
  console.log("a user connected");

  console.log(socket);
  //use this to differenciate players

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  //When theres a new player
  socket.on("newPlayer", () => {
    console.log("newPlayer");
  });

  //Player movement
  socket.on("Left", () => {
    console.log("Left");
  });

  socket.on("Right", () => {
    console.log("Right");
  });

  socket.on("Up", () => {
    console.log("Up");
  });

  socket.on("Down", () => {
    console.log("Down");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
