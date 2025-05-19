const DiseaseModel = require('../model/disease.model');

exports.getDiseases = async (req, res, next) => {
    let query = req.query.keyword?{ name: { 
        $regex: req.query.keyword,
        $options: 'i'
    }}:{}

    const diseases = await DiseaseModel.find(query);
    

    res.json({
        success: true,
        diseases
    })

}


exports.getSingleDisease = async (req, res, next) => {
    try{

    const disease = await DiseaseModel.findById(req.params.id);
    res.json({
        success: true,
        disease
    })
} catch(error){
    res.status(404).json({
        success: false,
        message: "Id not found"
    })
}

}