import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FormService from "../../services/FormService";
import "./Home.css";
function Home() {
  const [form, setForm] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const data = await FormService.getPersons();
      setForm(data);
    } catch (error) {
      setError("Failed to fetch person details: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading people data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const handleAddNew = () => {
    navigate("/add");
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this person details?")
    ) {
      try {
        await FormService.deletePerson(id);
        setForm(form.filter((person) => person.id !== id));
      } catch (err) {
        alert("Failed to delete person details: " + err.message);
      }
    }
  };

  const handleEdit =async (id) =>{
    navigate(`/edit/${id}`);
  }

  return (
    <div className="home-container">
      <header className="header">
        <h1> People Details </h1>
        <button className="add-button" onClick={handleAddNew}>
          + Add People
        </button>
      </header>

      <div className="people-count">Total People: {form.length}</div>

      {form.length === 0 ? (
        <div className="no-people">
          <p>No person details found.</p>
          <button onClick={handleAddNew}>Add Your First Person details</button>
        </div>
      ) : (
        <div className="details-table">
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Phone Number</th>
                <th>Zip Code</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {form.map((formData) => (
                <tr key={formData.id}>
                  <td>{formData.fullName}</td>
                  <td>{formData.address}</td>
                  <td>{formData.city}</td>
                  <td>{formData.state}</td>
                  <td>{formData.phoneNumber}</td>
                  <td>{formData.zipCode}</td>
                  <td className="actions">
                    <button className="edit-btn" onClick ={()=>handleEdit(formData.id)}>Edit</button>
                    <button className="delete-btn" onClick={()=>handleDelete(formData.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Home;
