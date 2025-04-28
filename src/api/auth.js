import api from "./index";

const authService = {
  // Login function
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);

      // If login is successful, store the token and user info
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Logout function
  logout: async () => {
    try {
      // Call the backend logout endpoint
      await api.get("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Remove token and user from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Update user details
  updateUserDetails: async (userData) => {
    try {
      const response = await api.put("/auth/updatedetails", userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Update password
  updatePassword: async (passwordData) => {
    try {
      const response = await api.put("/auth/updatepassword", passwordData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Request password reset
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgotpassword", { email });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Reset password with token
  resetPassword: async (token, password) => {
    try {
      const response = await api.put(`/auth/resetpassword/${token}`, {
        password,
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return localStorage.getItem("token") !== null;
  },

  // Get stored user
  getUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authService;
