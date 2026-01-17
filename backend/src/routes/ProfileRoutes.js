const express = require ("express");
const router = express.Router ();
const upload = require('../config/Upload');

const {
  get_my_profile_mw,
  update_my_profile_mw,
  delete_my_profile_mw,
} = require("../middlewares/profile_middleware");



router.get("/me", get_my_profile_mw);


router.put("/me", upload.single('avatar'), update_my_profile_mw);


router.delete("/me", delete_my_profile_mw);

module.exports = router;