import { token } from "@loopback/core"
let bodyParser = require("body-parser");
let path = require("path");

let app = (module.exports = loopback());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(loopback.token());
