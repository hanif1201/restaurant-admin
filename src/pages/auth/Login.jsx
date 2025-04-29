import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";
import useAlert from "../../hooks/useAlert";

const Login = () => {
  const { login } = useAuth();
  const { error } = useAlert();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const result = await login(data);

      if (!result || !result.success) {
        error(result?.error || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
            <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor='password'
            className='block text-sm font-medium text-gray-700'
          >
            Password
          </label>
          <div className='mt-1 relative rounded-md shadow-sm'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <FaLock className='text-gray-400' />
            </div>
            <input
              id='password'
              type='password'
              {...register("password", {
                required: "Password is required",
              })}
              className={`block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                errors.password ? "border-red-500" : ""
              }`}
              placeholder='Your password'
            />
          </div>
          {errors.password && (
            <p className='mt-1 text-sm text-red-600'>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me & Forgot password */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center'>
            <input
              id='remember-me'
              name='remember-me'
              type='checkbox'
              className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
            />
            <label
              htmlFor='remember-me'
              className='ml-2 block text-sm text-gray-900'
            >
              Remember me
            </label>
          </div>

          <div className='text-sm'>
            <Link
              to='/forgot-password'
              className='font-medium text-blue-600 hover:text-blue-500'
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Login button */}
        <div>
          <Button
            type='submit'
            variant='primary'
            loading={loading}
            disabled={loading}
            className='w-full'
          >
            Sign In
          </Button>
        </div>
      </form>

      {/* Contact support */}
      <div className='mt-6 text-center text-sm text-gray-500'>
        <p>
          Don't have a restaurant account?{" "}
          <a
            href='mailto:support@gochop.com'
            className='font-medium text-blue-600 hover:text-blue-500'
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
