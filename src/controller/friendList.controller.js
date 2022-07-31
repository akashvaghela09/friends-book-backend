const express = require("express")
const router = express.Router()
const {UserUpload} = require("../model/user.model")
const bcrypt = require("bcryptjs")

// Get Friend List
router.post("/", async (req, res) => {
    const allUser = await UserUpload.find().lean().exec();
    const user = await UserUpload.findOne({username :req.body.username}).lean().exec();

    let newList = []

    for(let i = 0; i < allUser.length; i++){
        let person = allUser[i]
        for(let j = 0; j < user.friendList.length; j++){
            usersFriend = user.friendList[j]
            if(person.username === usersFriend){
                const friend = await UserUpload.findOne({"username": usersFriend}).lean().exec();
                let data = await calculateMutualFriend(person, friend)
                let obj = {
                    "fullname": person.fullname,
                    "username": person.username,
                    "mutualFriends": data.size
                }
                newList.push(obj)
            }
        }
    }

    return res.status(200).json(newList)
})

// Get Mutual Friend List
router.post("/mutualFriend", async (req, res) => {
    let username = req.body.username;
    let friendsUsername = req.body.friendsUsername;

    const user = await UserUpload.findOne({"username": username}).lean().exec();
    const friend = await UserUpload.findOne({"username": friendsUsername}).lean().exec();
    let data = await calculateMutualFriend(user, friend);
    console.log(data)
    return res.status(200).json(data)
})

const calculateMutualFriend = async (user1, user2) => {
    let mutualList = [];

    for(let i = 0; i < user1.friendList.length; i++){
        let person1 = user1.friendList[i]

        for(let j = 0; j < user2.friendList.length; j++){
            let person2 = user2.friendList[j]

            if(person1 === person2){
                const tempUser = await UserUpload.findOne({"username": person1}).lean().exec();
                let obj = {
                    "fullname": tempUser.fullname,
                    "username": tempUser.username,
                }
                mutualList.push(obj);
                break;
            }
        }
    }

    return { "list": mutualList, "size": mutualList.length };
}

module.exports = router