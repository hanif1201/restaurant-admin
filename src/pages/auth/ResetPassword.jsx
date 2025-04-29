import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaLock, FaArrowLeft } from "react-icons/fa";
import Button from "../../components/common/Button";
import useAlert from "../../hooks/useAlert";
import authService from "../../api/auth";

const ResetPassword = () => {
  const { token } = useParams();
  const { success, error } = useAlert();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await authService.resetPassword(token, data.password);

      if (response.success) {
        success("Password has been reset successfully");
        navigate("/login");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      error(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='flex items-center mb-6'>
        <Link
          to='/login'
          className='flex items-center text-sm text-blue-600 hover:text-blue-500'
        >
          <FaArrowLeft className='mr-1' /> Back to login
        </Link>
      </div>

      <h3 className='text-lg font-medium text-gray-900 mb-2'>
        Create new password
      </h3>
      <p className='text-gray-600 mb-6'>
        Your new password must be at least 6 characters long.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* New Password */}
        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            New Password
          </label>
          <div className='mt-1 relative rounded-md shadow-sm'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <FaLock className='text-gray-400' />
            </div>
            <input
              id='password'
              type='password'
              {...register("password", {
                required: "New password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                errors.password ? "border-red-500" : ""
              }`}
              placeholder='Enter new password'
            />
          </div>
          {errors.password && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor='confirmPassword'
            className='block text-sm font-medium text-gray-700'
          >
            Confirm Password
          </label>
          <div className='mt-1 relative rounded-md shadow-sm'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <FaLock className='text-gray-400' />
            </div>
            <input
              id='confirmPassword'
              type='password'
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className={`block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              placeholder='Confirm new password'
            />
          </div>
          {errors.confirmPassword && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Submit button */}
        <div>
          <Button
            type='submit'
            variant='primary'
            loading={loading}
            disabled={loading}
            className='w-full'
          >
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
