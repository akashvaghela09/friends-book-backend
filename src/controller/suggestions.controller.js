const express = require("express")
const router = express.Router()
const { UserUpload } = require("../model/user.model")

// Get suggestions based on mutual friend
router.get("/", async (req, res) => {
    let username = req.body.username;

    const allUsers = await UserUpload.find().lean().exec();
    const user = await UserUpload.findOne({ "username": username }).lean().exec();


    let newSuggestions = [];

    for (let i = 0; i < allUsers.length; i++) {
        let userTobeChecked = allUsers[i].username;
        let friendListTobeChecked = allUsers[i].friendList;

        if (username === userTobeChecked) {
            continue;
        }

        let coldListStatus = checkColdList(user, userTobeChecked)

        if (coldListStatus === true) {
            continue;
        }

        if (newSuggestions.length >= 2) {
            break;
        }

        let friendStatus = user.friendList.includes(userTobeChecked)
        if (friendStatus === true || friendListTobeChecked.length === 0) {
            continue;
        }

        let possibleSuggestion = await checkPossibleSuggestion(username, userTobeChecked)
        if (possibleSuggestion === true) {
            newSuggestions.push(userTobeChecked)
        }
    }

    addInColdList(user, newSuggestions)

    return res.status(200).json({ data: newSuggestions })
})

// Get suggestions for All Users
router.get("/allusers", async (req, res) => {
    let username = req.body.username;

    const allUser = await UserUpload.find().lean().exec();
    const user = await UserUpload.findOne({username : req.body.username}).lean().exec();

    let newList = []

    for(let i = 0; i < allUser.length; i++){
        let person = allUser[i].username;
        if (username === person) {
            continue;
        }

        let friendStatus = checkIfAlreadyFriend(user, person)
        if (friendStatus === true) {
            continue;
        }

        let coldListStatus = checkColdList(user, person)
        if (coldListStatus === true) {
            continue;
        }

        newList.push(person);
    }

    return res.status(200).json({data: [...newList]})
})

const checkColdList = (user, friend) => {
    let status = false;

    for (let i = 0; i < user.coldList.length; i++) {
        let person = user.coldList[i].username
        if (person === friend) {
            status = true;
            return status;
        }
    }

    return status;
}

const addInColdList = async (user, suggestions) => {

    // Clear Cold List
    let oldList = []
    for (let i = 0; i < user.coldList.length; i++) {
        let currentStamp = Date.now();
        if (currentStamp < user.coldList[i].timestamp) {
            oldList.push(user.coldList[i])
        }
    }

    // Add new Uses to Cold List
    let newList = [...oldList];
    for (let i = 0; i < suggestions.length; i++) {
        let item = {
            username: suggestions[i],
            timestamp: Date.now() + 30000
        }
        newList.push(item)
    }

    const updatedUser = await UserUpload.findByIdAndUpdate(user._id, { "coldList": [...newList] }, { new: true }).lean().exec()
}

const checkPossibleSuggestion = async (person1, person2) => {
    const user = await UserUpload.findOne({ "username": person1 }).lean().exec();
    const friend = await UserUpload.findOne({ "username": person2 }).lean().exec();

    let possibleSuggestion = false;

    for (let i = 0; i < user.friendList.length; i++) {
        let person1 = user.friendList[i]

        for (let j = 0; j < friend.friendList.length; j++) {
            let person2 = friend.friendList[j]

            if (person1 === person2) {
                possibleSuggestion = true;
                break;
            }
        }
    }

    return possibleSuggestion;
}

const checkIfAlreadyFriend = (user, friend) => {
    let status = false;

    for (let i = 0; i < user.friendList.length; i++) {
        let person = user.friendList[i]
        if (person === friend) {
            status = true;
            return status;
        }
    }

    return status;
}

module.exports = router