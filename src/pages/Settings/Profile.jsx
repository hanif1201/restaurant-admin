import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FaCamera } from "react-icons/fa";
import PageTitle from "../../components/common/PageTitle";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import useAlert from "../../hooks/useAlert";
import restaurantService from "../../api/restaurant";

const Profile = () => {
  const { restaurant, updateRestaurantProfile } = useAuth();
  const { success, error } = useAlert();

  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  // Setup form with restaurant data
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      email: "",
      phone: "",
      address: "",
      cuisineType: [],
      minimumOrder: 0,
      deliveryFee: 0,
      deliveryTime: 30,
      freeDeliveryThreshold: 0,
      taxPercentage: 0,
    },
  });

  // Initialize form with restaurant data when available
  useEffect(() => {
    if (restaurant) {
      reset({
        name: restaurant.name || "",
        description: restaurant.description || "",
        email: restaurant.email || "",
        phone: restaurant.phone || "",
        address: restaurant.address || "",
        cuisineType: restaurant.cuisineType || [],
        minimumOrder: restaurant.minimumOrder || 0,
        deliveryFee: restaurant.deliveryFee || 0,
        deliveryTime: restaurant.deliveryTime || 30,
        freeDeliveryThreshold: restaurant.freeDeliveryThreshold || 0,
        taxPercentage: restaurant.taxPercentage || 0,
      });

      // Set image previews
      if (restaurant.logo) {
        setLogoPreview(restaurant.logo);
      }

      if (restaurant.coverImage) {
        setCoverPreview(restaurant.coverImage);
      }
    }
  }, [restaurant, reset]);

  // Handle logo image change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cover image change
  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (!restaurant) {
      error("Restaurant information not found");
      return;
    }

    try {
      setLoading(true);

      // Convert cuisine types from string to array if needed
      if (typeof data.cuisineType === "string") {
        data.cuisineType = data.cuisineType
          .split(",")
          .map((type) => type.trim());
      }

      // Convert numeric fields to numbers
      data.minimumOrder = parseFloat(data.minimumOrder);
      data.deliveryFee = parseFloat(data.deliveryFee);
      data.deliveryTime = parseInt(data.deliveryTime);
      data.freeDeliveryThreshold = parseFloat(data.freeDeliveryThreshold);
      data.taxPercentage = parseFloat(data.taxPercentage);

      const response = await restaurantService.updateRestaurant(
        restaurant._id,
        data
      );

      if (response.success) {
        // Update restaurant in auth context
        updateRestaurantProfile(response.data);
        success("Restaurant profile updated successfully");

        // Handle image uploads if changed
        const logoInput = document.getElementById("logo-upload");
        const coverInput = document.getElementById("cover-upload");

        if (logoInput.files.length > 0) {
          const logoFormData = new FormData();
          logoFormData.append("image", logoInput.files[0]);
          logoFormData.append("type", "logo");

          await restaurantService.uploadImage(
            restaurant._id,
            "logo",
            logoInput.files[0]
          );
        }

        if (coverInput.files.length > 0) {
          const coverFormData = new FormData();
          coverFormData.append("image", coverInput.files[0]);
          coverFormData.append("type", "cover");

          await restaurantService.uploadImage(
            restaurant._id,
            "cover",
            coverInput.files[0]
          );
        }
      }
    } catch (err) {
      console.error("Error updating restaurant profile:", err);
      error(err.message || "Failed to update restaurant profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageTitle
        title='Restaurant Profile'
        subtitle='Manage your restaurant information'
      />

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Restaurant Images */}
        <Card title='Restaurant Images'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Logo Upload */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Restaurant Logo
              </label>
              <div className='flex items-center'>
                <div className='mr-4 h-20 w-20 relative rounded-md overflow-hidden bg-gray-100'>
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt='Restaurant logo'
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <div className='h-full w-full flex items-center justify-center text-gray-400'>
                      <FaCamera size={24} />
                    </div>
                  )}
                </div>
                <div className='flex-1'>
                  <input
                    id='logo-upload'
                    type='file'
                    accept='image/*'
                    onChange={handleLogoChange}
                    className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                  />
                  <p className='mt-1 text-xs text-gray-500'>
                    Recommended size: 200x200 pixels
                  </p>
                </div>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Cover Image
              </label>
              <div className='flex items-center'>
                <div className='mr-4 h-20 w-32 relative rounded-md overflow-hidden bg-gray-100'>
                  {coverPreview ? (
                    <img
                      src={coverPreview}
                      alt='Restaurant cover'
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <div className='h-full w-full flex items-center justify-center text-gray-400'>
                      <FaCamera size={24} />
                    </div>
                  )}
                </div>
                <div className='flex-1'>
                  <input
                    id='cover-upload'
                    type='file'
                    accept='image/*'
                    onChange={handleCoverChange}
                    className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                  />
                  <p className='mt-1 text-xs text-gray-500'>
                    Recommended size: 1200x400 pixels
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Basic Information */}
        <Card title='Basic Information'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Restaurant Name */}
            <div>
              <label
                htmlFor='name'
                className='block text-sm font-medium text-gray-700'
              >
                Restaurant Name<span className='text-red-500'>*</span>
              </label>
              <input
                id='name'
                type='text'
                {...register("name", {
                  required: "Restaurant name is required",
                })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email Address
              </label>
              <input
                id='email'
                type='email'
                {...register("email", {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                  errors.email ? "border-red-500" : ""
                }`}
              />
              {errors.email && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor='phone'
                className='block text-sm font-medium text-gray-700'
              >
                Phone Number<span className='text-red-500'>*</span>
              </label>
              <input
                id='phone'
                type='text'
                {...register("phone", { required: "Phone number is required" })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                  errors.phone ? "border-red-500" : ""
                }`}
              />
              {errors.phone && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor='address'
                className='block text-sm font-medium text-gray-700'
              >
                Address<span className='text-red-500'>*</span>
              </label>
              <input
                id='address'
                type='text'
                {...register("address", { required: "Address is required" })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                  errors.address ? "border-red-500" : ""
                }`}
              />
              {errors.address && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Cuisine Type */}
            <div className='md:col-span-2'>
              <label
                htmlFor='cuisineType'
                className='block text-sm font-medium text-gray-700'
              >
                Cuisine Types<span className='text-red-500'>*</span>
              </label>
              <input
                id='cuisineType'
                type='text'
                {...register("cuisineType", {
                  required: "At least one cuisine type is required",
                })}
                placeholder='Italian, Chinese, Fast Food, etc. (comma-separated)'
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                  errors.cuisineType ? "border-red-500" : ""
                }`}
              />
              {errors.cuisineType && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.cuisineType.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className='md:col-span-2'>
              <label
                htmlFor='description'
                className='block text-sm font-medium text-gray-700'
              >
                Description<span className='text-red-500'>*</span>
              </label>
              <textarea
                id='description'
                rows={3}
                {...register("description", {
                  required: "Description is required",
                  maxLength: {
                    value: 500,
                    message: "Description cannot exceed 500 characters",
                  },
                })}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                  errors.description ? "border-red-500" : ""
                }`}
                placeholder='Tell customers about your restaurant...'
              />
              {errors.description && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Delivery Settings */}
        <Card title='Delivery Settings'>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Minimum Order */}
            <div>
              <label
                htmlFor='minimumOrder'
                className='block text-sm font-medium text-gray-700'
              >
                Minimum Order Amount ($)
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <span className='text-gray-500 sm:text-sm'>$</span>
                </div>
                <input
                  id='minimumOrder'
                  type='number'
                  step='0.01'
                  min='0'
                  {...register("minimumOrder", { valueAsNumber: true })}
                  className='block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                  placeholder='0.00'
                />
              </div>
            </div>

            {/* Delivery Fee */}
            <div>
              <label
                htmlFor='deliveryFee'
                className='block text-sm font-medium text-gray-700'
              >
                Delivery Fee ($)
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <span className='text-gray-500 sm:text-sm'>$</span>
                </div>
                <input
                  id='deliveryFee'
                  type='number'
                  step='0.01'
                  min='0'
                  {...register("deliveryFee", { valueAsNumber: true })}
                  className='block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                  placeholder='0.00'
                />
              </div>
            </div>

            {/* Free Delivery Threshold */}
            <div>
              <label
                htmlFor='freeDeliveryThreshold'
                className='block text-sm font-medium text-gray-700'
              >
                Free Delivery Threshold ($)
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <span className='text-gray-500 sm:text-sm'>$</span>
                </div>
                <input
                  id='freeDeliveryThreshold'
                  type='number'
                  step='0.01'
                  min='0'
                  {...register("freeDeliveryThreshold", {
                    valueAsNumber: true,
                  })}
                  className='block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                  placeholder='0.00'
                />
                <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                  <span className='text-gray-500 sm:text-sm'>
                    Set 0 for no free delivery
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Time */}
            <div>
              <label
                htmlFor='deliveryTime'
                className='block text-sm font-medium text-gray-700'
              >
                Average Delivery Time (minutes)
              </label>
              <input
                id='deliveryTime'
                type='number'
                min='1'
                {...register("deliveryTime", { valueAsNumber: true })}
                className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
              />
            </div>

            {/* Tax Percentage */}
            <div>
              <label
                htmlFor='taxPercentage'
                className='block text-sm font-medium text-gray-700'
              >
                Tax Percentage (%)
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <input
                  id='taxPercentage'
                  type='number'
                  step='0.01'
                  min='0'
                  max='100'
                  {...register("taxPercentage", { valueAsNumber: true })}
                  className='block w-full pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                  placeholder='0.00'
                />
                <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                  <span className='text-gray-500 sm:text-sm'>%</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Form Actions */}
        <div className='flex justify-end'>
          <Button
            type='submit'
            variant='primary'
            loading={loading}
            disabled={loading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
