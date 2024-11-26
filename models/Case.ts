const mongoose = require("mongoose");

const CaseSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
        maxLength: [100, 'First name is too long'],
      },
      lastName: {
        type: String,
        required: true,
        maxLength: [100, 'Last name is too long'],
      },
      gender: {
        type: String,
        required: true,
        enum: ["FEMALE", "MALE", "DIVERSE", "INDETERMINATE"]
      },
      dateOfBirth: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
              return !isNaN(Date.parse(value)) && new Date(value).getTime() <= new Date().getTime();
            },
            message: props => `${props.value} is not a valid ISO 8601 date string! or date string is not valid because it is in the future`,
          },
      },
      degreeOfCare: {
        type: String,
        required: true,
        enum: ["NO_CARE_LEVEL_AVAILABLE",  "DEGREE_OF_CARE_1",  "DEGREE_OF_CARE_2",  "DEGREE_OF_CARE_3",  "DEGREE_OF_CARE_4",  "DEGREE_OF_CARE_5"]
      },
      postalCode: {
        type: String,
        required: true,
        maxLength: [5, 'Postal code is too long'],
      },
      telephoneNumberOfInquirer: {
        type: String,
        required: true,
        maxLength: [50, 'Telephone number of inquirer is too long'],
      },
      inquirerEmailAddress: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
              // Regular expression to validate email format
              return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: (props) => `${props.value} is not a valid email address!`,
          },
        maxLength: [100, 'Inquirer email address is too long'],
      },
      howIndependentIsThePersonConcernedInEverydayLife: {
        type: String,
        required: true,
        enum: [
            "COMPLETELY_INDEPENDENT_NO_HELP_NEEDED",
            "NEEDS_HELP_WITH_SOME_DAILY_TASKS_SUCH_AS_GETTING_DRESSED_OR_SHOPPING",
            "NEEDS_HELP_WITH_MANY_TASKS_EVERY_DAY",
            "CAN_DO_ALMOST_NOTHING_ON_HER_OWN_NEEDS_ROUND_THE_CLOCK_CARE"
        ]
      },
      doesThePersonHaveDifficultyRememberingThingsOrIsConfused: {
        type: String,
        required: true,
        enum: [
            "NO_THERE_IS_NO_MEMORY_OR_CONFUSION_PROBLEM",
            "YES_SOMETIMES_THERE_ARE_MINOR_DIFFICULTIES_REMEMBERING",
            "YES_FREQUENT_DIFFICULTIES_REMEMBERING_OR_CONFUSION"
        ]
      },
    whatKindOfSupportDoesThePersonConcernedCurrentlyReceive: {
        type: [String],
        required: true,
        enum: [
            "NO_HELP_NEEDED_SO_FAR",
            "HELP_FROM_FAMILY_OR_FRIENDS",
            "THERE_IS_REGULAR_HELP_IN_THE_HOUSEHOLD",
            "THERE_IS_ADVICE_ON_PREVENTION_OR_HEALTH_PROMOTION",
            "THERE_ARE_REGULAR_VISITS_FROM_A_CARE_SERVICE_OR_24_HOUR_CARE"
        ]
    },
    whatIsTheMainReasonForYourRequest: {
        type: String,
        required: true,
        enum: [
            "NEED_FOR_SUPPORT_IN_YOUR_OWN_HOME",
            "ROUND_THE_CLOCK_CARE",
            "ACUTE_NEED_FOR_CARE_DUE_TO_RECENT_EVENT",
            "INFORMATION_ON_SUPPORT_SERVICES_AND_OR_PREVENTIVE_MEASURES",
            "INFORMATION_ON_LIVING_IN_OLD_AGE"
        ]
    },
    iAgreeThisIsOneTimeUseAndIWontPutItInAnySharedLocation: {
        type: Boolean,
        required: true,
    },
    captchaVerificationCompleted: {
        type: Boolean,
        required: true
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Organization"
    }
    },
    { timestamps: true }
);
  
module.exports = mongoose.model("Case", CaseSchema);