const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    imagePath:{
        type: String,
    },
   
});

const imagemodel = mongoose.model("image", imageSchema);

module.exports = imagemodel;
