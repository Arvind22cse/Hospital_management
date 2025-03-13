const mongoose = require("mongoose");

const PHCSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["PHC", "Upgraded PHC", "Sub-Centre"],
    required: true,
  },
  services: [
    {
      type: String,
      enum: [
        "Outpatient Visits",
        "Immunization Programs",
        "Maternal Healthcare",
        "Disease Surveillance",
        "Emergency Care Availability",
      ],
    },
  ],

  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Doctor" }],
  contact_info: {
    type: String,
    required: true,
  },
  facilities: [
    {
      type: String,
      enum: ["Pharmacy", "Lab Testing", "Ambulance Availability"],
    },
  ],
  alerts: [String],
  additional_services: [
    {
      type: String,
      enum: [
        "Inpatient Facilities",
        "Surgery or Specialized Treatments",
        "Referral Services",
        "Telemedicine/Online Consultations Availability",
      ],
    },
  ],
  basic_services: [
    {
      type: String,
      enum: [
        "Immunization & Vaccination",
        "Nutrition & Childcare",
        "Pregnancy Care",
        "Common Disease Treatment",
        "Midwife/Nurse Availability",
        "Emergency Contact for Nearby PHC",
      ],
    },
  ],
});

const phcModel = mongoose.model("PHC", PHCSchema);

module.exports = phcModel;
