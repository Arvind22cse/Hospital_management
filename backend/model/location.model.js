const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    doctorId: {
        type: String,
        required: true
      },
      address: {
        type: String,
        required: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
   
});

const addressmodel = mongoose.model("address", addressSchema);

module.exports = addressmodel;
