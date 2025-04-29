import React, { createContext, useState, useEffect } from "react";
import restaurantService from "../api/restaurant";
import useAuth from "../hooks/useAuth";
import useAlert from "../hooks/useAlert";

export const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const { user } = useAuth();
  const { error: showError } = useAlert();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!user) {
        setRestaurant(null);
        setLoading(false);
        return;
      }

      try {
        const data = await restaurantService.getRestaurantProfile();
        setRestaurant(data);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        showError("Failed to load restaurant data");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [user, showError]);

  const updateRestaurant = async (restaurantData) => {
    try {
      setLoading(true);
      const response = await restaurantService.updateRestaurant(
        restaurant._id,
        restaurantData
      );
      setRestaurant(response.data);
      return { success: true };
    } catch (err) {
      console.error("Error updating restaurant:", err);
      showError(err.message || "Failed to update restaurant");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const toggleRestaurantStatus = async () => {
    try {
      setLoading(true);
      const response = await restaurantService.toggleStatus(restaurant._id);
      setRestaurant(response.data);
      return { success: true };
    } catch (err) {
      console.error("Error toggling restaurant status:", err);
      showError(err.message || "Failed to update restaurant status");
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <RestaurantContext.Provider
      value={{
        restaurant,
        loading,
        updateRestaurant,
        toggleRestaurantStatus,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
};

export default RestaurantContext;
