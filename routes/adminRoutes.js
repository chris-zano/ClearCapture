const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminControllers");
const fileController  = require("../controllers/fileControllers");
const path = require("path");
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, "../DB/profile_images") });


router.post("/userSignup", adminController.userSignup);
router.post("/userlogin", adminController.userLogin);
router.post("/update/name", adminController.userUpdateName);
router.post("/update/gender", adminController.userUpdatedobAndgender);
router.post("/update/username", adminController.userUpdateUsername);
router.post("/update/ppic", upload.single("ppic"), adminController.userUpdateProfilePic);

router.get("/userLogout/:userId", adminController.userLogout);

module.exports = router;