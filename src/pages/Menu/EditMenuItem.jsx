import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageTitle from "../../components/common/PageTitle";
import MenuItemForm from "../../components/menu/MenuItemForm";
import Card from "../../components/common/Card";
import useAuth from "../../hooks/useAuth";
import useAlert from "../../hooks/useAlert";
import menuService from "../../api/menu";

const EditMenuItem = () => {
  const { id } = useParams();
  const { restaurant } = useAuth();
  const { success, error } = useAlert();
  const navigate = useNavigate();

  const [menuItem, setMenuItem] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch menu item and categories
  useEffect(() => {
    const fetchData = async () => {
      if (!restaurant) return;

      try {
        setLoading(true);

        // Fetch menu item details
        const itemResponse = await menuService.getMenuItem(id);

        if (itemResponse.success) {
          setMenuItem(itemResponse.data);
        } else {
          error("Menu item not found");
          navigate("/menu");
          return;
        }

        // Fetch all menu items to extract categories
        const menuResponse = await menuService.getMenuItems(restaurant._id);

        if (menuResponse.success) {
          // Extract unique categories
          const uniqueCategories = [
            ...new Set(menuResponse.data.map((item) => item.category)),
          ].filter(Boolean);

          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("Error fetching menu item:", err);
        error("Failed to load menu item details");
        navigate("/menu");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, restaurant, error, navigate]);

  // Handle form submission
  const handleSubmit = async (formData, menuItemId) => {
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

      const response = await menuService.updateMenuItem(menuItemId, formData);

      if (response.success) {
        success("Menu item updated successfully");
        navigate("/menu");
      }
    } catch (err) {
      console.error("Error updating menu item:", err);
      error(err.message || "Failed to update menu item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageTitle
        title='Edit Menu Item'
        subtitle='Update details for this menu item'
      />

      {loading ? (
        <Card>
          <div className='animate-pulse space-y-6'>
            <div className='h-6 bg-gray-200 rounded w-1/4'></div>
            <div className='h-10 bg-gray-200 rounded'></div>
            <div className='h-6 bg-gray-200 rounded w-1/4'></div>
            <div className='h-10 bg-gray-200 rounded'></div>
            <div className='h-6 bg-gray-200 rounded w-1/2'></div>
            <div className='h-32 bg-gray-200 rounded'></div>
          </div>
        </Card>
      ) : menuItem ? (
        <MenuItemForm
          menuItem={menuItem}
          onSubmit={handleSubmit}
          loading={submitting}
          categories={categories}
          restaurantId={restaurant?._id}
        />
      ) : (
        <Card>
          <div className='text-center py-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              Menu Item Not Found
            </h3>
            <p className='text-gray-500'>
              The menu item you're looking for doesn't exist or you don't have
              permission to edit it.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default EditMenuItem;
