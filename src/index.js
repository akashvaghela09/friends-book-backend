const express = require("express");
const app = express();
const cors = require('cors');
const userController = require("./controller/user.controller")
const friendListController = require("./controller/friendList.controller")
const friendRequestController = require("./controller/friendRequest.controller")
const suggestionsController = require("./controller/suggestions.controller")

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