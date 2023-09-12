const fs = require("fs");
const path = require("path");

exports.uploadCollection = (req, res) => {
    for (let photo of req.files) {
        console.log(`${photo.originalname} => ${photo.filename}`);
    }
    res.status(200).json({message: "success"});
}

