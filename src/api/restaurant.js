import api from "./index";

const restaurantService = {
  // Get restaurant profile
  getRestaurantProfile: async () => {
    try {
      console.log("Fetching restaurant profile...");
      const userResponse = await api.get("/auth/me");
      console.log("User data:", userResponse.data);
      const userId = userResponse.data.data._id;

      const response = await api.get(`/restaurants?user=${userId}`);
      console.log("Restaurant data:", response.data);

      if (response.data.data.length > 0) {
        return response.data.data[0];
      } else {
        throw new Error("No restaurant found for this user");
      }
    } catch (error) {
      console.error("Error in getRestaurantProfile:", error);
      throw error.response ? error.response.data : error;
    }
  },

  // Get restaurant by ID
  getRestaurant: async (id) => {
    try {
      const response = await api.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Update restaurant profile
  updateRestaurant: async (id, restaurantData) => {
    try {
      const response = await api.put(`/restaurants/${id}`, restaurantData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Toggle restaurant status (open/closed)
  toggleStatus: async (id) => {
    try {
      const response = await api.put(`/restaurants/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Upload restaurant images
  uploadImage: async (id, imageType, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("type", imageType); // 'logo', 'cover', or 'gallery'

      const response = await api.post(`/restaurants/${id}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Get restaurant analytics
  getAnalytics: async (id, period = "30days") => {
    try {
      console.log(`Fetching analytics for restaurant ${id}, period: ${period}`);
      const response = await api.get(
        `/restaurants/${id}/analytics?period=${period}`
      );
      console.log("Analytics response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in getAnalytics:", error);
      throw (
        error.response?.data || {
          success: false,
          message: "Failed to fetch analytics",
        }
      );
    }
  },
};

export default restaurantService;
