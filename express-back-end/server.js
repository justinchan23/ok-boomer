// load .env data into process.env
// const ENV = process.env.ENV || "development";

// if (ENV === "development") {
//   require("dotenv").config();
// }

// Web server config
const PORT = process.env.PORT || 8080;
const Express = require("express");
const BodyParser = require("body-parser");
// const sass = require("node-sass-middleware");
const App = Express();
const morgan = require("morgan");
// const cookieSession = require("cookie-session");

// PG database client/connection setup
// const { Pool } = require("pg");

// const dbParams = require("./lib/db.js");
// const db = new Pool(dbParams);
// db.connect();

// Express Configuration
App.use(BodyParser.urlencoded({ extended: false }));
App.use(Express.static("public"));
App.use(morgan("dev"));

// Sample GET route
App.get("/api/data", (req, res) =>
  res.json({
    message: "Seems to work!"
  })
);

App.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `Express seems to be listening on port ${PORT} so that's pretty good 👍`
  );
});

App.use("/", (req, res) => {
  res.render("index.ejs");
});
