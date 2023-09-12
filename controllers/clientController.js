const fs = require("fs");
const path = require("path");
const FilesCollection = require("../models/Collection");

exports.uploadCollection = (req, res) => {
    const mediaFiles = [];
    for (let photo of req.files) {
        mediaFiles.push(`/${photo.filename}`);
    }
    if (mediaFiles.length > 0) {
        const fileCollection = new FilesCollection(req.body.creatorId, mediaFiles)
        fileCollection.init()
        .then(response=>{
            if (response.error == false) {
                res.status(200).json({collectionId: response.collectionId});
            }
        })
        .catch(error => {
            if (error.error == "true") {
                res.status(500).json({message: "Internal Server Error"});
            }
            else {
                res.status(201).json({message: "Operation Failed"});
            }
        })
    }
}

