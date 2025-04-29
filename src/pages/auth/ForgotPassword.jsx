import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";
import Button from "../../components/common/Button";
import useAlert from "../../hooks/useAlert";
import authService from "../../api/auth";

const ForgotPassword = () => {
  const { success, error } = useAlert();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const email = watch("email");

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await authService.forgotPassword(data.email);

      if (response.success) {
        setEmailSent(true);
        success("Password reset instructions sent to your email");
      }
    } catch (err) {
      console.error("Error requesting password reset:", err);
      error(err.message || "Failed to request password reset");
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

      {emailSent ? (
        <div className='text-center'>
          <div className='w-12 h-12 bg-green-100 text-green-500 rounded-full mx-auto flex items-center justify-center mb-4'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Check your email
          </h3>
          <p className='text-gray-600 mb-4'>
            We've sent a password reset link to:
            <span className='block font-medium text-gray-900 mt-1'>
              {email}
            </span>
          </p>
          <p className='text-sm text-gray-500 mb-4'>
            If you don't see it, please check your spam folder.
          </p>
          <Button
            variant='outline'
            onClick={() => setEmailSent(false)}
            className='mt-2'
          >
            Try a different email
          </Button>
        </div>
      ) : (
        <>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            Reset your password
          </h3>
          <p className='text-gray-600 mb-6'>
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {/* Email */}
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700'
              >
                Email Address
              </label>
              <div className='mt-1 relative rounded-md shadow-sm'>
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <FaEnvelope className='text-gray-400' />
                </div>
                <input
                  id='email'
                  type='email'
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder='your@email.com'
                />
              </div>
              {errors.email && (
                <p className='mt-1 text-sm text-red-600'>
                  {errors.email.message}
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
                Send Reset Link
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default ForgotPassword;
