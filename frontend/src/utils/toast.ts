import { toast, type ToastOptions } from 'react-toastify';

const toastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

export function showErrorToast(message: string, id: string) {
  toast.error(message, {
    ...toastOptions,
    toastId: id,
  });
}

export function showSuccessToast(message: string) {
  toast.success(message, toastOptions);
}