const express = require("express");
const {
  createLeaveReq,
  getAllLeaveReqs,
  updateLeaveReqStatus,
} = require("../controllers/leaveController");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

router.post("/", authenticate, createLeaveReq);
router.get("/", authenticate, getAllLeaveReqs);
router.patch(
  "/:id/status",
  authenticate,
  authorize("admin"),
  updateLeaveReqStatus
);

module.exports = router;
