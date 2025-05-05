import React, { useState, useEffect } from 'react';
import {
  getAllDeliveryPartners,
  updateDeliveryPartner,
  deleteDeliveryPartner,
} from "../../../Services/DeliveryPartnerService";
import './ViewAllDeliveryPartner.css';

const ViewAllDeliveryPartner = () => {
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await getAllDeliveryPartners();
      setDeliveryPartners(response.data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const handleEditClick = (partner) => {
    setSelectedPartner({ ...partner });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this partner?")) {
      try {
        await deleteDeliveryPartner(id);
        fetchPartners();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedPartner((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async () => {
    try {
      await updateDeliveryPartner(selectedPartner.deliveryPartnerId, selectedPartner);
      setIsModalOpen(false);
      fetchPartners();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="ViewDP-view-all-delivery-partners">
      <h1>All Delivery Partners</h1>
      <table className="ViewDP-partner-table">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Phone</th><th>Vehicle</th><th>Available</th><th>Username</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveryPartners.length === 0 ? (
            <tr><td colSpan="7">No delivery partners found</td></tr>
          ) : (
            deliveryPartners.map((partner) => (
              <tr key={partner.partnerId}>
                <td>{partner.fullName}</td>
                <td>{partner.email}</td>
                <td>{partner.phone}</td>
                <td>{partner.vehicleNumber}</td>
                <td>{partner.isAvailable ? "Yes" : "No"}</td>
                <td>{partner.username}</td>
                <td>
                  <button className="ViewDP-edit-button" onClick={() => handleEditClick(partner)}>Edit</button>
                  <button className="ViewDP-delete-button" onClick={() => handleDeleteClick(partner.partnerId)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal Form */}
      {isModalOpen && selectedPartner && (
        <div className="ViewDP-modal">
          <div className="ViewDP-modal-content">
            <h2>Edit Partner</h2>
            <label>Full Name:</label>
            <input type="text" name="fullName" value={selectedPartner.fullName} onChange={handleChange} />
            <label>Email:</label>
            <input type="email" name="email" value={selectedPartner.email} onChange={handleChange} />
            <label>Phone:</label>
            <input type="text" name="phone" value={selectedPartner.phone} onChange={handleChange} />
            <label>Vehicle Number:</label>
            <input type="text" name="vehicleNumber" value={selectedPartner.vehicleNumber} onChange={handleChange} />
            <label>
              <input type="checkbox" name="isAvailable" checked={selectedPartner.isAvailable} onChange={handleChange} />
              Available
            </label>
            <div className="ViewDP-modal-buttons">
              <button className="ViewDP-update-button" onClick={handleUpdate}>Update</button>
              <button className="ViewDP-cancel-button" onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAllDeliveryPartner;
