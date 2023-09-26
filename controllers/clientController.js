const fs = require("fs");
const path = require("path");
const FilesCollection = require("../models/Collection");
const Profile = require("../models/Profiles");

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
                res.status(200).json({document: response.document})
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
            res.status(200).json({document: response.document})
        }
    })
    .catch(error => {
        if (error.message == "An error occurred while fetching the document")
        {
            res.status(500).json({message: "Internal server error"})
        }
        else if (error.error == true && error.message ==  "No match was found") {
            res.status(404).json({message: "No match was found"})
        }
    })
}