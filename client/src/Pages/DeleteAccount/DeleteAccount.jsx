import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/hooks';
import { loginUser, logoutUser } from '../../store/slices/authSlice';
import { deleteAccount } from '../../services/forumService';
import bgAddBusinessImage from '../../assets/images/bg-addbusiness.png';

const DeleteAccount = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('error');
  const [showToast, setShowToast] = useState(false);

  const { register, handleSubmit, formState: { errors }, getValues } = useForm({
    shouldFocusError: true,
    defaultValues: { delete_email: '', delete_password: '' },
  });

  const onDeleteClick = () => {
    const { delete_email: email, delete_password: password } = getValues();
    if (!email?.trim() || !password) return;
    setShowConfirmModal(true);
  };

  const onConfirmDelete = async () => {
    const { delete_email: email, delete_password: password } = getValues();
    setShowConfirmModal(false);
    setIsSubmitting(true);
    try {
      const loginResult = await dispatch(loginUser({ email, password })).unwrap();
      const token = loginResult?.data?.accessToken ?? loginResult?.data?.token ?? loginResult?.accessToken ?? loginResult?.token;
      if (!token) {
        setToastMessage('Could not verify your credentials.');
        setToastVariant('error');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
        return;
      }
      await deleteAccount({ token });
      setToastMessage('Your account has been deleted.');
      setToastVariant('success');
      setShowToast(true);
      dispatch(logoutUser());
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1500);
    } catch (err) {
      setToastMessage(err?.message || err || 'Failed to delete account. Check your email and password.');
      setToastVariant('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="w-full min-h-screen relative flex items-center justify-center py-8 sm:py-12 md:py-16"
      style={{
        backgroundImage: `url(${bgAddBusinessImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-20 z-0" />
      <div className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6">
        <div
          className="bg-white shadow-lg p-6 sm:p-8 md:p-10"
          style={{ borderRadius: '38px', border: '1px solid #ADADAD' }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2 text-center">
            Delete Account
          </h1>
          <p className="text-primary/80 text-sm text-center mb-6">
            Enter your email and password to permanently delete your account. This action cannot be undone.
          </p>

          {showToast && (
            <div
              className={`fixed top-4 right-4 z-50 max-w-sm px-4 py-3 rounded-lg text-sm shadow-lg ${
                toastVariant === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'
              }`}
            >
              {toastMessage}
            </div>
          )}

          <form onSubmit={handleSubmit(onDeleteClick)} className="space-y-4 sm:space-y-5" autoComplete="off">
            {/* Hidden inputs so browser autofill targets these instead of visible fields */}
            <div className="absolute -left-[9999px] w-0 h-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
              <input type="text" name="email" tabIndex={-1} autoComplete="off" readOnly defaultValue="" />
              <input type="password" name="password" tabIndex={-1} autoComplete="off" readOnly defaultValue="" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Email Address</label>
              <input
                type="text"
                inputMode="email"
                placeholder="Email Address"
                autoComplete="off"
                {...register('delete_email', { required: 'Email is required' })}
                className={`w-full px-4 py-3 rounded-[12px] border ${
                  errors.delete_email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`}
              />
              {errors.delete_email && (
                <p className="text-red-500 text-sm mt-1">{errors.delete_email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-primary mb-2">Password</label>
              <input
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                {...register('delete_password', { required: 'Password is required' })}
                className={`w-full px-4 py-3 rounded-[12px] border ${
                  errors.delete_password ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-primary placeholder:text-gray-400 bg-gray-100`}
              />
              {errors.delete_password && (
                <p className="text-red-500 text-sm mt-1">{errors.delete_password.message}</p>
              )}
            </div>
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-secondary py-3 sm:py-4 rounded-[7px] font-semibold text-base sm:text-lg hover:bg-primary-hover transition-colors shadow-md disabled:opacity-70"
              >
                {isSubmitting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-primary mb-4 text-center">
              Are you sure you want to delete?
            </h3>
            <p className="text-gray-600 mb-6 text-center text-sm">
              Your account and all associated data will be permanently removed. This cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-[#3C1F1B] border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirmDelete}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccount;
