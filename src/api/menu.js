import api from "./index";

const menuService = {
  // Get all menu items for the restaurant
  getMenuItems: async (restaurantId) => {
    try {
      const response = await api.get(`/menu?restaurant=${restaurantId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Get a specific menu item
  getMenuItem: async (id) => {
    try {
      const response = await api.get(`/menu/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Create a new menu item
  createMenuItem: async (menuItemData) => {
    try {
      const response = await api.post("/menu", menuItemData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Update a menu item
  updateMenuItem: async (id, menuItemData) => {
    try {
      const response = await api.put(`/menu/${id}`, menuItemData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Delete a menu item
  deleteMenuItem: async (id) => {
    try {
      const response = await api.delete(`/menu/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Toggle menu item availability
  toggleAvailability: async (id) => {
    try {
      const response = await api.put(`/menu/${id}/toggle-availability`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Upload menu item image
  uploadImage: async (id, imageFile) => {
    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await api.post(`/menu/${id}/image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
};

export default menuService;
