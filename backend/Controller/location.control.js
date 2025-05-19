const mongoose = require("mongoose");
const locationmodel = require('../model/location.model.js');


//add - vac
const postlocation = async (req , res) => {
    try {
      console.log("Received body:", req.body); // <-- Add this line
      const { doctorId, address } = req.body;
      const location_detail = new locationmodel({doctorId, address ,timestamp: new Date(),});
      await location_detail.save();
      res.status(200).json({ message: `${address} added successfully`, location_detail });
    } catch(err) {
      console.log(err);
      res.status(500).send("Error adding location");
    }
  }
  
const getlocation = async(req,res) => {
    try{
      
        const loc = await locationmodel.find(); 
        res.status(200).json(loc);
    } catch(err) {
        console.log(err);
        res.status(500).send("Error fetching location data");
    }
}


module.exports = { postlocation ,getlocation};