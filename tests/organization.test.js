const request = require("supertest");
const app = require("../app");
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const mockingoose = require("mockingoose");
const Organization = require("../models/Organization.ts");
dotenv.config();

app.use(bodyParser.json());

describe("GET /api/v1/organization/:id", () => {

    beforeEach(() => {
      mockingoose.resetAll(); // Reset Mockingoose before each test
    });

    it("should check existing organization", async () => {
  
      mockingoose(Organization).toReturn(
        {
          exists: true,
        },
        "exists"
      );
  
      const response = await request(app).get(`/api/v1/organization/existsOrganization/673aa7da606a70768f0a09e4`);
  
      expect(response.statusCode).toBe(200);
    });
  
});