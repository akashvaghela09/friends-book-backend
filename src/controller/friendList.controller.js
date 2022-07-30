const express = require("express")
const router = express.Router()
const {UserUpload} = require("../model/user.model")

// Get Friend List
router.get("/", async (req, res) => {
    console.log(req.body)
    const user = await UserUpload.findOne({username :req.body.username}).lean().exec();
    console.log(user)
    return res.status(200).json({data: user.friendList})
})

// Get Mutual Friend List
router.get("/mutualFriend", async (req, res) => {
    let username = req.body.username;
    let friendsUsername = req.body.friendsUsername;

    const user = await UserUpload.findOne({"username": username}).lean().exec();
    const friend = await UserUpload.findOne({"username": friendsUsername}).lean().exec();

    let mutualList = [];

    for(let i = 0; i < user.friendList.length; i++){
        let person1 = user.friendList[i]

        for(let j = 0; j < friend.friendList.length; j++){
            let person2 = friend.friendList[j]

            if(person1 === person2){
                mutualList.push(person1);
                break;
            }
        }
    }

    return res.status(200).json({data: mutualList})
})

module.exports = router