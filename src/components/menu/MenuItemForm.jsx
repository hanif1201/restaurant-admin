import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaPlus, FaTrash, FaTimes } from "react-icons/fa";
import Button from "../common/Button";
import Card from "../common/Card";

const MenuItemForm = ({
  menuItem = null,
  onSubmit,
  loading = false,
  categories = [],
  restaurantId,
}) => {
  // Initialize with either existing menuItem or defaults
  const defaultValues = menuItem
    ? {
        ...menuItem,
      }
    : {
        name: "",
        description: "",
        price: "",
        category: "",
        isVeg: false,
        isVegan: false,
        isGlutenFree: false,
        preparationTime: 15,
        spicyLevel: 0,
        available: true,
        featured: false,
      };

  // Set up form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm({ defaultValues });

  // Watch values for controlled components
  const watchSpicyLevel = watch("spicyLevel", defaultValues.spicyLevel);

  // State for image preview
  const [imagePreview, setImagePreview] = useState(menuItem?.image || null);

  // State for customization options
  const [customizations, setCustomizations] = useState(
    menuItem?.customizationOptions || []
  );

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new customization option
  const addCustomization = () => {
    setCustomizations([
      ...customizations,
      {
        name: "",
        required: false,
        multiSelect: false,
        options: [{ name: "", price: 0 }],
      },
    ]);
  };

  // Remove a customization option
  const removeCustomization = (index) => {
    const newCustomizations = [...customizations];
    newCustomizations.splice(index, 1);
    setCustomizations(newCustomizations);
  };

  // Update a customization
  const updateCustomization = (index, field, value) => {
    const newCustomizations = [...customizations];
    newCustomizations[index][field] = value;
    setCustomizations(newCustomizations);
  };

  // Add an option to a customization
  const addOption = (customizationIndex) => {
    const newCustomizations = [...customizations];
    newCustomizations[customizationIndex].options.push({ name: "", price: 0 });
    setCustomizations(newCustomizations);
  };

  // Remove an option from a customization
  const removeOption = (customizationIndex, optionIndex) => {
    const newCustomizations = [...customizations];
    newCustomizations[customizationIndex].options.splice(optionIndex, 1);
    setCustomizations(newCustomizations);
  };

  // Update an option
  const updateOption = (customizationIndex, optionIndex, field, value) => {
    const newCustomizations = [...customizations];
    newCustomizations[customizationIndex].options[optionIndex][field] = value;
    setCustomizations(newCustomizations);
  };

  // Handle form submission
  const onFormSubmit = (data) => {
    // Create FormData to handle file upload
    const formData = new FormData();

    // Add basic data
    for (const key in data) {
      if (key !== "image") {
        formData.append(key, data[key]);
      }
    }

    // Add restaurant ID
    formData.append("restaurant", restaurantId);

    // Add customization options
    formData.append("customizationOptions", JSON.stringify(customizations));

    // Add image if present
    if (data.image && data.image.length > 0) {
      formData.append("image", data.image[0]);
    }

    // Submit form
    onSubmit(formData, menuItem?._id);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className='space-y-6'>
      {/* Basic Information */}
      <Card title='Basic Information'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Name */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Name<span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              {...register("name", { required: "Name is required" })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Price<span className='text-red-500'>*</span>
            </label>
            <div className='mt-1 relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <span className='text-gray-500 sm:text-sm'>$</span>
              </div>
              <input
                type='number'
                step='0.01'
                min='0'
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                  valueAsNumber: true,
                })}
                className={`block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                  errors.price ? "border-red-500" : ""
                }`}
                placeholder='0.00'
              />
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                <span className='text-gray-500 sm:text-sm'>USD</span>
              </div>
            </div>
            {errors.price && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Discounted Price */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Discounted Price
            </label>
            <div className='mt-1 relative rounded-md shadow-sm'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <span className='text-gray-500 sm:text-sm'>$</span>
              </div>
              <input
                type='number'
                step='0.01'
                min='0'
                {...register("discountedPrice", {
                  min: { value: 0, message: "Price must be positive" },
                  valueAsNumber: true,
                })}
                className={`block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                  errors.discountedPrice ? "border-red-500" : ""
                }`}
                placeholder='0.00'
              />
              <div className='absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none'>
                <span className='text-gray-500 sm:text-sm'>USD</span>
              </div>
            </div>
            {errors.discountedPrice && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.discountedPrice.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Category<span className='text-red-500'>*</span>
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                errors.category ? "border-red-500" : ""
              }`}
            >
              <option value=''>Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
              <option value='other'>Other/New</option>
            </select>
            {watch("category") === "other" && (
              <input
                type='text'
                placeholder='Enter new category'
                {...register("newCategory")}
                className='mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
              />
            )}
            {errors.category && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700'>
              Description<span className='text-red-500'>*</span>
            </label>
            <textarea
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
              placeholder='Describe your dish...'
            />
            {errors.description && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Preparation Time */}
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Preparation Time (minutes)
            </label>
            <input
              type='number'
              min='1'
              {...register("preparationTime", {
                min: {
                  value: 1,
                  message: "Preparation time must be at least 1 minute",
                },
                valueAsNumber: true,
              })}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
            />
            {errors.preparationTime && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.preparationTime.message}
              </p>
            )}
          </div>

          {/* Spicy Level */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Spicy Level: {watchSpicyLevel}
            </label>
            <input
              type='range'
              min='0'
              max='3'
              step='1'
              {...register("spicyLevel", { valueAsNumber: true })}
              className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
            />
            <div className='flex justify-between text-xs text-gray-600 mt-1'>
              <span>Not Spicy</span>
              <span>Mild</span>
              <span>Medium</span>
              <span>Hot</span>
            </div>
          </div>
        </div>

        {/* Dietary Options & Featured Checkboxes */}
        <div className='grid grid-cols-2 gap-4 mt-6 md:grid-cols-4'>
          <div className='flex items-center'>
            <input
              type='checkbox'
              id='isVeg'
              {...register("isVeg")}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label htmlFor='isVeg' className='ml-2 block text-sm text-gray-700'>
              Vegetarian
            </label>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='isVegan'
              {...register("isVegan")}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label
              htmlFor='isVegan'
              className='ml-2 block text-sm text-gray-700'
            >
              Vegan
            </label>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='isGlutenFree'
              {...register("isGlutenFree")}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label
              htmlFor='isGlutenFree'
              className='ml-2 block text-sm text-gray-700'
            >
              Gluten Free
            </label>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='featured'
              {...register("featured")}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label
              htmlFor='featured'
              className='ml-2 block text-sm text-gray-700'
            >
              Featured Item
            </label>
          </div>

          <div className='flex items-center'>
            <input
              type='checkbox'
              id='available'
              {...register("available")}
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label
              htmlFor='available'
              className='ml-2 block text-sm text-gray-700'
            >
              Available
            </label>
          </div>
        </div>
      </Card>

      {/* Image Upload */}
      <Card title='Item Image'>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Upload Image
            </label>
            <input
              type='file'
              accept='image/*'
              {...register("image")}
              onChange={handleImageChange}
              className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
            />
            <p className='mt-1 text-sm text-gray-500'>
              JPG, PNG, or GIF up to 5MB
            </p>
          </div>

          {/* Image Preview */}
          <div className='flex items-center justify-center'>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt='Item preview'
                className='h-48 w-full object-cover rounded-md'
              />
            ) : (
              <div className='h-48 w-full bg-gray-100 rounded-md flex items-center justify-center'>
                <span className='text-gray-400 text-sm'>No image</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Customization Options */}
      <Card
        title='Customization Options'
        footer={
          <Button
            type='button'
            variant='outline'
            onClick={addCustomization}
            size='sm'
          >
            <FaPlus className='mr-1' /> Add Customization
          </Button>
        }
      >
        {customizations.length === 0 ? (
          <div className='text-center py-4 text-gray-500'>
            <p>No customization options added yet.</p>
            <p className='text-sm'>
              Click the button below to add customization options like "Size",
              "Toppings", etc.
            </p>
          </div>
        ) : (
          <div className='space-y-6'>
            {customizations.map((customization, index) => (
              <div key={index} className='border rounded-md p-4 relative'>
                <button
                  type='button'
                  onClick={() => removeCustomization(index)}
                  className='absolute top-2 right-2 text-gray-400 hover:text-red-600'
                >
                  <FaTimes size={16} />
                </button>

                {/* Customization name and settings */}
                <div className='grid grid-cols-1 gap-4 mb-4 md:grid-cols-3'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700'>
                      Customization Name
                    </label>
                    <input
                      type='text'
                      value={customization.name}
                      onChange={(e) =>
                        updateCustomization(index, "name", e.target.value)
                      }
                      placeholder='e.g., Size, Toppings, etc.'
                      className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                    />
                  </div>

                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      id={`required-${index}`}
                      checked={customization.required}
                      onChange={(e) =>
                        updateCustomization(index, "required", e.target.checked)
                      }
                      className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                    />
                    <label
                      htmlFor={`required-${index}`}
                      className='ml-2 block text-sm text-gray-700'
                    >
                      Required
                    </label>
                  </div>

                  <div className='flex items-center'>
                    <input
                      type='checkbox'
                      id={`multiSelect-${index}`}
                      checked={customization.multiSelect}
                      onChange={(e) =>
                        updateCustomization(
                          index,
                          "multiSelect",
                          e.target.checked
                        )
                      }
                      className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                    />
                    <label
                      htmlFor={`multiSelect-${index}`}
                      className='ml-2 block text-sm text-gray-700'
                    >
                      Allow Multiple Selections
                    </label>
                  </div>
                </div>

                {/* Options */}
                <div className='mt-4'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Options
                  </label>

                  {customization.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className='flex items-center space-x-2 mb-2'
                    >
                      <input
                        type='text'
                        value={option.name}
                        onChange={(e) =>
                          updateOption(
                            index,
                            optionIndex,
                            "name",
                            e.target.value
                          )
                        }
                        placeholder='Option name'
                        className='flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                      />

                      <div className='relative w-24'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                          <span className='text-gray-500 sm:text-sm'>$</span>
                        </div>
                        <input
                          type='number'
                          step='0.01'
                          min='0'
                          value={option.price}
                          onChange={(e) =>
                            updateOption(
                              index,
                              optionIndex,
                              "price",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          placeholder='0.00'
                          className='block w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'
                        />
                      </div>

                      <button
                        type='button'
                        onClick={() => removeOption(index, optionIndex)}
                        disabled={customization.options.length <= 1}
                        className='text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed'
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  ))}

                  <button
                    type='button'
                    onClick={() => addOption(index)}
                    className='mt-2 inline-flex items-center px-3 py-1 border border-blue-600 text-xs font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50'
                  >
                    <FaPlus className='mr-1' /> Add Option
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Form Actions */}
      <div className='flex justify-end space-x-4'>
        <Button
          type='button'
          variant='secondary'
          onClick={() => window.history.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type='submit'
          variant='primary'
          loading={loading}
          disabled={loading}
        >
          {menuItem ? "Update Menu Item" : "Create Menu Item"}
        </Button>
      </div>
    </form>
  );
};

export default MenuItemForm;
