let express = require("express");
const bodyParser = require("body-parser");
const { cookieParserMountPosition } = require("fcc-express-bground/globals");
let app = express();

console.log("hi");

function middleware1(req, res, next) {
  const method = req.method;
  const path = req.path;
  const ip = req.ip;
  console.log(`${method} ${path} - ${ip}`);
  next();
}
app.use(middleware1);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

function middleware2_time(req, res, next) {
  console.log("middleware2_time called");
  req.time = new Date().toString();
  next();
}

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.use("/public", express.static(__dirname + "/public"));

app.get("/json", function (req, res) {
  if (process.env.MESSAGE_STYLE === "uppercase") {
    res.json({ message: "Hello json".toUpperCase() });
  } else {
    res.json({ message: "Hello json" });
  }
});

app.get("/now", middleware2_time, function (req, res) {
  console.log("Handler for /now called");
  res.json({ time: req.time });
});

app.get("/:word/echo", function (req, res) {
  res.json({ echo: req.params.word });
});

app
  .route("/name")
  .get(function (rep, res) {
    const firstname = rep.query.first;
    const lastname = rep.query.last;
    res.json({ name: `${firstname} ${lastname}` });
  })
  .post(function (rep, res) {
    console.log(`${JSON.stringify(rep.body)}`);
    const { first: firstname, last: lastname } = rep.body;
    res.json({ name: `${firstname} ${lastname}` });
  });

module.exports = app;
