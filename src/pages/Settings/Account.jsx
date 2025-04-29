import React, { useState } from "react";
import { useForm } from "react-hook-form";
import PageTitle from "../../components/common/PageTitle";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import useAlert from "../../hooks/useAlert";
import authService from "../../api/auth";

const Account = () => {
  const { user, updateProfile } = useAuth();
  const { success, error } = useAlert();

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);

  // Profile form
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
    reset: resetProfile,
  } = useForm({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  // Password form
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPassword,
    watch: watchPassword,
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Watch new password for confirmation validation
  const newPassword = watchPassword("newPassword");

  // Handle profile update
  const onUpdateProfile = async (data) => {
    try {
      setLoadingProfile(true);

      const response = await authService.updateUserDetails(data);

      if (response.success) {
        updateProfile(response.data);
        success("Account details updated successfully");
        resetProfile(data);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      error(err.message || "Failed to update account details");
    } finally {
      setLoadingProfile(false);
    }
  };

  // Handle password update
  const onUpdatePassword = async (data) => {
    try {
      setLoadingPassword(true);

      const response = await authService.updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (response.success) {
        success("Password updated successfully");
        resetPassword({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.error("Error updating password:", err);
      error(err.message || "Failed to update password");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div>
      <PageTitle
        title='Account Settings'
        subtitle='Manage your personal account details'
      />

      <div className='space-y-6'>
        {/* Profile Information */}
        <Card title='Profile Information'>
          <form
            onSubmit={handleSubmitProfile(onUpdateProfile)}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Name */}
              <div>
                <label
                  htmlFor='name'
                  className='block text-sm font-medium text-gray-700'
                >
                  Full Name<span className='text-red-500'>*</span>
                </label>
                <input
                  id='name'
                  type='text'
                  {...registerProfile("name", { required: "Name is required" })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    profileErrors.name ? "border-red-500" : ""
                  }`}
                />
                {profileErrors.name && (
                  <p className='mt-1 text-sm text-red-600'>
                    {profileErrors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Email Address<span className='text-red-500'>*</span>
                </label>
                <input
                  id='email'
                  type='email'
                  {...registerProfile("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    profileErrors.email ? "border-red-500" : ""
                  }`}
                />
                {profileErrors.email && (
                  <p className='mt-1 text-sm text-red-600'>
                    {profileErrors.email.message}
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
                  {...registerProfile("phone", {
                    required: "Phone number is required",
                  })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    profileErrors.phone ? "border-red-500" : ""
                  }`}
                />
                {profileErrors.phone && (
                  <p className='mt-1 text-sm text-red-600'>
                    {profileErrors.phone.message}
                  </p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className='flex justify-end'>
              <Button
                type='submit'
                variant='primary'
                loading={loadingProfile}
                disabled={loadingProfile}
              >
                Update Profile
              </Button>
            </div>
          </form>
        </Card>

        {/* Password Settings */}
        <Card title='Change Password'>
          <form
            onSubmit={handleSubmitPassword(onUpdatePassword)}
            className='space-y-6'
          >
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Current Password */}
              <div className='md:col-span-2'>
                <label
                  htmlFor='currentPassword'
                  className='block text-sm font-medium text-gray-700'
                >
                  Current Password<span className='text-red-500'>*</span>
                </label>
                <input
                  id='currentPassword'
                  type='password'
                  {...registerPassword("currentPassword", {
                    required: "Current password is required",
                  })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    passwordErrors.currentPassword ? "border-red-500" : ""
                  }`}
                />
                {passwordErrors.currentPassword && (
                  <p className='mt-1 text-sm text-red-600'>
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor='newPassword'
                  className='block text-sm font-medium text-gray-700'
                >
                  New Password<span className='text-red-500'>*</span>
                </label>
                <input
                  id='newPassword'
                  type='password'
                  {...registerPassword("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    passwordErrors.newPassword ? "border-red-500" : ""
                  }`}
                />
                {passwordErrors.newPassword && (
                  <p className='mt-1 text-sm text-red-600'>
                    {passwordErrors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium text-gray-700'
                >
                  Confirm Password<span className='text-red-500'>*</span>
                </label>
                <input
                  id='confirmPassword'
                  type='password'
                  {...registerPassword("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === newPassword || "Passwords do not match",
                  })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    passwordErrors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
                {passwordErrors.confirmPassword && (
                  <p className='mt-1 text-sm text-red-600'>
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className='flex justify-end'>
              <Button
                type='submit'
                variant='primary'
                loading={loadingPassword}
                disabled={loadingPassword}
              >
                Change Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Account;
