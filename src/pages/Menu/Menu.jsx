import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import PageTitle from "../../components/common/PageTitle";
import MenuItemCard from "../../components/menu/MenuItemCard";
import CategoryFilter from "../../components/menu/CategoryFilter";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import useAlert from "../../hooks/useAlert";
import menuService from "../../api/menu";
import Card from "../../components/common/Card";

const Menu = () => {
  const { restaurant } = useAuth();
  const { success, error } = useAlert();

  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch menu items
  useEffect(() => {
    const fetchMenuItems = async () => {
      if (!restaurant) return;

      try {
        setLoading(true);
        const response = await menuService.getMenuItems(restaurant._id);

        if (response.success) {
          setMenuItems(response.data);

          // Extract unique categories
          const uniqueCategories = [
            ...new Set(response.data.map((item) => item.category)),
          ].filter(Boolean);

          setCategories(uniqueCategories);
        }
      } catch (err) {
        console.error("Error fetching menu items:", err);
        error("Failed to load menu items");
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurant, error]);

  // Toggle menu item availability
  const handleToggleAvailability = async (itemId) => {
    try {
      setActionLoading(true);
      const response = await menuService.toggleAvailability(itemId);

      if (response.success) {
        // Update state
        setMenuItems(
          menuItems.map((item) =>
            item._id === itemId ? { ...item, available: !item.available } : item
          )
        );

        success("Menu item availability updated");
      }
    } catch (err) {
      console.error("Error toggling availability:", err);
      error("Failed to update menu item availability");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete menu item
  const handleDeleteMenuItem = async (itemId) => {
    try {
      setActionLoading(true);
      const response = await menuService.deleteMenuItem(itemId);

      if (response.success) {
        // Remove from state
        setMenuItems(menuItems.filter((item) => item._id !== itemId));
        success("Menu item deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting menu item:", err);
      error("Failed to delete menu item");
    } finally {
      setActionLoading(false);
    }
  };

  // Filter menu items by category
  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div>
      <PageTitle
        title='Menu Management'
        subtitle='Create, edit and manage your menu items'
        actionButtonText='Add Menu Item'
        actionButtonIcon={<FaPlus />}
        onActionButtonClick={() => (window.location.href = "/menu/add")}
      />

      {/* Category Filter */}
      {categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      )}

      {/* Menu Items Grid */}
      {loading ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {[...Array(6)].map((_, index) => (
            <Card key={index} className='h-96'>
              <div className='animate-pulse h-full'>
                <div className='h-48 bg-gray-200 rounded-md mb-4'></div>
                <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
                <div className='h-3 bg-gray-200 rounded w-1/2 mb-4'></div>
                <div className='h-3 bg-gray-200 rounded w-full mb-4'></div>
                <div className='h-4 bg-gray-200 rounded w-1/4 mb-8'></div>
                <div className='flex justify-between mt-auto'>
                  <div className='h-8 bg-gray-200 rounded w-1/3'></div>
                  <div className='h-8 bg-gray-200 rounded w-1/3'></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item._id}
              menuItem={item}
              onToggleAvailability={handleToggleAvailability}
              onDelete={handleDeleteMenuItem}
              loading={actionLoading}
            />
          ))}
        </div>
      ) : (
        <div className='bg-white rounded-md shadow-sm p-8 text-center'>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            {categories.length > 0
              ? "No items in this category"
              : "Your menu is empty"}
          </h3>
          <p className='text-gray-500 mb-6'>
            {categories.length > 0
              ? "Select a different category or add a new item to this category"
              : "Start building your menu by adding your first item"}
          </p>
          <Link to='/menu/add'>
            <Button variant='primary'>
              <FaPlus className='mr-2' /> Add Menu Item
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Menu;
