const Case = require("../models/Case.ts");
const asyncHandler = require("express-async-handler");
const Organization = require("../models/Organization.ts");
const mongoose = require("mongoose");
const { sendEmailToPatient } = require("../services/SendEmail.ts");

//@desc        Save case
//@route       POST /api/v1/case/saveCase
//@access      Public

exports.saveCase = asyncHandler(async (req, res) => {
    
    const {firstName, lastName, gender, dateOfBirth, degreeOfCare, postalCode, telephoneNumberOfInquirer, inquirerEmailAddress, howIndependentIsThePersonConcernedInEverydayLife, doesThePersonHaveDifficultyRememberingThingsOrIsConfused, whatKindOfSupportDoesThePersonConcernedCurrentlyReceive, whatIsTheMainReasonForYourRequest, iAgreeThisIsOneTimeUseAndIWontPutItInAnySharedLocation, captchaVerificationCompleted, organizationId} = req.body;

    if (!firstName || !lastName || !gender || !dateOfBirth || !degreeOfCare || !postalCode || !telephoneNumberOfInquirer || !inquirerEmailAddress || !howIndependentIsThePersonConcernedInEverydayLife || !doesThePersonHaveDifficultyRememberingThingsOrIsConfused || !whatKindOfSupportDoesThePersonConcernedCurrentlyReceive || whatKindOfSupportDoesThePersonConcernedCurrentlyReceive?.length === 0 || !whatIsTheMainReasonForYourRequest || !iAgreeThisIsOneTimeUseAndIWontPutItInAnySharedLocation || !captchaVerificationCompleted || !organizationId) {
        res.status(400)
        throw new Error("Missing inputs of case. Please check again!");
    }

    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
        res.status(400)
        throw new Error("Invalid ID format");
    }

    const checkOrganizationExists = await Organization.exists({ _id: organizationId}); 

    if (!checkOrganizationExists) {
        res.status(404)
        throw new Error("This organization cannot be found");
    }

    await Case.create({
        firstName,
        lastName,
        gender,
        dateOfBirth,
        degreeOfCare,
        postalCode,
        telephoneNumberOfInquirer,
        inquirerEmailAddress,
        howIndependentIsThePersonConcernedInEverydayLife,
        doesThePersonHaveDifficultyRememberingThingsOrIsConfused,
        whatKindOfSupportDoesThePersonConcernedCurrentlyReceive,
        whatIsTheMainReasonForYourRequest,
        iAgreeThisIsOneTimeUseAndIWontPutItInAnySharedLocation,
        captchaVerificationCompleted,
        organization: organizationId,
    });

    sendEmailToPatient(inquirerEmailAddress, firstName, lastName);

    res.status(201).json({
        message: "Save case successfully!"
    });

});

//@desc        Get cases by organization ID
//@route       GET /api/v1/case/organization/:organizationId
//@access      Private

exports.getCaseByOrganizationId = asyncHandler(async (req, res) => {

    const organizationId = req?.params?.organizationId;

    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
        res.status(400)
        throw new Error("Invalid ID format");
    }

    const exists = await Organization.exists({ _id: organizationId });

    if (!exists) {
        res.status(404)
        throw new Error("Organization does not exist");
    };

    const allCasesByOrganizationId = await Case.find({ organization: organizationId}).populate("organization").sort({ createdAt: -1});

    const transformedCases = allCasesByOrganizationId.map((singleCase) => ({
        id: singleCase?._id,
        organizationName: singleCase?.organization?.username,
        createdAt: singleCase?.createdAt
    }));

    res.status(200).json({
        cases: transformedCases
    });
});

//@desc   Get single case by case id
//@route  GET /api/v1/case/:caseId
//@access Private

exports.getSingleCase = asyncHandler(async (req, res) => {

    let caseId = req?.params?.caseId;

    if (!mongoose.Types.ObjectId.isValid(caseId)) {
        res.status(400)
        throw new Error("Invalid ID format");
    };

    const exists = await Case.exists({ _id: caseId });

    if (!exists) {
        res.status(404)
        throw new Error("Case cannot be found");
    }

    const singleCase = await Case.findById(caseId).populate("organization");

    res.status(200).json(singleCase);
});
