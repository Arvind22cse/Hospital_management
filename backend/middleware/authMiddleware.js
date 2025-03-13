
const authenticateDoctor = (req, res, next) => {
    if (!req.session.doctorId) {
      return res.status(401).json({ message: "Please log in first" });
    }
    next();
  };


module.exports = { authenticateDoctor };

  