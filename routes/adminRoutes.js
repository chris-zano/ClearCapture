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
router.post("/admin/update/socials", adminController.updateSocials);
router.post("/admin/update/ppic/:userId", uploadprofile.single("ppic"), adminController.userUpdateProfilePic);
router.post("/admin/feedback/user", clientController.saveFeedbackMessage)

router.post("/admin/collection/upload", uploadCollection.array("photos", 12), clientController.uploadCollection)
router.get("/admin/redirect/download/:collectionId", clientController.getCollectionById)

router.get("/userLogout/:userId", adminController.userLogout);
router.get("/admin/verify-email/:email", adminController.verifyEmail)
router.get("/admin/verify-code/:code/:email", adminController.verifyCode)
router.get("/admin/password-reset/:email/:password/:userId", adminController.resetPassword)


router.get('/admin/get/userById/:userId', adminController.getUserById)
router.get('/admin/get/creators', clientController.getAllCreators)
router.get('/admin/auth/collection-passkey/:id/:key', clientController.authCollectionPassKey)

module.exports = router;