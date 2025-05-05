import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDeliveryPartnerById } from "../../Services/DeliveryPartnerService";
import "./DeliveryPartnerProfile.css"; // Optional: for custom styling

const DeliveryPartnerProfile = () => {
  const navigate = useNavigate();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPartnerData = async () => {
      try {
        setLoading(true);
        setError(null);

        const deliveryPartnerId = JSON.parse(sessionStorage.getItem("user"))?.id;
        if (!deliveryPartnerId || isNaN(deliveryPartnerId)) {
          throw new Error("Invalid delivery partner ID");
        }

        const response = await getDeliveryPartnerById(deliveryPartnerId);
        console.log("Delivery partner response:", response.data);
        setPartner(response.data);
      } catch (err) {
        console.error("Failed to fetch delivery partner data:", err);
        setError(err.response?.data || err.message || "Failed to load profile");

        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPartnerData();
  }, [navigate]);

  if (loading) return <div className="dpp-loading">Loading profile...</div>;
  if (error) return <div className="dpp-error">Error: {error}</div>;
  if (!partner) return <div className="dpp-error">No delivery partner data found</div>;

  return (
    <div className="dpp-delivery-partner-profile">
      <h2>Delivery Partner Profile</h2>

      <div className="dpp-info-section">
        <h3>Basic Information</h3>
        <div className="dpp-info-grid">
          <div className="dpp-info-item">
            <span className="dpp-info-label">Full Name: </span>
            <span className="dpp-info-value">{partner.fullName}</span>
          </div>
          <div className="dpp-info-item">
            <span className="dpp-info-label">Email: </span>
            <span className="dpp-info-value">{partner.email}</span>
          </div>
          <div className="dpp-info-item">
            <span className="dpp-info-label">Phone: </span>
            <span className="dpp-info-value">{partner.phone}</span>
          </div>
          <div className="dpp-info-item">
            <span className="dpp-info-label">Vehicle Number: </span>
            <span className="dpp-info-value">{partner.vehicleNumber}</span>
          </div>
          <div className="dpp-info-item">
            <span className="dpp-info-label">Availability: </span>
            <span className="dpp-info-value">{partner.isAvailable ? "Available" : "Unavailable"}</span>
          </div>
          <div className="dpp-info-item">
            <span className="dpp-info-label">Username: </span>
            <span className="dpp-info-value">{partner.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPartnerProfile;
