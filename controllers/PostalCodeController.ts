const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const fetchFunction = require('node-fetch');

//@desc        Check postal code valid
//@route       GET /api/v1/postal-code/:postalCode
//@access      Public

exports.checkPostalCodeValid = asyncHandler(async (req, res) => {    

        let postalCode = await req.params.postalCode;

        if (!postalCode || postalCode?.length == 0) {
            return res.status(400).json({
                postalCodeValid: false
            });
        }

        let response = await fetchFunction(`https://api.openweathermap.org/data/2.5/weather?zip=${postalCode}&appid=${process.env.WEATHER_API_KEY}`)
        
        const data = await response.json();

        if (data?.cod == '400') {
            return res.status(400).json({
                postalCodeValid: false
            });
            
        };

        if (data?.cod == '404') {
            return res.status(404).json({
                postalCodeValid: false
            });
        };

        res.status(200).json({
            postalCodeValid: true
        });
});
