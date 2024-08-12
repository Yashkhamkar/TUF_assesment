const express = require("express");
const {
  getBanner,

  createOrUpdateBanner,
} = require("../Controllers/BannerController");
const { protect } = require("../Middleware/authMiddleware");

const router = express.Router();
router.route("/banner").get(getBanner);
router.route("/banner/create").post(protect, createOrUpdateBanner);
router.route("/banner/update").put(protect, createOrUpdateBanner);
module.exports = router;
