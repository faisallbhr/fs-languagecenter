const express = require("express");
const { authenticate } = require("../middlewares/auth");
const {
  register,
  login,
  getuserById,
} = require("../controllers/userController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/:id", authenticate, getuserById);

module.exports = router;
