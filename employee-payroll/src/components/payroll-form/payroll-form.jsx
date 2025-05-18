import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import "./payroll-form.scss";
import EmployeeService from "../service/EmployeeService"; 

function PayrollForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const years = Array.from({ length: 100 }, (_, i) => 2025 - i);

  const [formData, setFormData] = useState({
    name: "",
    profileImage: "",
    gender: "",
    department: [],
    salary: "",
    startDay: "1",
    startMonth: "January",
    startYear: "2025",
    notes: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      fetchEmployeeData();
    }
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      setIsLoading(true);
      const employeeData = await EmployeeService.getEmployeeById(id);
      
      const startDate = new Date(employeeData.startDate);
      const startDay = startDate.getDate().toString();
      const startMonth = months[startDate.getMonth()];
      const startYear = startDate.getFullYear().toString();
      
      const departmentArray = employeeData.department 
        ? employeeData.department.split(', ').map(dept => dept.trim())
        : [];
      
      setFormData({
        name: employeeData.name || "",
        profileImage: employeeData.profileImage || "",
        gender: employeeData.gender || "",
        department: departmentArray,
        salary: employeeData.salary?.toString() || "",
        startDay,
        startMonth,
        startYear,
        notes: employeeData.notes || ""
      });
    } catch (err) {
      console.error('Error fetching employee:', err);
      setError('Failed to load employee data. ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevState => ({
          ...prevState,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRadioChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      gender: e.target.value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      department: checked
        ? [...prevState.department, value]
        : prevState.department.filter(dept => dept !== value)
    }));
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const getStartDate = () => {
    const monthIndex = months.indexOf(formData.startMonth) + 1;
    const day = formData.startDay.padStart(2, '0');
    const month = monthIndex.toString().padStart(2, '0');
    return `${formData.startYear}-${month}-${day}T00:00:00.000Z`;
  };

  const save = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      if (!formData.name || !formData.gender || formData.department.length === 0) {
        throw new Error("Name, gender, and at least one department are required");
      }

      if (formData.salary && parseFloat(formData.salary) < 10000) {
        throw new Error("Salary should be at least 10000");
      }

      const employeeData = {
        name: formData.name.trim(),
        salary: parseFloat(formData.salary) || 0,
        gender: formData.gender,
        department: formData.department.join(", "), 
        startDate: getStartDate(),
        notes: formData.notes.trim(),
        profileImage: formData.profileImage || "" // Ensure profileImage is included
      };

      let response;
      if (isEditMode) {
        // Update existing employee
        response = await EmployeeService.updateEmployee(id, employeeData);
        console.log('Employee updated successfully:', response);
      } else {
        // Create new employee
        response = await EmployeeService.addEmployee(employeeData);
        console.log('Employee added successfully:', response);
      }

      setSuccess(true);
      
      setTimeout(() => {
        resetForm();
        setSuccess(false);
        navigate('/home');
      }, 2000);

    } catch (err) {
      console.error('Error saving employee:', err);
      setError(err.message || 'Failed to save employee');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      profileImage: "",
      gender: "",
      department: [],
      salary: "",
      startDay: "1",
      startMonth: "January",
      startYear: "2025",
      notes: ""
    });
    
    const fileInput = document.getElementById('profile-image-input');
    if (fileInput) {
      fileInput.value = '';
    }
    
    setError(null);
    setSuccess(false);
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
      navigate('/home'); 
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset the form?')) {
      if (isEditMode) {
        fetchEmployeeData();
      } else {
        resetForm();
      }
    }
  };

  return (
    <div className="container">
      <div className="payroll-header">
        <h1>{isEditMode ? "Edit Employee" : "Add Employee"}</h1>
      </div>
      <form className="form" onSubmit={save}>
        <div className="content">
          <label>
            Name:
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your name" 
              required
              pattern="[A-Za-z ]{2,50}"
              title="Name must be 2-50 characters and contain only letters and spaces"
            />
          </label>

          <label>
            Profile Image:
            <input 
              id="profile-image-input"
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
            />
            {formData.profileImage && (
              <div className="image-preview">
                <img 
                  src={formData.profileImage} 
                  alt="Profile Preview" 
                  style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }}
                />
              </div>
            )}
          </label>

          <div>
            Gender:
            <label>
              <input 
                type="radio" 
                name="gender" 
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleRadioChange}
                required
              /> Male
            </label>
            <label>
              <input 
                type="radio" 
                name="gender" 
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleRadioChange}
                required
              /> Female
            </label>
          </div>

          <div>
            Department:
            <label>
              <input 
                type="checkbox" 
                value="HR"
                checked={formData.department.includes("HR")}
                onChange={handleCheckboxChange}
              /> HR
            </label>
            <label>
              <input 
                type="checkbox" 
                value="Sales"
                checked={formData.department.includes("Sales")}
                onChange={handleCheckboxChange}
              /> Sales
            </label>
            <label>
              <input 
                type="checkbox" 
                value="Finance"
                checked={formData.department.includes("Finance")}
                onChange={handleCheckboxChange}
              /> Finance
            </label>
            <label>
              <input 
                type="checkbox" 
                value="Engineer"
                checked={formData.department.includes("Engineer")}
                onChange={handleCheckboxChange}
              /> Engineer
            </label>
            <label>
              <input 
                type="checkbox" 
                value="Others"
                checked={formData.department.includes("Others")}
                onChange={handleCheckboxChange}
              /> Others
            </label>
          </div>

          <label>
            Salary:
            <input 
              type="number" 
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="Salary" 
              min="10000"
            />
          </label>

          <div className="date">
            <label>Start Date:</label>

            <select 
              className="date-picker"
              name="startDay"
              value={formData.startDay}
              onChange={handleDateChange}
            >
              {days.map((day) => (
                <option key={day} value={day.toString()}>
                  {day}
                </option>
              ))}
            </select>

            <select 
              className="month-picker"
              name="startMonth"
              value={formData.startMonth}
              onChange={handleDateChange}
            >
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>

            <select 
              className="year-picker"
              name="startYear"
              value={formData.startYear}
              onChange={handleDateChange}
            >
              {years.map((year) => (
                <option key={year} value={year.toString()}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <label>
            Notes:
            <input 
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Additional notes"
              rows="3"
            />
          </label>
        </div>

        {error && (
          <div className="error-message" style={{ 
            color: '#d32f2f', 
            backgroundColor: '#ffebee',
            padding: '10px',
            borderRadius: '4px',
            margin: '10px 0'
          }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div className="success-message" style={{ 
            color: '#2e7d32',
            backgroundColor: '#e8f5e9',
            padding: '10px',
            borderRadius: '4px',
            margin: '10px 0'
          }}>
            ✅ Employee data {isEditMode ? 'updated' : 'saved'} successfully!
          </div>
        )}

        <div className="Footer">
          <button type="button" onClick={handleCancel}>Cancel</button>
          <div className="Right">
            <button type="submit" disabled={isLoading}>
              {isLoading ? (isEditMode ? 'Updating...' : 'Saving...') : (isEditMode ? 'Update' : 'Submit')}
            </button>
            <button type="button" onClick={handleReset}>
              Reset
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PayrollForm;