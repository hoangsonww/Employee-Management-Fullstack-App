/**
 * Thin wrapper around react-toastify so the whole app shares one consistent notification style and
 * a single place to tweak behaviour. Prefer these helpers over rendering inline error/success text.
 */
import { toast } from 'react-toastify';
import { extractApiError } from './apiError';

const BASE_OPTIONS = {
  position: 'bottom-center',
  autoClose: 4500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored',
};

export const notifySuccess = (message, options = {}) => toast.success(message, { ...BASE_OPTIONS, ...options });

export const notifyError = (message, options = {}) => toast.error(message, { ...BASE_OPTIONS, autoClose: 6000, ...options });

export const notifyInfo = (message, options = {}) => toast.info(message, { ...BASE_OPTIONS, ...options });

export const notifyWarning = (message, options = {}) => toast.warning(message, { ...BASE_OPTIONS, ...options });

export const notifyLoading = message => toast.loading(message, { ...BASE_OPTIONS, autoClose: false });

/**
 * Resolve or fail an existing toast created with `notifyLoading`.
 *
 * @param {import('react-toastify').Id} id the toast id returned by notifyLoading
 * @param {'success'|'error'|'info'|'warning'} type the final toast type
 * @param {string} message the final message
 */
export const updateToast = (id, type, message, options = {}) => toast.update(id, { render: message, type, isLoading: false, ...BASE_OPTIONS, ...options });

/**
 * Show an error toast with the most specific message we can pull from an API/axios error.
 *
 * @param {unknown} error the thrown error
 * @param {string} [fallback] copy to use when nothing more specific is available
 */
export const notifyApiError = (error, fallback, options = {}) => notifyError(extractApiError(error, fallback), options);
