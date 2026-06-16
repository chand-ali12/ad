import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { forgetPassword, setError, setMessage } from '../../../store/slices';

const ForgetPassword = ({ className = "" }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { status, error, message } = useAppSelector((state) => state.auth);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('error');
  const [showToast, setShowToast] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    shouldFocusError: true,
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    reset({ email: '' });
    dispatch(setError(null));
    dispatch(setMessage(null));
  }, [location.pathname, reset, dispatch]);

  useEffect(() => {
    if (error) {
      setToastMessage(error);
      setToastVariant('error');
      setShowToast(true);
    } else if (message) {
      setToastMessage(message);
      setToastVariant('success');
      setShowToast(true);
    } else {
      return;
    }

    const timer = setTimeout(() => {
      setShowToast(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [error, message]);

  const onSubmit = (data) => {
    dispatch(forgetPassword({ email: data.email }));
  };

  const toastStyles =
    toastVariant === 'success'
      ? 'border-green-200 bg-green-50 text-green-700'
      : 'border-red-200 bg-red-50 text-red-700';

  return (
    <section className={`w-full pb-12 bg-[#F5F5F0] flex items-start justify-center pt-8 md:pt-12 ${className}`}>
      {showToast && (
        <div
          className={`fixed top-4 right-4 z-[9999] max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg ${toastStyles}`}
          role="alert"
        >
          {toastMessage}
        </div>
      )}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[22px] shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            {/* Page heading + description (match general section styles) */}
            <div className="mb-6 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-primary">
                Forgot your password?
              </h2>
              <p className="mt-2 text-sm sm:text-base md:text-lg leading-relaxed text-primary opacity-80">
                Enter the email associated with your account and we&apos;ll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-primary text-secondary py-3 sm:py-4 rounded-[7px] font-medium text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

ForgetPassword.propTypes = {
  className: PropTypes.string,
};

export default ForgetPassword;
