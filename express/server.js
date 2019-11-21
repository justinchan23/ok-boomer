const express = require("express");
const app = express();
const port = 8080;
const BodyParser = require("body-parser");
const morgan = require("morgan");

app.use(BodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(morgan("dev"));
app.use("/css", express.static(__dirname + "/css"));
app.use("/js", express.static(__dirname + "/js"));
app.use("/assets", express.static(__dirname + "/assets"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Express seems to be listening on port ${port} so that's pretty good 👍`
  );
});

app.get("/api/data", (req, res) =>
  res.json({
    message: "Seems to work!"
  })
);
