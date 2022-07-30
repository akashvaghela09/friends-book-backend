const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullname: {type:String, required: true},
        username: {type:String, required: true},
        password: {type:String, required: true},
        friendList: {type: Array},
        coldList: {type: Array},
        friendRequestList: {type: Array}
    }, 
    { versionKey: false }
)

const UserUpload = mongoose.model("user", userSchema);

module.exports = {UserUpload}