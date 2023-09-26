const fs = require("fs");
const path = require("path");
const FilesCollection = require("../models/Collection");
const Profile = require("../models/Profiles");
const nodemailer = require("nodemailer");
const Feedback = require("../models/Feedback");

exports.uploadCollection = (req, res) => {
    console.log(req.body);
    const mediaFiles = [];
    for (let photo of req.files) {
        mediaFiles.push(`/client/collection/${photo.filename}`);
    }
    if (mediaFiles.length > 0) {
        const fileCollection = new FilesCollection(req.body.creatorId, mediaFiles, req.body.passkey)
        fileCollection.init()
            .then(response => {
                if (response.error == false) {
                    res.status(200).json({ collectionId: response.collectionId });
                }
            })
            .catch(error => {
                if (error.error == "true") {
                    res.status(500).json({ message: "Internal Server Error" });
                }
                else {
                    res.status(201).json({ message: "Operation Failed" });
                }
            })
    }
}

exports.getAllCreators = (req, res) => {
    Profile.getAllCreators()
        .then(response => {
            if (response.error == false) {
                res.status(200).json({ document: response.document })
            }
        })
}

exports.getCollectionById = (req, res) => {
    console.log(req.params.collectionId);
    fs.createReadStream(path.join(__dirname, "../public/pages/download.html")).pipe(res)
};

exports.fetchCollectionfiles = (req, res) => {
    // console.log(req.params.collectionId);
    FilesCollection.getCollectionById(req.params.collectionId)
        .then(response => {
            if (response.error === false) {
                // Read and send the HTML file
                res.status(200).json({ document: response.document })
            }
        })
        .catch(error => {
            if (error.error === 'Error fetching collection') {
                res.status(500).json({ message: 'Internal Server Error' });
            } else if (error.error === 'no such collection found') {
                res.status(404).json({ message: 'Page not found' });
            }
        });
}

exports.authCollectionPassKey = (req, res) => {
    console.log(req.params);
    FilesCollection.authPassKeyAndDownload(req.params.id, req.params.key)
        .then(response => {
            if (response.error == false) {
                res.status(200).json({ document: response.document })
            }
        })
        .catch(error => {
            if (error.message == "An error occurred while fetching the document") {
                res.status(500).json({ message: "Internal server error" })
            }
            else if (error.error == true && error.message == "No match was found") {
                res.status(404).json({ message: "No match was found" })
            }
        })
}

exports.saveFeedbackMessage = (req, res) => {
    const feedback = new Feedback(req.body.email, req.body.username, req.body.phone, req.body.message)
    feedback.init()
    .then(response => {
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: "niicodes.teamst0199@gmail.com",
                pass: "ldwqdwzudicildio"
            }
        })
        const mailOptions = {
            from: "niicodes.teamst0199@gmail.com",
            to: req.body.email,
            subject: 'Thanks for Reaching Out to Us',
            text: `Hello ${req.body.username}, Hope this message reaches you well. We want to let you know tthat we have received your message and we will be working on it.`
        };
    
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).json({ message: "Internal server Error" })
            } else {
                console.log('Email sent:', info.response);
                res.status(200).json({message: "email sent"})
            }
        });
    })
    .catch (err => {
        res.status(500).json({message:"Internal server Error"})
    })
    
}
