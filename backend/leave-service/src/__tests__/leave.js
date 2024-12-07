const app = require("../app");
const request = require("supertest");
const mongoose = require("mongoose");
const Leave = require("../models/Leave");
const jwt = require("jsonwebtoken");
const axiosMock = require("axios-mock-adapter");
const axios = require("axios");

jest.mock("../models/Leave");
jest.mock("../middlewares/gateway", () => (req, res, next) => next());
jest.mock("jsonwebtoken");

const ROUTES = {
  CREATE: "/api/leave",
  GET: "/api/leave",
  UPDATE: "/api/leave/:id/status",
};

const mockLeave = {
  _id: new mongoose.Types.ObjectId(),
  userId: new mongoose.Types.ObjectId(),
  startDate: "12-12-2024",
  endDate: "1-1-2025",
  reason: "lorem ipsum",
};

const mockAxios = new axiosMock(axios);

let server;

beforeAll(async () => {
  server = app.listen(5002);
});

afterAll(async () => {
  await server.close();
  await mongoose.connection.close();
});

describe(`POST ${ROUTES.CREATE}`, () => {
  jwt.verify.mockImplementation(() => ({
    id: mockLeave.userId,
  }));

  it("should return 400 if required fields are missing", async () => {
    const res = await request(app)
      .post(ROUTES.CREATE)
      .set({
        Authorization: "Bearer mockedToken",
      })
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should return 400 for invalid date format", async () => {
    const res = await request(app)
      .post(ROUTES.CREATE)
      .set({
        Authorization: "Bearer mockedToken",
      })
      .send({
        ...mockLeave,
        startDate: "13-13-2025",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "Invalid date format. Please provide valid dates"
    );
  });

  it("should return 400 if start date isnt greater than current date", async () => {
    const res = await request(app)
      .post(ROUTES.CREATE)
      .set({
        Authorization: "Bearer mockedToken",
      })
      .send({
        ...mockLeave,
        startDate: "1-1-2001",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe(
      "Start date must be greater than the current date"
    );
  });

  it("should return 400 start date isnt earlier than end date", async () => {
    const res = await request(app)
      .post(ROUTES.CREATE)
      .set({
        Authorization: "Bearer mockedToken",
      })
      .send({
        ...mockLeave,
        endDate: "1-1-2001",
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Start date must be earlier than end date");
  });

  it("should create leave req successful", async () => {
    const res = await request(app)
      .post(ROUTES.CREATE)
      .set({
        Authorization: "Bearer mockedToken",
      })
      .send(mockLeave);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Leave request created successfully");
    expect(res.body.data).toBe(null);
  });
});

describe(`GET ${ROUTES.GET}`, () => {
  it("should return leave requests with null userInfo if axios fails", async () => {
    const userInfo = { name: "faisal", role: "employee" };
    const result = {
      ...mockLeave,
      toObject: jest.fn().mockReturnValue({
        ...mockLeave,
        userInfo,
      }),
    };

    Leave.find = jest.fn().mockResolvedValue([result]);

    mockAxios
      .onGet(`${process.env.DB_USER_URL}/${mockLeave.userId}`)
      .reply(500);

    const res = await request(app).get(ROUTES.GET).set({
      Authorization: "Bearer mockedToken",
    });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Leave request fetched successfully");
    expect(res.body.data[0].userInfo).toBeNull();
  });

  it("should return leave requests with user info", async () => {
    const userInfo = { name: "faisal", role: "employee" };
    const result = {
      ...mockLeave,
      toObject: jest.fn().mockReturnValue({
        ...mockLeave,
        userInfo,
      }),
    };

    Leave.find.mockResolvedValue([result]);

    mockAxios
      .onGet(`${process.env.DB_USER_URL}/${mockLeave.userId}`)
      .reply(200, {
        data: userInfo,
      });

    const res = await request(app).get(ROUTES.GET).set({
      Authorization: "Bearer mockedToken",
    });

    const expectedResponse = {
      ...mockLeave,
      _id: mockLeave._id.toString(),
      userId: mockLeave.userId.toString(),
      userInfo,
    };

    expect(res.body.message).toBe("Leave request fetched successfully");
    expect(res.status).toBe(200);
    expect(res.body.data[0]).toEqual(expectedResponse);
  });
});

describe(`PATCH ${ROUTES.UPDATE}`, () => {
  it("should return 403 if user not have permission", async () => {
    jwt.verify.mockImplementation(() => ({
      role: "employee",
    }));

    const res = await request(app)
      .patch(ROUTES.UPDATE.replace(":id", mockLeave.userId))
      .set({
        Authorization: "Bearer mockedToken",
      })
      .send({ status: "approved" });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(
      "You do not have permission to access this resource"
    );
  });

  it("should return 400 if status field is missing", async () => {
    jwt.verify.mockImplementation(() => ({
      role: "admin",
    }));

    const res = await request(app)
      .patch(ROUTES.UPDATE.replace(":id", mockLeave.userId))
      .set({
        Authorization: "Bearer mockedToken",
      })
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Missing status");
  });

  it("should return 400 if status is invalid", async () => {
    jwt.verify.mockImplementation(() => ({
      role: "admin",
    }));

    const res = await request(app)
      .patch(ROUTES.UPDATE.replace(":id", mockLeave.userId))
      .set({
        Authorization: "Bearer mockedToken",
      })
      .send({ status: "anything" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid status");
  });

  it("should return 404 if status not found", async () => {
    jwt.verify.mockImplementation(() => ({
      role: "admin",
    }));

    Leave.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    const res = await request(app)
      .patch(ROUTES.UPDATE.replace(":id", mockLeave.userId))
      .set({
        Authorization: "Bearer mockedToken",
      })
      .send({ status: "approved" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Leave request not found");
  });

  it("should update leave request status successfully", async () => {
    jwt.verify.mockImplementation(() => ({
      role: "admin",
    }));

    Leave.findByIdAndUpdate = jest.fn().mockResolvedValue(mockLeave);

    const res = await request(app)
      .patch(ROUTES.UPDATE.replace(":id", mockLeave.userId))
      .set({
        Authorization: "Bearer mockedToken",
      })
      .send({ status: "approved" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Leave request status updated");
    expect(res.body.data).toBe(null);
  });
});
