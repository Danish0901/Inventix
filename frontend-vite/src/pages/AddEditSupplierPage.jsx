import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const AddEditSupplierPage = () => {
  const { supplierId } = useParams();
  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  // 🔹 REDIRECT non-admin users
  useEffect(() => {
    if (!ApiService.isAdmin()) {
      navigate("/supplier");
    }
  }, [navigate]);

  // Fetch supplier data if editing
  useEffect(() => {
    if (supplierId) {
      setIsEditing(true);

      const fetchSupplier = async () => {
        try {
          const supplierData = await ApiService.getSupplierById(supplierId);
          if (supplierData.status === 200) {
            setName(supplierData.supplier.name);
            setContactInfo(supplierData.supplier.contactInfo);
            setAddress(supplierData.supplier.address);
          }
        } catch (error) {
          showMessage(
            error.response?.data?.message ||
              "Error Getting a Supplier by Id: " + error
          );
        }
      };
      fetchSupplier();
    }
  }, [supplierId]);

  // Handle form submission for add/edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const supplierData = { name, contactInfo, address };

    try {
      if (isEditing) {
        await ApiService.updateSupplier(supplierId, supplierData);
        showMessage("Supplier Edited successfully");
        navigate("/supplier");
      } else {
        await ApiService.addSupplier(supplierData);
        showMessage("Supplier Added successfully");
        navigate("/supplier");
      }
    } catch (error) {
      showMessage(
        error.response?.data?.message ||
          "Error submitting supplier data: " + error
      );
    }
  };

  // Show temporary messages
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className="supplier-form-page">
        <h1>{isEditing ? "Edit Supplier" : "Add Supplier"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="supplier-name">Supplier Name</label>
            <input
              id="supplier-name"
              name="supplierName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              type="text"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact-info">Contact Info</label>
            <input
              id="contact-info"
              name="contactInfo"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
              type="text"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              name="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              type="text"
            />
          </div>

          <button type="submit">
            {isEditing ? "Edit Supplier" : "Add Supplier"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AddEditSupplierPage;
