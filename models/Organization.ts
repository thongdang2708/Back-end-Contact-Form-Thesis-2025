const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        required: true,
        unique: true,
        maxLength: [100, 'Username is too long'],
      },
      email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (value) {
              // Regular expression to validate email format
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: (props) => `${props.value} is not a valid email address!`,
          },
        maxLength: [100, 'Email is too long'],
      },
      password: {
        type: String,
        required: true,
        maxLength: [100, 'Password is too long'],
      },
    },
    { timestamps: true }
);
  
module.exports = mongoose.model("Organization", OrganizationSchema);