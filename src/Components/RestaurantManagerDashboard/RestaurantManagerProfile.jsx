import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getManagerById } from "../../Services/RestaurantManagerService";
import "./RestaurantManagerProfile.css";

const RestaurantManagerProfile = () => {
  const navigate = useNavigate();
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchManagerData = async () => {
      try {
        setLoading(true);
        setError(null);

        const managerIdFromSession = JSON.parse(sessionStorage.getItem("user"))?.id;
        if (!managerIdFromSession || isNaN(managerIdFromSession)) {
          throw new Error("Invalid manager ID");
        }

        const response = await getManagerById(managerIdFromSession);
        // console.log("Manager response:", response.data); // Debug log
        setManager(response.data);
      } catch (err) {
        console.error("Failed to fetch manager data:", err);
        setError(err.response?.data?.message || err.message || "Failed to load manager profile");

        if (err.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchManagerData();
  }, [navigate]);

  if (loading) return <div className="rmp-loading">Loading profile...</div>;
  if (error) return <div className="rmp-error">Error: {error}</div>;
  if (!manager) return <div className="rmp-error">No manager data found</div>;

  return (
    <div className="rmp-restaurant-manager-profile">
      <h2>Restaurant Manager Profile</h2>

      <div className="rmp-info-section">
        <h3>Basic Information</h3>
        <div className="rmp-info-grid">
          <div className="rmp-info-item">
            <span className="rmp-info-label">Full Name:</span>
            <span className="rmp-info-value">{manager.fullName}</span>
          </div>
          <div className="rmp-info-item">
            <span className="rmp-info-label">Email:</span>
            <span className="rmp-info-value">{manager.email}</span>
          </div>
          <div className="rmp-info-item">
            <span className="rmp-info-label">Phone:</span>
            <span className="rmp-info-value">{manager.phone}</span>
          </div>
          <div className="rmp-info-item">
            <span className="rmp-info-label">Restaurant:</span>
            <span className="rmp-info-value">{manager.restaurantName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantManagerProfile;
