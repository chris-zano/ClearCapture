const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminControllers");
const fileController  = require("../controllers/fileControllers");
const path = require("path");
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, "../DB/profile_images") });


router.get("/admin/authUserName/:username/:password", adminController.authenticateUsername);

router.post("/admin/userSignup", adminController.userSignup);
router.post("/userlogin", adminController.userLogin);
router.post("/admin/update/name", adminController.userUpdateName);
router.post("/admin/update/gender", adminController.userUpdatedobAndgender);
router.post("/admin/update/username", adminController.userUpdateUsername);
router.post("/admin/update/ppic", upload.single("ppic"), adminController.userUpdateProfilePic);

router.get("/userLogout/:userId", adminController.userLogout);

module.exports = router;