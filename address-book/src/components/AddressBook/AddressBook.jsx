import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddressBook.css";
import FormService from "../../services/FormService.jsx";
function AddressBook() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleReset = () => {
    if(isEditMode){
      fetchData();
    }
    setFormData({
      fullName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
    });
  };

  const handleCancel = () => {
    navigate("/");
  };

  const save = async (e) => {
    e.preventDefault();

    setError(null);
    setSuccess(false);
    setIsLoading(true);
    try {
      const personData = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      };

      let response;
      if (!isEditMode) {
        response = await FormService.addPerson(personData);
        console.log("Person details added successfully: ", response);
      } else {
        response = await FormService.updatePerson(id, personData);
        console.log("Person details updated successfully: ", response);
      }
      setSuccess(true);
      console.log("Person details added successfully: ", response);

      setTimeout(() => {
        handleReset();
        setSuccess(false);
        navigate("/home");
      }, 2000);
    } catch (error) {
      console.error("Error saving person details:", error);
      setError(error.message || "Failed to save person details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchData();
    }
  }, [id, isEditMode]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const personData = await FormService.getPersonById(id);
      setFormData({
        fullName: personData.fullName || "",
        phoneNumber: personData.phoneNumber || "",
        address: personData.address || "",
        city: personData.city || "",
        state: personData.state || "",
        zipCode: personData.zipCode || "",
      });
    } catch (error) {
      console.error("Failed to edit the person details:", error);
      setError("Failed to load the person details:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="address-form">
      <div className="form-header">
        <h1>Person Address Form</h1>
        <button type="button" onClick={handleCancel} className="close-button">
          X
        </button>
      </div>

      <form className="form-content" onSubmit={save}>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            pattern="[0-9]{10}"
            maxLength={10}
            onChange={handleInputChange}
            title="Enter a 10-digit phone number"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            id="address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="state">State</label>
          <input
            id="state"
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="zipCode">Zip Code</label>
          <input
            id="zipCode"
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-buttons">
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : isEditMode ? "Update" : "Add"}{" "}
          </button>
          <button type="button" onClick={handleReset}>
            {isEditMode ? "Revert Changes" : "Reset"}
          </button>
        </div>

        {success && (
          <p className="success-message">
            {isEditMode
              ? "Address updated successfully!"
              : "Address saved successfully!"}
          </p>
        )}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}

export default AddressBook;
