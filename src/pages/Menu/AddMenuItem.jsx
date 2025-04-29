import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import MenuItemForm from "../../components/menu/MenuItemForm";
import useAuth from "../../hooks/useAuth";
import useAlert from "../../hooks/useAlert";
import menuService from "../../api/menu";

const AddMenuItem = () => {
  const { restaurant } = useAuth();
  const { success, error } = useAlert();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch existing categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (!restaurant) return;

      try {
        setLoading(true);
        const response = await menuService.getMenuItems(restaurant._id);

        if (response.success) {
          // Extract unique categories
          const uniqueCategories = [
            ...new Set(response.data.map((item) => item.category)),
          ].filter(Boolean);

          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [restaurant]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    if (!restaurant) {
      error("Restaurant information not found");
      return;
    }

    try {
      setSubmitting(true);

      // If a new category was entered
      if (formData.get("category") === "other" && formData.get("newCategory")) {
        formData.set("category", formData.get("newCategory"));
      }

      formData.set("restaurant", restaurant._id);

      const response = await menuService.createMenuItem(formData);

      if (response.success) {
        success("Menu item added successfully");
        navigate("/menu");
      }
    } catch (err) {
      console.error("Error adding menu item:", err);
      error(err.message || "Failed to add menu item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageTitle
        title='Add Menu Item'
        subtitle='Create a new dish or product for your menu'
      />

      <MenuItemForm
        onSubmit={handleSubmit}
        loading={submitting}
        categories={categories}
        restaurantId={restaurant?._id}
      />
    </div>
  );
};

export default AddMenuItem;
