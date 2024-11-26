const request = require("supertest");
const app = require("../app");
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const mockingoose = require("mockingoose");
const Organization = require("../models/Organization.ts");
const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken');
dotenv.config();

app.use(bodyParser.json());

/* Testing the Auth API endpoints. */
describe("POST /api/v1/auth/register", () => {

  beforeEach(() => {
    mockingoose.resetAll(); // Reset Mockingoose before each test
  });

  it("should register organization successfully", async () => {

    mockingoose(Organization).toReturn(
      {
        _id: "mockedUserId",
        username: "tester",
        email: "test3@example.com",
      },
      "save"
    );

    const response = await request(app).post("/api/v1/auth/register").send({
      "username": "tester",
      "email": "test3@example.com",
      "password": "test123456",
    });

    expect(response.statusCode).toBe(201);
  });

});

describe("POST /api/v1/auth/login", () => {
  
  beforeEach(() => {
    mockingoose.resetAll(); // Reset Mockingoose before each test
  });

  it("should log in as an organization successfully", async () => {

    mockingoose(Organization).toReturn(
      {
        _id: "mockedUserId",
        email: "test3@example.com",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2FhOGQ2ZDA4ZTM3MzA4YmFmNWI3MiIsImlhdCI6MTczMTkxNDcyOSwiZXhwIjoxNzMxOTE1MDI5fQ.zs_FF0KHDVHTAZ_hHNT0Pq3Ah0jmsGJk5DJbP-AZq44",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2FhOGQ2ZDA4ZTM3MzA4YmFmNWI3MiIsImlhdCI6MTczMTkxNDcyOSwiZXhwIjoxNzM0NTA2NzI5fQ.b2_XW_r_BB6Nx1SoJ44iEA_LMEZYlp6o1bebxj1Dxrg"
      },
      "findOne"
    );

    const response = await request(app).post("/api/v1/auth/login").send({
      "username": "tester",
      "email": "test3@example.com",
      "password": "test123456",
    });

    expect(response.statusCode).toBe(200);
  });

});

describe("POST /api/v1/auth/getNewTokenFromRefreshToken", () => {

  

  it("should get a new token from a refresh token successfully", async () => {

    jwt.verify.mockImplementation((token, secret) => {
      if (token === 'validToken' && secret === process.env.JWT_SECRET) {
          return { id: 1, email: 'test@example.com' }; 
      }
      throw new Error('Invalid token');
  });

    const response = await request(app).post("/api/v1/auth/getNewTokenFromRefreshToken").send({
      "refreshToken": "validToken"
    });

    expect(response.statusCode).toBe(201);
  });

});






