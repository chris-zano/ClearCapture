const path = require("path");
const Profile = require("../models/Profiles");
const User = require("../models/Users");
const fs = require("fs");

exports.authenticateUsername = (req, res) => {
    Profile.checkUsernameExists(req.params.username, req.params.password)
    .then(response => {
        if (response.error == false && response.msg == "Username and Password match") {
            res.status(200).json({error: false, message: "success", userId: response.userId})
        }
    })
    .catch(error => {
        if (error.msg = "Wrong Username") {
            res.status(201).json({error: true, message: "Wrong Username"});
        }
        else {
            res.status(201).json({error: true, message: error.msg})
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
                if(onexec.error == false && onexec.msg == "No error! Profile initialized successfuly") {
                    res.status(200).json({error: false, message: "success", userId: onexec.userId})
                }
                else {
                    res.status(500).json({error: true, message: "An error occured while initialising user Profile"})
                }
            })
            .catch(error => {
                res.status(500).json({error: true, message: error})
            })
        }
    })
    .catch(error => {
        if (error.error == true) {
            res.status(500).json({error: true, message: error})
        }
    })
}

exports.userLogin = (req, res) => {
    Profile.checkUsernameExists(req.body.username, req.body.password)
    .then(response => {
        if (response.error == false && response.msg == "Username and Password match") {
            res.status(200).json({error: false, message: "success", userId: response.userId})
        }
    })
    .catch(error => {
        if(error.error == true) {
            res.status(500).json({error: true, message: error})
        }
    })
}

exports.userLogout = (req, res) => {
    //const userId = req.params.userId;
    //TODO: log user logout to access logs using userId as param.

    res.status(200).json({error: false, message: "User Logged Out Successfully"});
}

exports.userUpdateName = (req, res) => {
    
    Profile.updateUserFirstAndLastNames(req.body.userId, req.body.lastname, req.body.firstname)
    .then(response => {
        if (response.error == false && response.msg == "success") {
            res.status(200).json({userId: response.userId})
        }
    })
    .catch(error => {
        res.status(500).json({error: error})
    })
}

exports.userUpdateUsername = (req, res) => {
    Profile.updateUsername(req.body.userId, req.body.username)
    .then(response => {
        if (response.error == false && response.msg == "success") {
            res.status(200).json({userId: response.userId})
        }
        else {
            res.status(500).json({error: response.msg})
        }
    })
    .catch(error => {
        res.status(500).json({error: error})
    })
}

exports.userUpdatedobAndgender = (req, res) => {
    
    Profile.updatedobAndGender(req.body.userId, req.body.dob, req.body.gender)
    .then(response => {
        if (response.error == false && response.msg == "success") {
            res.status(200).json({userId: response.userId})
        }
        else {
            res.status(500).json({error: response.msg})
        }
    })
    .catch(error => {
        res.status(500).json({error: error})
    })
    
}

exports.userUpdateProfilePic = (req, res) => {
    Profile.updatePictureUrl(req.body.userId, `/image/profile/${req.file.filename}`)
    .then(response => {
        if (response.error == false && response.msg == "success") {
            fs.createReadStream(path.join(__dirname, "../public/pages/profile.html")).pipe(res);
        }
        else {
            // res.status(201).json({error: response.msg})
            fs.createReadStream(path.join(__dirname, "../public/pages/error.html")).pipe(res);
        }
    })
    .catch(error => {
        res.status(500).json({error: error})
    })
}
