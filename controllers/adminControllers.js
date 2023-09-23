const path = require("path");
const Profile = require("../models/Profiles");
const User = require("../models/Users");
const fs = require("fs");

exports.authenticateUsername = (req, res) => {
    Profile.checkUsernameExists(req.params.username, req.params.password)
        .then(response => {
            if (response.error == false && response.msg == "Username and Password match") {
                res.status(200).json({ error: false, message: "success", userId: response.userId })
            }
        })
        .catch(error => {
            if (error.msg = "Wrong Username") {
                res.status(201).json({ error: true, message: "Wrong Username" });
            }
            else {
                res.status(201).json({ error: true, message: error.msg })
            }
        })
}

exports.userSignup = (req, res) => {
    const user = new User(req.body.email, req.body.password);
    user.createUser()
        .then(response => {
            if (response.error == false) {
                const newprofile = new Profile(response.userId);
                newprofile.init()
                    .then(onexec => {
                        if (onexec.error == false && onexec.msg == "No error! Profile initialized successfuly") {
                            res.status(200).json({ error: false, message: "success", userId: onexec.userId })
                        }
                        else {
                            res.status(500).json({ error: true, message: "An error occured while initialising user Profile" })
                        }
                    })
                    .catch(error => {
                        res.status(500).json({ error: true, message: error })
                    })
            }
        })
        .catch(error => {
            if (error.error == true) {
                res.status(500).json({ error: true, message: error })
            }
        })
}

exports.userLogin = (req, res) => {
    Profile.checkUsernameExists(req.body.username, req.body.password)
        .then(response => {
            if (response.error == false && response.msg == "Username and Password match") {
                res.status(200).json({ error: false, message: "success", userId: response.userId })
            }
        })
        .catch(error => {
            if (error.error == true) {
                res.status(500).json({ error: true, message: error })
            }
        })
}

exports.userLogout = (req, res) => {
    //const userId = req.params.userId;
    //TODO: log user logout to access logs using userId as param.

    res.status(200).json({ error: false, message: "User Logged Out Successfully" });
}

exports.userUpdateName = (req, res) => {

    Profile.updateUserFirstAndLastNames(req.body.userId, req.body.lastname, req.body.firstname)
        .then(response => {
            if (response.error == false && response.msg == "success") {
                res.status(200).json({ userId: response.userId })
            }
        })
        .catch(error => {
            res.status(500).json({ error: error })
        })
}

exports.userUpdateUsername = (req, res) => {
    Profile.updateUsername(req.body.userId, req.body.username)
        .then(response => {
            if (response.error == false && response.msg == "success") {
                res.status(200).json({ userId: response.userId })
            }
            else {
                res.status(500).json({ error: response.msg })
            }
        })
        .catch(error => {
            res.status(500).json({ error: error })
        })
}

exports.userUpdatedobAndgender = (req, res) => {

    Profile.updatedobAndGender(req.body.userId, req.body.dob, req.body.gender)
        .then(response => {
            if (response.error == false && response.msg == "success") {
                res.status(200).json({ userId: response.userId })
            }
            else {
                res.status(500).json({ error: response.msg })
            }
        })
        .catch(error => {
            res.status(500).json({ error: error })
        })

}

exports.updateSocials = (req, res) => {
    console.log("confirm here 6");
    const b = req.body
    console.log(b);
    Profile.updateUserSocials(b.userId, b.instagram, b.facebook, b.twitter, b.tiktok, b.youtube, b.whatsapp)
    .then(response => {
        console.log("confirm here 7");
        if (response.error == false && response.msg == "success") {
            res.status(200).json({userId: response.userID})
            console.log("confirm here 8");
        }
        else {
            res.status(201).json({error: "There was an error setting update to credentials"})
            console.log("confirm here 9");
        }
    })
    .catch(error => {
        console.log("confirm here 10");
        res.status(500).json({error: "There was a server error"})
    })
}

exports.userUpdateProfilePic = (req, res) => {
    Profile.updatePictureUrl(req.params.userId, `/image/profile/${req.file.filename}`)
        .then(response => {
            if (response.error == false && response.msg == "success") {
                fs.createReadStream(path.join(__dirname, "../public/index.html")).pipe(res);
            }
            else {
                // res.status(201).json({error: response.msg})
                fs.createReadStream(path.join(__dirname, "../public/pages/error.html")).pipe(res);
            }
        })
        .catch(error => {
            res.status(500).json({ error: error })
        })
}


exports.getUserById = (req, res) => {
    Profile.getUserProfileById(req.params.userId)
        .then(response => {
            if (response.message = "data retreived successfully") {
                res.status(200).json({ document: response.document[0] });
            }
        })
        .catch(error => {
            res.status(201).json({ message: "No data matching this Id" })
        })
}