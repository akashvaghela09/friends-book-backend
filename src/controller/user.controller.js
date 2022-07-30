const express = require("express")
const router = express.Router()
const {UserUpload} = require("../model/user.model")
const bcrypt = require("bcryptjs")

// Get Users
router.get("/", async (req, res) => {
    const user = await UserUpload.find().lean().exec();
    return res.status(200).json({data: user})
})


// Get Single User
router.get("/:id", async (req, res) => {
    try {
        const user = await UserUpload.findById(req.params.id).lean().exec()
        return res.status(200).json({data: user})
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})

// Register User
router.post("/register", async (req, res) => {
    const user = await UserUpload.find().lean().exec();
    flag = true;
    user.map((el) => {
        if(req.body.username === el.username){
            flag = false
            return res.status(500).json({message: "Username Already Exist"})
        }
    })

    if(flag === true){
        try {
            bcrypt.hash(req.body.password, 10, function(err, hash) {
                let userbody = {
                    "fullname": req.body.fullname,
                    "username": req.body.username,
                    "friendList": [],
                    "friendRequestList": [],
                    "coldList": [],
                    "password": hash
                }
                const user = UserUpload.create(userbody);

                let data = {
                    response: "success",
                    message: "User Registered Successfully!!"
                }
                return res.status(201).json(data)
            });
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
    }
})


// Login User
router.post("/login", async (req, res) => {
    try {
        const user = await UserUpload.findOne({username :req.body.username}).lean().exec();

        // Compare User password with Hash String
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            console.log(result)
            if(result === true){
                let data = {
                    response: "success",
                    userId: user._id,
                    fullname: user.fullname,
                    username: user.username,
                    message: "User Authenticated Successfully"
                }
                return res.status(200).json(data)
            } else {
                let data = {
                    response: false,
                    message: "User Authentication Failed"
                }
                return res.status(500).json(data)
            }
        });
    } catch {
        return res.status(404).json({message: "User Not Found"})
    }
})


// Delete User
router.delete("/:id", async (req, res) => {
    try {
        const user = await UserUpload.findByIdAndDelete(req.params.id).lean().exec()
        let data = {
            response: "success",
            message: `User ${user.fullname} got deleted!!`
        }
        return res.status(200).json(data)
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
})

module.exports = router