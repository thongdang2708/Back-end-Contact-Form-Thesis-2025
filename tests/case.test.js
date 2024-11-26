const request = require("supertest");
const app = require("../app");
const bodyParser = require('body-parser');
const dotenv = require("dotenv");
const Organization = require('../models/Organization.ts'); // Assuming your Organization model is in a file named 'Organization.js'
const Case = require('../models/Case.ts');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
dotenv.config();

app.use(bodyParser.json());
const nodemailer = require('nodemailer');
jest.mock('jsonwebtoken');
jest.mock('nodemailer');

describe("POST /api/v1/case/saveCase", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should create case successfully", async () => {
        const validOrganizationId = "673aa7da606a70768f0a09e4";

        jest.spyOn(Organization, "exists").mockResolvedValue(true);

        jest.spyOn(Case, "create").mockResolvedValue({});
        
        const sendMailMock = jest.fn().mockResolvedValue({ messageId: 'mocked-id' });
        nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

        const body = {
            firstName: "Thong",
            lastName: "Dang",
            gender: "MALE",
            dateOfBirth: "2024-11-21T22:00:00.000Z",
            degreeOfCare: "NO_CARE_LEVEL_AVAILABLE",
            postalCode: "02650",
            telephoneNumberOfInquirer: "358468419913",
            inquirerEmailAddress: "customercontactformdemo2708@gmail.com",
            howIndependentIsThePersonConcernedInEverydayLife: "COMPLETELY_INDEPENDENT_NO_HELP_NEEDED",
            doesThePersonHaveDifficultyRememberingThingsOrIsConfused: "NO_THERE_IS_NO_MEMORY_OR_CONFUSION_PROBLEM",
            whatKindOfSupportDoesThePersonConcernedCurrentlyReceive: [
                "NO_HELP_NEEDED_SO_FAR",
                "HELP_FROM_FAMILY_OR_FRIENDS",
                "THERE_IS_REGULAR_HELP_IN_THE_HOUSEHOLD",
                "THERE_IS_ADVICE_ON_PREVENTION_OR_HEALTH_PROMOTION",
                "THERE_ARE_REGULAR_VISITS_FROM_A_CARE_SERVICE_OR_24_HOUR_CARE"
            ],
            whatIsTheMainReasonForYourRequest: "NEED_FOR_SUPPORT_IN_YOUR_OWN_HOME",
            iAgreeThisIsOneTimeUseAndIWontPutItInAnySharedLocation: true,
            captchaVerificationCompleted: true,
            organizationId: validOrganizationId
        };

        const response = await request(app)
            .post("/api/v1/case/saveCase")
            .send(body);

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Save case successfully!");
    });
});

jest.mock('../middleware/Protect.ts', () => ({
    protect: (req, res, next) => {
        req.organization = { id: 'validUserId' };
        next();
    }
}));

describe("GET /api/v1/case/organization/:organizationId", () => {

    let validOrganizationId;
    let validCaseId;

    beforeEach(async () => {
        validOrganizationId = new mongoose.Types.ObjectId().toString();
        validCaseId = new mongoose.Types.ObjectId().toString();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should get cases by organization id", async () => {
        const mockCases = [
            { id: new mongoose.Types.ObjectId().toString(), organizationName: 'Case 1' },
            { id: new mongoose.Types.ObjectId().toString(), organizationName: 'Case 2' }
        ];
        jest.spyOn(Organization, "exists").mockResolvedValueOnce(true);
        jest.spyOn(Case,"find").mockResolvedValueOnce(mockCases);

        const response = await request(app)
            .get(`/api/v1/case/organization/${validOrganizationId}`)
            .set('Authorization', `Bearer test`); // Replace with your valid token

        expect(response.status).toBe(200);
    });

    it("should get case by single case", async () => {
        const mockCase = {
            id: new mongoose.Types.ObjectId().toString(), organizationName: 'Case 1' 
        }

        jest.spyOn(Case, "exists").mockResolvedValueOnce(true);
        jest.spyOn(Case, "findById").mockResolvedValueOnce(mockCase);

        const response = await request(app)
            .get(`/api/v1/case/${validCaseId}`)
            .set('Authorization', 'Bearer test');

        expect(response.statusCode).toBe(200);
    })
})



