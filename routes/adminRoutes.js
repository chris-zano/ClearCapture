const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminControllers");
const clientController  = require("../controllers/clientController");
const path = require("path");
const multer = require('multer');
const uploadprofile = multer({ dest: path.join(__dirname, "../DB/profile_images") });
const uploadCollection = multer({ dest: path.join(__dirname, "../DB/collection_media") });


router.get("/admin/authUserName/:username/:password", adminController.authenticateUsername);

router.post("/admin/userSignup", adminController.userSignup);
router.post("/userlogin", adminController.userLogin);
router.post("/admin/update/name", adminController.userUpdateName);
router.post("/admin/update/gender", adminController.userUpdatedobAndgender);
router.post("/admin/update/username", adminController.userUpdateUsername);
router.post("/admin/update/ppic", uploadprofile.single("ppic"), adminController.userUpdateProfilePic);

router.post("/admin/collection/upload", uploadCollection.array("photos", 12), clientController.uploadCollection)

router.get("/userLogout/:userId", adminController.userLogout);

module.exports = router;