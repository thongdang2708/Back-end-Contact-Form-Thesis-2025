const Organization = require("../models/Organization.ts");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

//@desc        Check exists organization
//@route       GET /api/v1/organization/existsOrganization/:id
//@access      Public

exports.existsOrganization = asyncHandler(async (req, res) => {
  
    let organizationId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(organizationId)) {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    const exists = await Organization.exists({_id: organizationId});

    if (!exists) {
        return res.status(200).json({ exists: false});
    }
  
    res.status(200).json({
        exists: true
    });
});
