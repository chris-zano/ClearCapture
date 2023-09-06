const express = require("express");
const router = express.Router();
const fileController = require("../controllers/fileControllers");

//assests routes /public routes
router.get("/css/:filename", fileController.loadStyleScript);
router.get("/js/:filename", fileController.loadDOMScript);
router.get("/font/:filename", fileController.loadUIFont);
router.get("/admin/image/:filename", fileController.renderImage);
router.get("/admin/vector_graphics/:filename", fileController.renderVectorGraphics);


//html routes / redirect routes
router.get("/", fileController.renderHomeView);
router.get("/admin/redirect/:filename", fileController.renderPageView)

module.exports = router;