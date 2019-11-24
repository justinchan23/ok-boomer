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

const players = {};

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

io.on("connection", socket => {
  console.log("a user connected with the id of ", socket.id);

  socket.on("disconnect", function() {
    console.log("user disconnected");
    io.emit("disconnect", socket.id);
  });

  //  When theres a new player
  //  when a new client renders the react side,
  //  returns the socket.id so we can launch new player functionality

  //Player movement
  socket.on("Left", data => {
    console.log("Left");
    console.log("client response to move left", data);
  });

  socket.on("Right", data => {
    console.log("right");
    console.log("client response to move right", data);
  });

  socket.on("Up", data => {
    console.log("Up");
    console.log("client response to move up", data);
  });

  socket.on("Down", data => {
    console.log("Down");
    console.log("client response to move down", data);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
