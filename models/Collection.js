const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
const AuthFactor = require("../utils/auth");
const User = require("./Users");
const filepath = path.join(__dirname, "../DB/neDB/collection.db");
const db = loadDB(filepath);

class FilesCollection {
    constructor(creatorId, mediaFiles, passkey) {
        this._creatorId = creatorId;
        this._mediaFiles = mediaFiles;
        this._passkey = AuthFactor.hashWithKey(passkey, "low")
    }

    init() {
        return new Promise((resolve, reject) => {
            User.checkId(this._creatorId)
                .then(response => {
                    if (response.msg == "User match" && response.id == this._creatorId) {
                        const collectionObject = {
                            creatorId: this.creatorId,
                            mediaFiles: this._mediaFiles,
                            key: this._passkey,
                            downloads: 0,
                            privacy: true
                        }
                        db.insert(collectionObject, (err, doc) => {
                            if (err) reject({ error: err })
                            else {
                                resolve({ error: false, collectionId: doc._id })
                            }
                        })
                    }
                })
                .catch(error => {
                    reject({ error: "true", message: error })
                })
        })
    }

    static getCollectionById(id) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: id },
                { multi: true },
                (error, document) => {
                    if (error) reject({ error: "Error fetching collecion" })
                    else {
                        resolve({ error: false, document: document })
                    }
                }
            )
        })
    }

    static authPassKeyAndDownload(id, key) {
        return new Promise((resolve, reject) => {
            db.find(
                { _id: id, key: AuthFactor.hashWithKey(key, "low") },
                { multi: false },
                (error, document) => {
                    if (error) reject({ error: error, message: "An error occurred while fetching the document" })
                    else {
                        if (document) {
                            resolve({ error: false, document: document[0].mediaFiles })
                        }
                        else {
                            reject({ error: true, message: "No match was found" })
                        }
                    }
                }
            )
        })
    }
}

module.exports = FilesCollection;