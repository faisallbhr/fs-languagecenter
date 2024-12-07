const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { catchAsync, successResponse, apiError } = require("../utils");

exports.register = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role)
    throw new apiError(400, "All fields are required");

  const user = await User.findOne({ email });
  if (user) throw new apiError(400, "User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return successResponse(res, 201, null, "User registered successfully");
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new apiError(400, "All fields are required");

  const user = await User.findOne({ email });
  if (!user) throw new apiError(404, "User not found");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new apiError(401, "Invalid credentials");

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return successResponse(
    res,
    200,
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    },
    "Login successful"
  );
});

exports.getuserById = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id).select("name email");

  if (!user) throw new apiError(404, "User not found");
  return successResponse(res, 200, user, "User fetched successfully");
});
