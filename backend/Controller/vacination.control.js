const mongoose = require("mongoose");
const vaccinationModel = require('../model/vacination.model.js')


//add - vac
const addvac = async (req , res) => {
    try{
        const{vaccine_name , required_age, location, from_date, last_date, description} = req.body;

        var vaccination_detail = new vaccinationModel({
            vaccine_name, 
            required_age, 
            location, 
            from_date, 
            last_date, 
            description,
        });

        await vaccination_detail.save();
        console.log(`${vaccine_name} added successfully`);
        res.status(200).json({ message: `${vaccine_name} added successfully`, vaccination_detail});
    } catch(err){
        console.log(err);
        res.status(500).send("Error adding vaccination");
    }
}


//delete - vac  
const deletevac = async(req, res) => 
{
    try{
        const { id } = req.params;

        const deletevac = await vaccinationModel.findByIdAndDelete(id);
        console.log(deletevac)
        if(!deletevac) {
            return res.status(404).json({message: "Vaccine not found"});
        }

        console.log(`Vaccination with ID ${id} deleted successfull`);
        res.status(200).json({ message: "Vaccine deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error deleting vaccine");
    }
}



//put - vac
const updatevac = async (req,res) =>{
    try{
        const { id } = req.params;

    // Validate ObjectId before proceeding
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid Vaccination ID format" });
      }
  
      const updatedvac = await vaccinationModel.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedvac) {
        return res.status(404).json({ message: "Vaccine not found" });
      }
  
      res.status(200).json({ message: "Vaccine updated successfully", updatedvac });
    } catch (error) {
      console.error("Error updating Vaccine:", error);
      res.status(500).json({ message: "Error updating Vaccine" });
    }
  };


//get - vac
const vacList = async(req,res) => {
    try{
      
        const vaccine = await vaccinationModel.find(); 
        res.status(200).json(vaccine);
    } catch(err) {
        console.log(err);
        res.status(500).send("Error fetching vaccine");
    }
}

module.exports = { addvac, deletevac, updatevac, vacList};