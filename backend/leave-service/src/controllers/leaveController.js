const { default: axios } = require("axios");
const Leave = require("../models/Leave");
const { catchAsync, successResponse, apiError } = require("../utils");

exports.createLeaveReq = catchAsync(async (req, res) => {
  const { startDate, endDate, reason } = req.body;
  const userId = req.user.id;

  if (!startDate || !endDate || !reason)
    throw new apiError(400, "All fields are required");

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()))
    throw new apiError(400, "Invalid date format. Please provide valid dates");

  const today = new Date();
  if (start < today)
    throw new apiError(400, "Start date must be greater than the current date");

  if (start >= end)
    throw new apiError(400, "Start date must be earlier than end date");

  await Leave.create({
    userId,
    startDate,
    endDate,
    reason,
  });

  return successResponse(res, 201, null, "Leave request created successfully");
});

exports.getAllLeaveReqs = catchAsync(async (req, res) => {
  const leaveReqs = await Leave.find();
  const token = req.headers.authorization;
  if (!Array.isArray(leaveReqs)) {
    throw new apiError(500, "Unexpected result from database");
  }
  const leaveReqFormat = await Promise.all(
    leaveReqs.map(async (leaveReq) => {
      try {
        const response = await axios.get(
          `${process.env.DB_USER_URL}/${leaveReq.userId}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        const leaveReqObj = leaveReq.toObject();
        leaveReqObj.userInfo = response.data.data;
        return leaveReqObj;
      } catch (err) {
        console.log(err.message);
        return { ...leaveReq.toObject(), userInfo: null };
      }
    })
  );

  return successResponse(
    res,
    200,
    leaveReqFormat,
    "Leave request fetched successfully"
  );
});

exports.updateLeaveReqStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) throw new apiError(400, "Missing status");

  const validStatuses = ["pending", "approved", "rejected"];

  if (!validStatuses.includes(status))
    throw new apiError(400, "Invalid status");

  const leaveRequest = await Leave.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );

  if (!leaveRequest) {
    throw new apiError(404, "Leave request not found");
  }

  return successResponse(res, 200, null, `Leave request status updated`);
});
