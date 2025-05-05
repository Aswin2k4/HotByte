import React, { useEffect, useState } from "react";
import {
  getCustomerWithAddress,
  getCustomerOrders,
} from "../../Services/CustomerService";
import "./CustomerProfile.css";

const CustomerProfile = () => {
  const customerId = JSON.parse(sessionStorage.getItem("user"))?.id;

  const [activeTab, setActiveTab] = useState("basic");
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (!customerId) return;

      try {
        const [customerRes, orderRes] = await Promise.all([
          getCustomerWithAddress(customerId),
          getCustomerOrders(customerId),
        ]);

        setCustomer(customerRes.data);

        const sortedOrders = orderRes.data.sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
      } catch (error) {
        console.error("Failed to fetch customer data:", error);
      }
    }

    fetchData();
  }, [customerId]);

  return (
    <div className="cp-customer-profile">
      <h2>Customer Profile</h2>
      <div className="cp-tabs">
        <button
          className={activeTab === "basic" ? "cp-active" : ""}
          onClick={() => setActiveTab("basic")}
        >
          Basic Info
        </button>
        <button
          className={activeTab === "address" ? "cp-active" : ""}
          onClick={() => setActiveTab("address")}
        >
          Addresses
        </button>
        <button
          className={activeTab === "orders" ? "cp-active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Orders
        </button>
      </div>

      <div className="cp-tab-content">
        {activeTab === "basic" && customer && (
          <div className="cp-info">
            <p style={{ fontSize: "1.2rem" }}>
              <strong>Name:</strong> {customer.name}
            </p>
            <p style={{ fontSize: "1.2rem" }}>
              <strong>Gender:</strong> {customer.gender}
            </p>
            <p style={{ fontSize: "1.2rem" }}>
              <strong>Email:</strong> {customer.email}
            </p>
            <p style={{ fontSize: "1.2rem" }}>
              <strong>Phone:</strong> {customer.phone}
            </p>
          </div>
        )}

        {activeTab === "address" && customer?.addresses && (
          <div className="cp-info">
            <h3>Addresses</h3>
            {customer.addresses.length > 0 ? (
              customer.addresses.map((address, index) => (
                <div key={index} className="cp-address-card">
                  <p style={{ fontSize: "1.05rem" }}>
                    <strong>Label:</strong> {address.label}
                  </p>
                  <p style={{ fontSize: "1.05rem" }}>
                    <strong>Street:</strong> {address.street}
                  </p>
                  <p style={{ fontSize: "1.05rem" }}>
                    <strong>City:</strong> {address.city}
                  </p>
                  <p style={{ fontSize: "1.05rem" }}>
                    <strong>Pincode:</strong> {address.pincode}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ fontSize: "1.05rem" }}>No address found.</p>
            )}
          </div>
        )}

        {activeTab === "orders" && (
          <div className="cp-orders">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div key={order.orderId} className="cp-order-card">
                  <p style={{ fontSize: "1.05rem" }}>
                    <strong>Order ID:</strong> {order.orderId}
                  </p>
                  <p style={{ fontSize: "1.05rem" }}>
                    <strong>Date:</strong>{" "}
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <p style={{ fontSize: "1.05rem" }}>
                    <strong>Status:</strong> {order.orderStatus}
                  </p>
                  <p style={{ fontSize: "1.05rem" }}>
                    <strong>Total:</strong> ₹{order.totalAmount}
                  </p>

                  <div className="cp-order-items">
                    <h3>Items:</h3>
                    {Array.isArray(order.orderItems) &&
                    order.orderItems.length > 0 ? (
                      order.orderItems.map((item, itemIndex) => (
                        <div key={itemIndex} className="cp-order-item">
                          <p style={{ fontSize: "1.05rem" }}>
                            <strong>Item:</strong> {item.menuItemName}
                          </p>
                          <p style={{ fontSize: "1.05rem" }}>
                            <strong>Quantity:</strong> {item.quantity}
                          </p>
                          <p style={{ fontSize: "1.05rem" }}>
                            <strong>Price:</strong> ₹{item.price}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p style={{ fontSize: "1.05rem" }}>No items found.</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
