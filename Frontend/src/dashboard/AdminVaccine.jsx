import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminVaccine.css"; // Import CSS for styling
import Admindashboard from "./Admindashboard";

function VaccineCard() {
  const [vaccines, setVaccines] = useState([]);
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State for the popup visibility
  const [formData, setFormData] = useState({
    vaccine_name: "",
    required_age: "",
    location: "",
    from_date: "",
    last_date: "",
    description: "",
  });

  useEffect(() => {
    fetchVaccines();
  }, []);

  const fetchVaccines = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/list-vac");
      setVaccines(response.data);
    } catch (error) {
      console.error("Error fetching vaccine details:", error);
    }
  };

  const handleAddVaccine = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/admin/add-vac", formData);
      fetchVaccines(); // Refresh list
      setFormData({
        vaccine_name: "",
        required_age: "",
        location: "",
        from_date: "",
        last_date: "",
        description: "",
      });
      setShowPopup(false); // Close the popup after submission
      toast.success("Vaccine added successfully!");
    } catch (error) {
      console.error("Error adding vaccine:", error);
      toast.error("Failed to add vaccine.");
    }
  };

  const handleEditClick = (vaccine) => {
    setEditingVaccine(vaccine._id);
    setFormData({
      vaccine_name: vaccine.vaccine_name,
      required_age: vaccine.required_age,
      location: vaccine.location,
      from_date: vaccine.from_date.split("T")[0],
      last_date: vaccine.last_date.split("T")[0],
      description: vaccine.description,
    });
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:3000/api/admin/uvac/${editingVaccine}`, formData);
      setEditingVaccine(null);
      fetchVaccines(); // Refresh vaccine list
      toast.success("Vaccine updated successfully!");
    } catch (error) {
      console.error("Error updating vaccine:", error);
      toast.error("Failed to update vaccine.");
    }
  };

  const deleteVaccine = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/dvac/${id}`);
      setVaccines(vaccines.filter((vaccine) => vaccine._id !== id));
      toast.success("Vaccine deleted successfully!");
    } catch (error) {
      console.error("Error deleting vaccine:", error);
      toast.error("Failed to delete vaccine.");
    }
  };

  return (
    <>
      <Admindashboard />
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Button to open the popup */}
      <button onClick={() => setShowPopup(true)} className="open-popup-btn" id="addvacine" style={{marginTop:"200px"}}>
        Add Vaccine
      </button>

      {/* Blur background when popup is open */}
      {showPopup && <div className="blur-background"></div>}

      {/* Popup Modal */}
      {showPopup && (
       <div
       className="modal"
      
     >
       <div className="modal-content" style={{ position: "relative" }}>
         <span
           className="close-btn"
           onClick={() => setShowPopup(false)}
           style={{
             position: "absolute",
             top: "10px",
             right: "15px",
             fontSize: "24px",
             cursor: "pointer",
             color: "#333",
           }}
         >
           &times;
         </span>
         <h2 style={{ textAlign: "center" }}>Add Vaccine</h2>
         <form
           onSubmit={handleAddVaccine}
           style={{ display: "flex", flexDirection: "column" }}
         >
           <input
             type="text"
             placeholder="Vaccine Name"
             value={formData.vaccine_name}
             onChange={(e) =>
               setFormData({ ...formData, vaccine_name: e.target.value })
             }
             required
             style={{
               padding: "10px",
               margin: "10px 0",
               border: "1px solid #ccc",
               borderRadius: "5px",
               fontSize: "16px",
             }}
           />
           <input
             type="number"
             placeholder="Required Age"
             value={formData.required_age}
             onChange={(e) =>
               setFormData({ ...formData, required_age: e.target.value })
             }
             required
             style={{
               padding: "10px",
               margin: "10px 0",
               border: "1px solid #ccc",
               borderRadius: "5px",
               fontSize: "16px",
             }}
           />
           <input
             type="text"
             placeholder="Location"
             value={formData.location}
             onChange={(e) =>
               setFormData({ ...formData, location: e.target.value })
             }
             required
             style={{
               padding: "10px",
               margin: "10px 0",
               border: "1px solid #ccc",
               borderRadius: "5px",
               fontSize: "16px",
             }}
           />
           <input
             type="date"
             value={formData.from_date}
             onChange={(e) =>
               setFormData({ ...formData, from_date: e.target.value })
             }
             required
             style={{
               padding: "10px",
               margin: "10px 0",
               border: "1px solid #ccc",
               borderRadius: "5px",
               fontSize: "16px",
             }}
           />
           <input
             type="date"
             value={formData.last_date}
             onChange={(e) =>
               setFormData({ ...formData, last_date: e.target.value })
             }
             required
             style={{
               padding: "10px",
               margin: "10px 0",
               border: "1px solid #ccc",
               borderRadius: "5px",
               fontSize: "16px",
             }}
           />
           <input
             type="text"
             placeholder="Description"
             value={formData.description}
             onChange={(e) =>
               setFormData({ ...formData, description: e.target.value })
             }
             required
             style={{
               padding: "10px",
               margin: "10px 0",
               border: "1px solid #ccc",
               borderRadius: "5px",
               fontSize: "16px",
             }}
           />
           <button
             type="submit"
             className="add-btn"
             style={{
               padding: "10px",
               marginTop: "10px",
               fontSize: "16px",
               border: "none",
               borderRadius: "5px",
               cursor: "pointer",
               backgroundColor: "#28a745",
               color: "white",
             }}
           >
             Add Vaccine
           </button>
         </form>
       </div>
     </div>
     
      )}

      {/* Display Vaccines */}
      <div className="vaccine-container">
        {vaccines.map((vaccine) => (
          <div key={vaccine._id} className="vaccine-card">
            {editingVaccine === vaccine._id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={formData.vaccine_name}
                  onChange={(e) => setFormData({ ...formData, vaccine_name: e.target.value })}
                  style={{
                    width:"200px",
                    height:"50px",
                  }}
                />
                <br />
                <input
                  type="number"
                  value={formData.required_age}
                  onChange={(e) => setFormData({ ...formData, required_age: e.target.value })}
                  style={{
                    width:"200px",
                    height:"50px",
                  }}
                /> <br />
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{
                    width:"200px",
                    height:"50px",
                  }}
                />
<br />
                <input
                  type="date"
                  value={formData.from_date}
                  onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                  style={{
                    width:"200px",
                    height:"50px",
                  }}
                />
                <br />
                <input
                  type="date"
                  value={formData.last_date}
                  onChange={(e) => setFormData({ ...formData, last_date: e.target.value })}
                  style={{
                    width:"200px",
                    height:"50px",
                  }}
                />
                <br />
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width:"200px",
                    height:"50px",
                  }}
                />
                <br />
                <button onClick={handleUpdate} className="update-btn">Update</button>
                <button onClick={() => setEditingVaccine(null)} className="cancel-btn">Cancel</button>
              </div>
            ) : (
              <>
                <h2>{vaccine.vaccine_name}</h2>
                <p><strong>Required Age:</strong> {vaccine.required_age} years</p>
                <p><strong>Location:</strong> {vaccine.location}</p>
                <p><strong>From Date:</strong> {new Date(vaccine.from_date).toLocaleDateString()}</p>
                <p><strong>Last Date:</strong> {new Date(vaccine.last_date).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {vaccine.description}</p>
                <button onClick={() => handleEditClick(vaccine)} className="edit-btn">Edit</button>
                <button onClick={() => deleteVaccine(vaccine._id)} className="delete-btn">Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default VaccineCard;