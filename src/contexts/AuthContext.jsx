import React, { createContext, useEffect, useState, useCallback } from "react";
import authService from "../api/auth";
import restaurantService from "../api/restaurant";

// Create authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        if (authService.isAuthenticated()) {
          // Fetch current user data
          const userData = await authService.getCurrentUser();
          setUser(userData.data);

          // If user is a restaurant, fetch restaurant data
          if (userData.data.role === "restaurant") {
            try {
              const restaurantData =
                await restaurantService.getRestaurantProfile();
              setRestaurant(restaurantData);
            } catch (err) {
              console.error("Error fetching restaurant:", err);
            }
          }
        }
      } catch (err) {
        console.error("Authentication error:", err);
        setError(err.message || "Authentication failed");

        // If there's an auth error, logout
        await authService.logout();
        setUser(null);
        setRestaurant(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(credentials);

      if (response.success) {
        setUser(response.user);

        // If user is a restaurant, fetch restaurant data
        if (response.user.role === "restaurant") {
          try {
            const restaurantData =
              await restaurantService.getRestaurantProfile();
            setRestaurant(restaurantData);
          } catch (err) {
            console.error("Error fetching restaurant:", err);
          }
        }

        return { success: true };
      }
    } catch (err) {
      setError(err.message || "Login failed");
      return { success: false, error: err.message || "Login failed" };
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setRestaurant(null);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.updateUserDetails(userData);

      if (response.success) {
        setUser(response.data);
        return { success: true };
      }
    } catch (err) {
      setError(err.message || "Profile update failed");
      return { success: false, error: err.message || "Profile update failed" };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update restaurant profile
  const updateRestaurantProfile = useCallback(
    async (restaurantData) => {
      if (!restaurant) return { success: false, error: "No restaurant found" };

      try {
        setLoading(true);
        setError(null);

        const response = await restaurantService.updateRestaurant(
          restaurant._id,
          restaurantData
        );

        if (response.success) {
          setRestaurant(response.data);
          return { success: true };
        }
      } catch (err) {
        setError(err.message || "Restaurant update failed");
        return {
          success: false,
          error: err.message || "Restaurant update failed",
        };
      } finally {
        setLoading(false);
      }
    },
    [restaurant]
  );

  // Toggle restaurant status (open/closed)
  const toggleRestaurantStatus = useCallback(async () => {
    if (!restaurant) return { success: false, error: "No restaurant found" };

    try {
      setLoading(true);
      setError(null);

      const response = await restaurantService.toggleStatus(restaurant._id);

      if (response.success) {
        setRestaurant(response.data);
        return { success: true };
      }
    } catch (err) {
      setError(err.message || "Status toggle failed");
      return {
        success: false,
        error: err.message || "Status toggle failed",
      };
    } finally {
      setLoading(false);
    }
  }, [restaurant]);

  // Context value
  const value = {
    user,
    restaurant,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile,
    updateRestaurantProfile,
    toggleRestaurantStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
