const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../models/User");
jest.mock("../middlewares/gateway", () => (req, res, next) => next());
jest.mock("jsonwebtoken");
jest.mock("bcrypt");

const ROUTES = {
  REGISTER: "/api/user/register",
  LOGIN: "/api/user/login",
  GET_USER: "/api/user/:id",
};

const mockUser = {
  _id: new mongoose.Types.ObjectId(),
  name: "Test",
  email: "test@mail.com",
  password: "password",
  role: "employee",
};

let server;

beforeAll(async () => {
  server = app.listen(5001);
});

afterAll(async () => {
  await server.close();
  await mongoose.connection.close();
});

describe(`POST ${ROUTES.REGISTER}`, () => {
  it("should return 400 if required fields are missing", async () => {
    const res = await request(app).post(ROUTES.REGISTER).send({
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should return 400 user already exists", async () => {
    User.findOne.mockResolvedValue(mockUser);

    const res = await request(app).post(ROUTES.REGISTER).send(mockUser);

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });

  it("should register successfully", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(mockUser);

    const res = await request(app).post(ROUTES.REGISTER).send(mockUser);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("User registered successfully");
    expect(res.body.data).toBe(null);
  });
});

describe(`POST ${ROUTES.LOGIN}`, () => {
  it("should return 400 if required fields are missing", async () => {
    const res = await request(app).post(ROUTES.LOGIN).send({
      email: mockUser.email,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should return 404 if user not found", async () => {
    User.findOne.mockResolvedValue(null);
    const res = await request(app).post(ROUTES.LOGIN).send({
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  it("should return 401 if password not matched", async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    const res = await request(app).post(ROUTES.LOGIN).send({
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should login successful", async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    const res = await request(app).post(ROUTES.LOGIN).send({
      email: mockUser.email,
      password: mockUser.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Login successful");
  });
});

describe(`GET ${ROUTES.GET_USER}`, () => {
  it("should return 401 if no token is provided", async () => {
    const res = await request(app).get(ROUTES.GET_USER);

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Authentication token is required");
  });

  it("should return 403 if token is invalid", async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid or expired token");
    });

    const res = await request(app).get(ROUTES.GET_USER).set({
      Authorization: "Bearer mockedToken",
    });

    expect(res.body.message).toBe("Invalid or expired token");
    expect(res.status).toBe(401);
  });

  it("should return 404 if user not found", async () => {
    User.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    jwt.verify.mockResolvedValue(null);

    const res = await request(app)
      .get(ROUTES.GET_USER.replace(":id", mockUser._id))
      .set("Authorization", "Bearer mockedToken");

    expect(res.body.message).toBe("User not found");
    expect(res.status).toBe(404);
  });

  it("should fetched successful", async () => {
    User.findById = jest.fn().mockReturnValue({
      select: jest.fn().mockResolvedValue({
        name: mockUser.name,
        email: mockUser.email,
      }),
    });

    jwt.verify.mockResolvedValue(null);

    const res = await request(app)
      .get(ROUTES.GET_USER.replace(":id", mockUser._id))
      .set("Authorization", "Bearer mockedToken");

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("User fetched successfully");
    expect(res.body.data).toEqual({
      name: mockUser.name,
      email: mockUser.email,
    });
  });
});
