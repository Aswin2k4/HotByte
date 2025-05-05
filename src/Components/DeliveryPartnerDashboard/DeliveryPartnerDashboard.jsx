import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdDashboard,
  MdDeliveryDining,
  MdPerson,
  MdMenu,
  MdClose
} from 'react-icons/md';
import { IoMdLogOut } from 'react-icons/io';
import { 
  GetDeliveryPartnerOrdersAPICall,
  UpdateOrderDeliveryStatusAPICall 
} from '../../Services/DeliveryPartnerService';
import './DeliveryPartnerDashboard.css';

const DeliveryPartnerDashboard = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryPartner, setDeliveryPartner] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (!user || user.role.toLowerCase() !== "deliverypartner") {
      navigate("/login");
      return;
    }
    setDeliveryPartner(user);
    fetchOrders(user.id);
  }, [navigate]);

  const fetchOrders = async (deliveryPartnerId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await GetDeliveryPartnerOrdersAPICall(deliveryPartnerId);
      
      // Transform API response to match our expected format
      const formattedOrders = response.data.map(order => ({
        ...order,
        deliveryAddress: order.customerAddress, // Map customerAddress to deliveryAddress
        orderItems: order.orderedItems || [],   // Map orderedItems to orderItems
        statusId: order.statusId || 4           // Default to "Ready for Pickup" if status not provided
      }));
      
      setOrders(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load orders. Please try again.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNavigation = (path, itemName) => {
    navigate(path);
    setActiveItem(itemName);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  const updateOrderStatus = async (orderId, newStatusId) => {
    try {
      setLoading(true);
      
      // Validate status transition
      const validStatuses = [5, 6, 7]; // Out for Delivery, Delivered, Cancelled
      if (!validStatuses.includes(newStatusId)) {
        throw new Error("Invalid status transition");
      }
  
      // Call API with raw integer value
      await UpdateOrderDeliveryStatusAPICall(orderId, newStatusId);
      
      // Update local state
      setOrders(orders.map(order => 
        order.orderId === orderId ? { 
          ...order, 
          statusId: newStatusId,
          isComplete: [6, 7].includes(newStatusId)
        } : order
      ));
      
      alert(`Order status updated to ${getStatusText(newStatusId)}`);
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.title || "Failed to update order status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (statusId) => {
    switch(statusId) {
      case 4: return "Ready for Pickup";
      case 5: return "Out for Delivery";
      case 6: return "Delivered";
      case 7: return "Cancelled";
      default: return "Unknown Status";
    }
  };

  const getNextStatus = (currentStatusId) => {
    switch(currentStatusId) {
      case 4: return { id: 5, text: "Out for Delivery" };
      case 5: return { id: 6, text: "Delivered" };
      default: return null;
    }
  };

  const calculateTotalPrice = (orderItems) => {
    return orderItems.reduce((total, item) => total + (item.quantity * item.priceAtPurchase), 0);
  };

  return (
    <div className={`delivery-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      {/* Sidebar */}
      <aside className="delivery-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <MdDeliveryDining className="delivery-icon" /> Delivery Panel
          </h2>
          <button onClick={toggleSidebar} className="sidebar-toggle">
            {isSidebarOpen ? <MdClose /> : <MdMenu />}
          </button>
        </div>
        
        <div className="sidebar-content">
          <ul>
            <li 
              className={activeItem === "Dashboard" ? "active" : ""}
              onClick={() => handleNavigation("/delivery-dashboard", "Dashboard")}
            >
              <MdDashboard className="nav-icon" />
              <span>Dashboard</span>
            </li>
            
            <li 
              className={activeItem === "Profile" ? "active" : ""}
              onClick={() => handleNavigation("/delivery-partner/profile/:partnerId", "Profile")}
            >
              <MdPerson className="nav-icon" />
              <span>Profile</span>
            </li>
            
          </ul>
        </div>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <IoMdLogOut className="logout-icon" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="delivery-main">
        {activeItem === "Profile" && deliveryPartner && (
          <div className="profile-section">
            <div className="profile-header">
              <h1>Your Profile</h1>
            </div>
            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{deliveryPartner.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{deliveryPartner.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{deliveryPartner.phoneNumber}</span>
              </div>
            </div>
          </div>
        )}

        {activeItem === "Dashboard" && (
          <>
            <div className="delivery-header">
              <h1>Welcome, {deliveryPartner?.name || 'Delivery Partner'}!</h1>
              <p>Your current deliveries and order status</p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <div className="order-list">
                {orders.length === 0 ? (
                  <p className="no-orders">No orders assigned yet.</p>
                ) : (
                  orders.map(order => (
                    <div className={`order-card status-${order.statusId}`} key={order.orderId}>
                      <div className="order-header">
                        <h3>Order #{order.orderId}</h3>
                        <span className={`status-badge status-${order.statusId}`}>
                          {getStatusText(order.statusId)}
                        </span>
                      </div>
                      
                      <div className="order-details">
                        <p><strong>Restaurant:</strong> {order.restaurantName}</p>
                        <p><strong>Customer:</strong> {order.customerName}</p>
                        <p><strong>Phone:</strong> {order.phoneNumber}</p>
                        <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                        
                        <div className="order-items">
                          <strong>Items:</strong>
                          <ul>
                            {order.orderItems.map((item, index) => (
                              <li key={index}>
                                {item.quantity}x {item.itemName} - {item.priceAtPurchase}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="total-price">
                          <strong>Total Price:</strong> ₹{calculateTotalPrice(order.orderItems).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="order-actions">
                        {getNextStatus(order.statusId) && (
                          <button 
                            className="action-btn"
                            onClick={() => updateOrderStatus(order.orderId, getNextStatus(order.statusId).id)}
                          >
                            Mark as {getNextStatus(order.statusId).text}
                          </button>
                        )}
                        
                        {order.statusId === 4 && (
                          <button 
                            className="action-btn cancel"
                            onClick={() => updateOrderStatus(order.orderId, 7)}
                          >
                            Cancel Delivery
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default DeliveryPartnerDashboard;
