import api from "./index";

const orderService = {
  getOrders: async (params = {}) => {
    try {
      console.log("Fetching orders with params:", params);
      const response = await api.get("/orders", { params });
      console.log("Orders API raw response:", response);

      // The response structure is { success: true, data: [...orders] }
      const orders = response.data?.data || [];
      console.log("Processed orders:", {
        count: orders.length,
        sample: orders[0],
        structure: orders.length > 0 ? Object.keys(orders[0]) : [],
      });

      // Return the orders array directly
      return {
        success: true,
        data: orders, // Don't nest data twice
      };
    } catch (error) {
      console.error("Error in getOrders:", error);
      throw error.response?.data || error;
    }
  },

  getOrder: async (id) => {
    try {
      console.log("Fetching order details:", id);
      const response = await api.get(`/orders/${id}`);
      console.log("Order details response:", response.data);
      return {
        success: response.data.success,
        data: response.data.data,
      };
    } catch (error) {
      console.error("Error in getOrder:", error);
      throw error.response?.data || error;
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      console.log("Updating order status:", { id, status });
      const response = await api.put(`/orders/${id}/status`, { status });
      console.log("Update status response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error in updateOrderStatus:", error);
      throw error.response?.data || error;
    }
  },
};

export default orderService;
