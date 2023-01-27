const path = require("path");

const express = require("express");
const app = express();

const ejs = require("ejs");
app.set("view engine", "ejs");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(require("cookie-parser")());
app.use(require('express-fileupload')());

const http = require("http").createServer(app);

app.get("/scripts/:scriptName", (request, response) => response.sendFile(`${__dirname}/scripts/${request.params.scriptName}`));

app.get("/images/:imageName", (request, response) => response.sendFile(`${__dirname}/images/${request.params.imageName}`));

app.get("/styles/:styleName", (request, response) => response.sendFile(`${__dirname}/styles/css/${request.params.styleName}`));

app.get("/", (request, response) => response.render("pages/index"));

http.listen(80, '0.0.0.0', () => console.log("NOTICE: Primary server listening on port 80."));