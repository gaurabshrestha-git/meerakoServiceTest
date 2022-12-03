const express = require("express");
const {
  getDataController,
  loginUserController,
  registerUserController,
  verifyTokenController,
  saveDataController,
} = require("../controller/controller");

const router = express.Router();

router.route("/getData").get(getDataController);
router.route("/loginUser").post(loginUserController);
router.route("/registerUser").post(registerUserController);
router.route("/verifyToken").post(verifyTokenController);
router.route("/insertData").post(saveDataController);

module.exports = router;
