const express = require("express")
const router = express.Router()
const {UserUpload} = require("../model/user.model")
const bcrypt = require("bcryptjs")

// Get Friend Request List
router.post("/", async (req, res) => {
    const user = await UserUpload.findOne({username :req.body.username}).lean().exec();

    let newList = []
    for(let i = 0; i < user.friendRequestList.length; i++){
        let newFriend = await UserUpload.findOne({username :user.friendRequestList[i]}).lean().exec();
        let data = calculateMutualFriend(user, newFriend)
        let obj = {
            "fullname": newFriend.fullname,
            "username": newFriend.username,
            "mutualFriends": data.size
        }
        newList.push(obj)
    }
    return res.status(200).json(newList)
})

// Send Friend Request
router.post("/send", async (req, res) => {
    try {
        const user = await UserUpload.findOne({username :req.body.receiver}).lean().exec();

        let newList = [req.body.requester , ...user.friendRequestList]
      
        const newUser = await UserUpload.findByIdAndUpdate(user._id, {"friendRequestList": [...newList]}, { new: true}).lean().exec()
        let data = {
            response: "success",
            message: "Friend Request Sent!!"
        }
        return res.status(200).json(data)
       
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})


// Accept Friend Request
router.post("/accept", async (req, res) => {
    console.log(req.body)
    try {
        let username = req.body.username;
        let newFriend = req.body.newFriend;

        const receiverUser = await UserUpload.findOne({"username" : username}).lean().exec();
        const requesterUser = await UserUpload.findOne({"username" : newFriend}).lean().exec();
   
        let newReceiverFriendList = [newFriend , ...receiverUser.friendList]
        let newRequesterFriendList = [username , ...requesterUser.friendList]
        let newReceiverRequestList = receiverUser.friendRequestList.filter((el) => { return newFriend !== el; })
     
        let receiverUpdateData = {
            "friendList": [...newReceiverFriendList],
            "friendRequestList": [...newReceiverRequestList]
        }

        let requesterUpdateData = {
            "friendList": [...newRequesterFriendList],
        }

        await UserUpload.findByIdAndUpdate(receiverUser._id, receiverUpdateData, { new: true}).lean().exec()
        await UserUpload.findByIdAndUpdate(requesterUser._id, requesterUpdateData, { new: true}).lean().exec()
        
        let data = {
            response: "success",
            message: "Friend Request Accepted!!"
        }
        return res.status(200).json(data)
       
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})

// Reject Friend Request
router.post("/reject", async (req, res) => {
    try {
        let username = req.body.username;
        let newFriend = req.body.newFriend;

        const receiverUser = await UserUpload.findOne({"username" : username}).lean().exec();
   
        let newReceiverRequestList = receiverUser.friendRequestList.filter((el) => { return newFriend !== el; })
     
        let receiverUpdateData = {
            "friendRequestList": [...newReceiverRequestList]
        }

        await UserUpload.findByIdAndUpdate(receiverUser._id, receiverUpdateData, { new: true}).lean().exec()
        
        let data = {
            response: "success",
            message: "Friend Request Rejected!!"
        }
        return res.status(200).json(data)
       
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})

const calculateMutualFriend = (user1, user2) => {
    let mutualList = [];

    for(let i = 0; i < user1.friendList.length; i++){
        let person1 = user1.friendList[i]

        for(let j = 0; j < user2.friendList.length; j++){
            let person2 = user2.friendList[j]

            if(person1 === person2){
                mutualList.push(person1);
                break;
            }
        }
    }

    return { "list": mutualList, "size": mutualList.length };
}

module.exports = router