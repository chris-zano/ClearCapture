const path = require("path");
const Profile = require("../models/Profiles");
const User = require("../models/Users");
const fs = require("fs");
const nodemailer = require("nodemailer")
const VerifyCode = require("../models/VerifyCode");

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
                res.status(200).json({ userId: response.userID })
                console.log("confirm here 8");
            }
            else {
                res.status(201).json({ error: "There was an error setting update to credentials" })
                console.log("confirm here 9");
            }
        })
        .catch(error => {
            console.log("confirm here 10");
            res.status(500).json({ error: "There was a server error" })
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

exports.verifyEmail = (req, res) => {
    User.checkEmail(req.params.email)
        .then(response => {
            if (response.msg = "User match") {
                const verificationCode = Math.floor(1000 + Math.random() * 9000);//generate random 4 digit number

                //create a transporter profile, that allows login access to your gmail
                const transporter = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: "niicodes.teamst0199@gmail.com",
                        pass: "ldwqdwzudicildio"
                    }
                })

                //compose an email
                const mailOptions = {
                    from: "niicodes.teamst0199@gmail.com",
                    to: req.params.email,
                    subject: 'Email Verification Code',
                    text: `Your verification code is: ${verificationCode}`
                };

                //send an email
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.log('Error sending email:', error);
                    } else {
                        console.log('Email sent:', info.response);
                        const veriyObject = new VerifyCode(verificationCode, req.params.email)
                        veriyObject.storeCodeAndEmail()
                            .then(versponse => {
                                if (versponse.error == null) {
                                    res.status(200).json({ message: "code generated successfully", userId: response.userId });
                                }
                            })
                            .catch(error => {
                                res.status(404).json({ message: error });
                            })
                    }
                });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: error })
        })
}

exports.verifyCode = (req, res) => {
    const verifyObject = new VerifyCode(req.params.code, req.params.email);
    verifyObject.verifyCodeAndEmail()
        .then(response => {
            res.status(200).json({ message: response.message })
        })
        .catch(error => {
            res.status(200).json({ error: error });
        })
}

exports.resetPassword = (req, res) => {
    const { email, password, userId } = req.params;
    console.log(email, password, userId);
    User.resetUserPassword(email, password, userId)
        .then(response => {
            if (response.message == "password updated") {
                res.status(200).json({ message: "password updated" });
            }
        })
    .catch (error => {
        res.status(500).json({error: error})
    })
}