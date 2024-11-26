const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

// Set up global configuration variables
dotenv.config();

/* This is the root route. It is used to check if the server is running. */
app.get("/", (req, res) => {
  res.status(200).json({ alive: "True" });
});

const errorHandler = require("./middleware/ErrorHandler.ts");
const AuthRoutes = require("./routes/AuthRoutes.ts");
const OrganizationRoutes = require("./routes/OrganizationRoutes.ts");
const PostalCodeRouters = require("./routes/PostalCodeRoutes.ts");
const CaseRouters = require("./routes/CaseRoutes.ts");
//Handle cors
app.use(cors());

/* A middleware that parses the body of the request and makes it available in the req.body object. */
app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

// Set specific routes
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/organization", OrganizationRoutes);
app.use("/api/v1/postal-code", PostalCodeRouters);
app.use("/api/v1/case", CaseRouters);

//Handle errors
app.use(errorHandler);

module.exports = app;
