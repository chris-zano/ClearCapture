const fs = require("fs");
const path = require("path");


exports.renderHomeView = (req, res) => {
    fs.createReadStream(path.join(__dirname, "../public/index.html")).pipe(res);
}

exports.renderPageView = (req, res) => {
    fs.createReadStream(path.join(__dirname, "../public/pages", `${req.params.filename}.html`)).pipe(res);
}

exports.loadStyleScript = (req, res) => {
    fs.createReadStream(path.join(__dirname, "../public/css", `${req.params.filename}.css`)).pipe(res);
}

exports.loadUIFont = (req, res) => {
    fs.createReadStream(path.join(__dirname, "../public/assets/fonts", req.params.filename)).pipe(res);
}

exports.loadDOMScript = (req, res) => {
    fs.createReadStream(path.join(__dirname, "../public/js", `${req.params.filename}.js`)).pipe(res);
}

exports.renderImage = (req, res) => {
    fs.createReadStream(path.join(__dirname, "../public/assets/images", req.params.filename)).pipe(res);   
}

exports.renderVectorGraphics = (req, res) => {
    fs.createReadStream(path.join(__dirname, "../public/assets/svg", req.params.filename)).pipe(res);   
}

exports.renderUserProfilePicture = (req, res) => {
    fs.createReadStream(path.join(__dirname, "../DB/userProfilePictures/", req.params.filename)).pipe(res);   
}
