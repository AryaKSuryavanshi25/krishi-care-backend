const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const { viewDisease } = require("../controllers/disease.controller");

router.post("/view", auth, viewDisease);

module.exports = router;
