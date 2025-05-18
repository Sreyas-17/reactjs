import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeService from "../service/EmployeeService";
import "./home.scss";

function Home() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // New state to track loaded images
  const [loadingImages, setLoadingImages] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await EmployeeService.getAllEmployees();
      setEmployees(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch employees: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await EmployeeService.deleteEmployee(id);
        setEmployees(employees.filter((emp) => emp.id !== id));
      } catch (err) {
        alert("Failed to delete employee: " + err.message);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleAddNew = () => {
    navigate("/add");
  };

  const handleImageLoad = (id) => {
    setLoadingImages((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

const defaultProfileImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNlMWUxZTEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxOCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UsIHNhbnMtc2VyaWYiIGZpbGw9IiM1NTU1NTUiPj88L3RleHQ+PC9zdmc+";
  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-container">
      <header className="header">
        <h1>Employee Details</h1>
        <button className="add-button" onClick={handleAddNew}>
          + Add Employee
        </button>
      </header>

      <div className="employee-count">Total Employees: {employees.length}</div>

      {employees.length === 0 ? (
        <div className="no-employees">
          <p>No employees found.</p>
          <button onClick={handleAddNew}>Add Your First Employee</button>
        </div>
      ) : (
        <div className="employees-table">
          <table>
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Department</th>
                <th>Salary</th>
                <th>Start Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="profile-cell">
                    <div className="image-container">
                      {/* Show placeholder until image is loaded */}
                      {!loadingImages[employee.id] && (
                        <div className="placeholder-loader"></div>
                      )}
                      <img
                        src={employee.profileImage || defaultProfileImage}
                        alt={`${employee.name}'s profile`}
                        className={`profile-image ${
                          loadingImages[employee.id] ? "visible" : "hidden"
                        }`}
                        onLoad={() => handleImageLoad(employee.id)}
                        onError={(e) => {
                          e.target.src = defaultProfileImage;
                          handleImageLoad(employee.id);
                        }}
                      />
                    </div>
                  </td>
                  <td>{employee.name}</td>
                  <td>{employee.gender}</td>
                  <td>{employee.department}</td>
                  <td>₹{employee.salary.toLocaleString()}</td>
                  <td>{new Date(employee.startDate).toLocaleDateString()}</td>
                  <td className="actions">
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(employee.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(employee.id)}
                    >
                      Delete
                    </button>
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
