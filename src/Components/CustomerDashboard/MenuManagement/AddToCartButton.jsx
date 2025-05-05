import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addCartItem } from "../../../Services/CustomerService";
import "./AddToCartButton.css";

const AddToCartButton = ({ item, customerId, onItemAdded }) => {
  const navigate = useNavigate();
  const [isAdded, setIsAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleAddToCart = async () => {
    try {
      if (!customerId) {
        alert("Please log in to add items to the cart.");
        navigate("/login");
        return;
      }

      if (!item.isAvailable) {
        alert("This item is currently unavailable.");
        return;
      }

      if (isAdded) {
        alert("This item is already in your cart.");
        return;
      }

      setIsLoading(true);
      setError(null);

      const cartItemCreate = {
        menuItemId: item.menuItemId || item.id,
        quantity: 1,
      };

      await addCartItem(customerId, cartItemCreate);
      setIsAdded(true);
      if (onItemAdded) onItemAdded(item.menuItemId || item.id);
      alert(`${item.name || item.itemName} has been added to your cart!`);
    } catch (err) {
      console.error("Add to cart error:", err);
      setError("Failed to add item to cart. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!item.isAvailable) {
    return <span className="unavailable-text">Currently Unavailable</span>;
  }

  return (
    <>
      <button
        className={`add-to-cart-btn ${isAdded ? "added" : ""}`}
        onClick={handleAddToCart}
        disabled={isAdded || isLoading}
        aria-label={`Add ${item.name || item.itemName} to cart`}
      >
        {isLoading ? "Adding..." : isAdded ? "Added to Cart" : "Add to Cart"}
      </button>
      {error && <span className="error-text">{error}</span>}
    </>
  );
};

export default AddToCartButton;