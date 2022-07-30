const express = require("express");
const app = express();
const cors = require('cors');
const userController = require("./controller/user.controller.js")
const friendListController = require("./controller/friendList.controller.js")
const friendRequestController = require("./controller/friendRequest.controller.js")
const suggestionsController = require("./controller/suggestions.controller.js")

app.use(express.json())
app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use("/users", userController)
app.use("/friendList", friendListController)
app.use("/friendRequest", friendRequestController)
app.use("/suggestions", suggestionsController)

module.exports = {
    app
}