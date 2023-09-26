const loadDB = require("../utils/loadDB").loadDB;
const path = require("path");
const AuthFactor = require("../utils/auth");
const filepath = path.join(__dirname, "../DB/neDB/feedback.db");
const db = loadDB(filepath);

class Feedback {
    constructor(email, username, phone, message) {
        this._email = email;
        this._phone = phone;
        this._username = username;
        this._message = message;
    }

    init() {
        const feedbackObj = {
            email: this._email,
            username: this._username,
            phone: this._phone,
            message: this._message
        }

        return new Promise((resolve, reject) => {
            db.insert(feedbackObj, (err, doc) => {
                if (err) reject({ error: true, message: err })
                else {
                    resolve({message: doc});
                }
            })
        })
    }
}

module.exports = Feedback